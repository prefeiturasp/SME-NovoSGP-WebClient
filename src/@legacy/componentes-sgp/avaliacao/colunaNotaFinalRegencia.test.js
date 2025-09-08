import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ColunaNotaFinalRegencia from './colunaNotaFinalRegencia';

const mockStore = configureStore([]);

describe('ColunaNotaFinalRegencia', () => {
  it('deve renderizar o ícone corretamente', () => {
    const store = mockStore({ notasConceitos: { expandirLinha: [] } });
    render(
      <Provider store={store}>
        <ColunaNotaFinalRegencia indexLinha={0} />
      </Provider>
    );
    expect(document.querySelector('.fas')).toBeInTheDocument();
  });

  it('deve disparar ação ao clicar no ícone', () => {
    const store = mockStore({ notasConceitos: { expandirLinha: [] } });
    store.dispatch = jest.fn();
    render(
      <Provider store={store}>
        <ColunaNotaFinalRegencia indexLinha={0} />
      </Provider>
    );
    const icon = document.querySelector('.fas');
    fireEvent.click(icon);
    expect(store.dispatch).toHaveBeenCalled();
  });
});