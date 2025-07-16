import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ModalErrosPlanoAnual from './ModalErrosPlanoAnual';

jest.mock('~/componentes', () => ({
  ModalMultiLinhas: ({ visivel, onClose, conteudo, titulo }) =>
    visivel ? (
      <div data-testid="modal-multilinhas">
        <span>{titulo}</span>
        <div>{conteudo && conteudo.join(',')}</div>
        <button data-testid="close-btn" onClick={onClose}>
          Fechar
        </button>
      </div>
    ) : null,
}));

const mockStore = configureStore([]);

describe('ModalErrosPlanoAnual', () => {
  it('não renderiza o modal quando exibirModalErrosPlanoAnual é false', () => {
    const store = mockStore({
      planoAnual: { exibirModalErrosPlanoAnual: false, errosPlanoAnual: [] },
    });
    const { queryByTestId } = render(
      <Provider store={store}>
        <ModalErrosPlanoAnual />
      </Provider>
    );
    expect(queryByTestId('modal-multilinhas')).toBeNull();
  });

  it('renderiza o modal com erros e título quando exibirModalErrosPlanoAnual é true', () => {
    const store = mockStore({
      planoAnual: {
        exibirModalErrosPlanoAnual: true,
        errosPlanoAnual: ['Erro 1', 'Erro 2'],
      },
    });
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <ModalErrosPlanoAnual />
      </Provider>
    );
    expect(getByTestId('modal-multilinhas')).toBeInTheDocument();
    expect(getByText('Erros Plano anual')).toBeInTheDocument();
    expect(getByTestId('modal-multilinhas')).toHaveTextContent('Erro 1,Erro 2');
  });

  it('ao fechar o modal, despacha as actions corretas', () => {
    const store = mockStore({
      planoAnual: {
        exibirModalErrosPlanoAnual: true,
        errosPlanoAnual: ['Erro 1'],
      },
    });
    store.dispatch = jest.fn();
    const { getByTestId } = render(
      <Provider store={store}>
        <ModalErrosPlanoAnual />
      </Provider>
    );
    fireEvent.click(getByTestId('close-btn'));
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch).toHaveBeenCalledWith({
      type: '@planoAnual/setExibirModalErrosPlanoAnual',
      payload: false,
    });
    expect(store.dispatch).toHaveBeenCalledWith({
      type: '@planoAnual/setErrosPlanoAnual',
      payload: [],
    });
  });
});
