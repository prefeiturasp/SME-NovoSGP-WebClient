import { fireEvent, render, screen } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import ModalConfirmacao from './modalConfirmacao';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('~/componentes', () => ({
  Loader: ({ children }) => <div>{children}</div>,
}));

jest.mock('../componentes/button', () => ({
  __esModule: true,
  default: ({ onClick, label, id = '' }) => (
    <button type="button" onClick={onClick} id={id}>
      {label}
    </button>
  ),
}));

const dispatch = jest.fn();

const renderizarComConfirmacao = confirmacao => {
  useSelector.mockImplementation(selector =>
    selector({ alertas: { confirmacao } })
  );
  return render(<ModalConfirmacao />);
};

const confirmacaoBase = {
  visivel: true,
  titulo: 'Atenção',
  texto: '',
  textoNegrito: 'Deseja continuar?',
  textoOk: 'Sim',
  textoCancelar: 'Não',
};

const ordemDosBotoes = () =>
  screen
    .getAllByRole('button')
    .map(botao => botao.textContent)
    .filter(texto => texto === 'Sim' || texto === 'Não');

describe('ModalConfirmacao (alertas)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(dispatch);
  });

  it('exibe [Sim] [Não] quando inverterBotoes não é informado', () => {
    renderizarComConfirmacao({ ...confirmacaoBase, resolve: jest.fn() });

    expect(ordemDosBotoes()).toEqual(['Sim', 'Não']);
  });

  it('exibe [Não] [Sim] quando inverterBotoes é verdadeiro', () => {
    renderizarComConfirmacao({
      ...confirmacaoBase,
      resolve: jest.fn(),
      inverterBotoes: true,
    });

    expect(ordemDosBotoes()).toEqual(['Não', 'Sim']);
  });

  it('com os botões invertidos, Sim continua confirmando', () => {
    const resolve = jest.fn();
    renderizarComConfirmacao({
      ...confirmacaoBase,
      resolve,
      inverterBotoes: true,
    });

    fireEvent.click(screen.getByText('Sim'));

    expect(resolve).toHaveBeenCalledWith(true);
    expect(dispatch).toHaveBeenCalledWith({
      type: '@alertas/fecharConfirmacao',
    });
  });

  it('com os botões invertidos, Não continua cancelando', () => {
    const resolve = jest.fn();
    renderizarComConfirmacao({
      ...confirmacaoBase,
      resolve,
      inverterBotoes: true,
    });

    fireEvent.click(screen.getByText('Não'));

    expect(resolve).toHaveBeenCalledWith(false);
  });

  it('não renderiza nada quando a confirmação não está visível', () => {
    renderizarComConfirmacao({
      ...confirmacaoBase,
      visivel: false,
      resolve: jest.fn(),
    });

    expect(screen.queryByText('Deseja continuar?')).not.toBeInTheDocument();
  });
});
