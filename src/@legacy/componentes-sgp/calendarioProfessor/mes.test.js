import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Mes from './Mes';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import * as actions from '~/redux/modulos/calendarioProfessor/actions';

jest.mock('~/componentes/colors', () => ({
  Base: {
    CinzaCalendario: '#ccc',
    Preto: '#000',
    Roxo: '#800080',
    Branco: '#fff',
  },
  Colors: {
    Roxo: '#800080',
    Branco: '#fff',
  },
}));

jest.useFakeTimers();

const mockStore = configureStore([]);

describe('Mes component', () => {
  let store;

  const createMutableStore = (mesAberto = false) => {
    return mockStore({
      calendarioProfessor: {
        meses: {
          1: {
            nome: 'Janeiro',
            estaAberto: mesAberto,
            className: 'mes-janeiro',
          },
        },
      },
    });
  };

  beforeEach(() => {
    store = createMutableStore();
    store.dispatch = jest.fn();
  });

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <Mes
          numeroMes="1"
          filtros={{ tipoCalendarioSelecionado: true }}
          {...props}
        />
      </Provider>
    );
  };

  it('deve renderizar o nome do mês', () => {
    renderComponent();
    expect(screen.getByText('Janeiro')).toBeInTheDocument();
  });
});
