import { render, screen, fireEvent } from '@testing-library/react';
import TransferenciaLista from './TransferenciaLista';

// mocks simples para DataTable e Label
jest.mock('~/componentes', () => ({
  DataTable: () => <div data-testid="DataTable" />,
  Label: ({ text }) => <div data-testid="Label">{text}</div>,
}));

describe('TransferenciaLista', () => {
  const defaultProps = {
    listaEsquerda: {
      title: 'Lista Esquerda',
      selectMultipleRows: true,
    },
    listaDireita: {
      title: 'Lista Direita',
      selectMultipleRows: true,
    },
    onClickAdicionar: jest.fn(),
    onClickRemover: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente com os títulos', () => {
    render(<TransferenciaLista {...defaultProps} />);

    expect(screen.getAllByTestId('Label')[0]).toHaveTextContent(
      'Lista Esquerda'
    );
    expect(screen.getAllByTestId('Label')[1]).toHaveTextContent(
      'Lista Direita'
    );
    expect(screen.getAllByTestId('DataTable').length).toBe(2);
  });

  it('chama onClickAdicionar quando botão de adicionar é clicado', () => {
    render(<TransferenciaLista {...defaultProps} />);

    const botaoAdicionar = document.getElementById(
      'SGP_BUTTON_ADICIONAR_TRANSFERENCIA_LISTA'
    );
    fireEvent.click(botaoAdicionar);

    expect(defaultProps.onClickAdicionar).toHaveBeenCalled();
  });

  it('chama onClickRemover quando botão de remover é clicado', () => {
    render(<TransferenciaLista {...defaultProps} />);

    const botaoRemover = document.getElementById(
      'SGP_BUTTON_REMOVER_TRANSFERENCIA_LISTA'
    );
    fireEvent.click(botaoRemover);

    expect(defaultProps.onClickRemover).toHaveBeenCalled();
  });

  it('não chama onClickAdicionar quando desabilitado', () => {
    const props = {
      ...defaultProps,
      listaEsquerda: {
        ...defaultProps.listaEsquerda,
        selectMultipleRows: false,
      },
    };

    render(<TransferenciaLista {...props} />);

    const botaoAdicionar = document.getElementById(
      'SGP_BUTTON_ADICIONAR_TRANSFERENCIA_LISTA'
    );
    fireEvent.click(botaoAdicionar);

    expect(defaultProps.onClickAdicionar).not.toHaveBeenCalled();
  });

  it('não chama onClickRemover quando desabilitado', () => {
    const props = {
      ...defaultProps,
      listaDireita: {
        ...defaultProps.listaDireita,
        selectMultipleRows: false,
      },
    };

    render(<TransferenciaLista {...props} />);

    const botaoRemover = document.getElementById(
      'SGP_BUTTON_REMOVER_TRANSFERENCIA_LISTA'
    );
    fireEvent.click(botaoRemover);

    expect(defaultProps.onClickRemover).not.toHaveBeenCalled();
  });

  it('não chama onClickAdicionar quando disabilitarBotaoAdicionar está true', () => {
    const props = {
      ...defaultProps,
      listaEsquerda: {
        ...defaultProps.listaEsquerda,
        selectMultipleRows: true,
        disabilitarBotaoAdicionar: true,
      },
    };

    render(<TransferenciaLista {...props} />);

    const botaoAdicionar = document.getElementById(
      'SGP_BUTTON_ADICIONAR_TRANSFERENCIA_LISTA'
    );
    fireEvent.click(botaoAdicionar);

    expect(defaultProps.onClickAdicionar).not.toHaveBeenCalled();
  });

  it('aplica defaults quando nenhuma prop for passada', () => {
    render(<TransferenciaLista />);

    expect(screen.getAllByTestId('DataTable').length).toBe(2);
  });
});
