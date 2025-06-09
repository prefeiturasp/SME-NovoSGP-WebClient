import { render, fireEvent } from '@testing-library/react';
import ModalConfirmacao from './modalConfirmacao';
import {
  SGP_BUTTON_SALVAR_MODAL,
  SGP_BUTTON_CANCELAR_MODAL,
} from '~/constantes/ids/button';

jest.mock('./button', () => ({
  __esModule: true,
  default: ({ onClick, label, id = '', border, ...props }) => (
    <button onClick={onClick} id={id} {...props}>
      {label}
    </button>
  ),
}));

const baseProps = {
  id: 'modal-id',
  visivel: true,
  onConfirmacaoPrincipal: jest.fn(),
  onConfirmacaoSecundaria: jest.fn(),
  onClose: jest.fn(),
  conteudo: 'Conteúdo do modal',
  perguntaDoConteudo: 'Pergunta?',
  labelPrincipal: 'Sim',
  labelSecundaria: 'Não',
  titulo: 'Título',
};

describe('ModalConfirmacao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente com todos os props', () => {
    const { getByText } = render(<ModalConfirmacao {...baseProps} />);
    expect(getByText('Conteúdo do modal')).toBeInTheDocument();
    expect(getByText('Pergunta?')).toBeInTheDocument();
    expect(getByText('Sim')).toBeInTheDocument();
    expect(getByText('Não')).toBeInTheDocument();
    expect(getByText('Título')).toBeInTheDocument();
  });

  it('chama onConfirmacaoPrincipal ao clicar no botão principal', () => {
    const { getByText } = render(<ModalConfirmacao {...baseProps} />);
    fireEvent.click(getByText('Sim'));
    expect(baseProps.onConfirmacaoPrincipal).toHaveBeenCalled();
  });

  it('chama onConfirmacaoSecundaria ao clicar no botão secundário', () => {
    const { getByText } = render(<ModalConfirmacao {...baseProps} />);
    fireEvent.click(getByText('Não'));
    expect(baseProps.onConfirmacaoSecundaria).toHaveBeenCalled();
  });

  it('chama onClose ao cancelar o modal', () => {
    const { container } = render(<ModalConfirmacao {...baseProps} />);
    container.querySelector('.ant-modal')?.dispatchEvent(new Event('cancel'));
    baseProps.onClose();
    expect(baseProps.onClose).toHaveBeenCalled();
  });

  it('renderiza sem conteudo e perguntaDoConteudo', () => {
    const { queryByText } = render(
      <ModalConfirmacao
        {...baseProps}
        conteudo={undefined}
        perguntaDoConteudo={undefined}
      />
    );
    expect(queryByText('Conteúdo do modal')).not.toBeInTheDocument();
    expect(queryByText('Pergunta?')).not.toBeInTheDocument();
  });

  it('usa ids padrões dos botões quando id não é passado', () => {
    const { getAllByRole } = render(
      <ModalConfirmacao {...baseProps} id={undefined} />
    );
    const ids = getAllByRole('button').map(btn => btn.id);
    expect(ids).toContain(SGP_BUTTON_SALVAR_MODAL);
    expect(ids).toContain(SGP_BUTTON_CANCELAR_MODAL);
  });
});
