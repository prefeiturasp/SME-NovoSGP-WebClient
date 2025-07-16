import { render, fireEvent } from '@testing-library/react';
import ModalMultiLinhas from './modalMultiLinhas';
import { SGP_BUTTON_OK_MODAL } from '~/constantes/ids/button';

jest.mock('./button', () => ({
  __esModule: true,
  default: ({ onClick, label, id = '', border, ...props }) => (
    <button onClick={onClick} id={id} {...props}>
      {label}
    </button>
  ),
}));
jest.mock('shortid', () => {
  let mockCallCount = 0;
  return {
    generate: () => `id-mock-${mockCallCount++}`,
  };
});

const baseProps = {
  id: 'modal-id',
  visivel: true,
  onClose: jest.fn(),
  conteudo: ['Linha 1', 'Linha 2'],
  titulo: 'Título',
  type: 'info',
};

describe('ModalMultiLinhas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente com múltiplas linhas', () => {
    const { getByText } = render(<ModalMultiLinhas {...baseProps} />);
    expect(getByText('Linha 1')).toBeInTheDocument();
    expect(getByText('Linha 2')).toBeInTheDocument();
    expect(getByText('Título')).toBeInTheDocument();
    expect(getByText('Ok')).toBeInTheDocument();
  });

  it('chama onClose ao clicar no botão Ok', () => {
    const { getByText } = render(<ModalMultiLinhas {...baseProps} />);
    fireEvent.click(getByText('Ok'));
    expect(baseProps.onClose).toHaveBeenCalled();
  });

  it('usa id padrão do botão quando id não é passado', () => {
    const { getByText } = render(
      <ModalMultiLinhas {...baseProps} id={undefined} />
    );
    const botaoOk = getByText('Ok');
    expect(botaoOk.id).toBe(SGP_BUTTON_OK_MODAL);
  });

  it('renderiza sem conteudo', () => {
    const { container } = render(
      <ModalMultiLinhas {...baseProps} conteudo={undefined} />
    );
    expect(container.querySelectorAll('p').length).toBe(0);
  });
});
