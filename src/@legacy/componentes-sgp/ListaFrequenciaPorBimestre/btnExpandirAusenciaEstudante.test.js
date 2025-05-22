import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import BtnExpandirAusenciaEstudante from './btnExpandirAusenciaEstudante';

const mockStore = configureMockStore();

describe('BtnExpandirAusenciaEstudante', () => {
  const defaultState = {
    listaFrequenciaPorBimestre: {
      expandirLinhaAusenciaEstudante: [false, true, false],
    },
  };

  const renderComponent = (indexLinha = 1) => {
    const store = mockStore(defaultState);
    return render(
      <Provider store={store}>
        <BtnExpandirAusenciaEstudante indexLinha={indexLinha} />
      </Provider>
    );
  };

  it('deve exibir ícone de chevron-up quando expandido', () => {
    renderComponent(1);
    const icon = screen.getByTestId('btn-expandir');
    expect(icon).toHaveClass('fa-chevron-up');
  });

  it('deve exibir ícone de chevron-down quando recolhido', () => {
    renderComponent(0);
    const icon = screen.getByTestId('btn-expandir');
    expect(icon).toHaveClass('fa-chevron-down');
  });
});
