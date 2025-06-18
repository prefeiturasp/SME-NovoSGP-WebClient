import { render, fireEvent } from '@testing-library/react';
import PaginaComErro from './pagina-com-erro';

jest.mock('shortid', () => ({ generate: () => 'mocked-id' }));
jest.mock('~/componentes/card', () => ({ children }) => (
  <div data-testid="card">{children}</div>
));
jest.mock('~/componentes/button', () => props => {
  const { border, ...rest } = props;
  return (
    <button data-testid="btn-voltar" {...rest}>
      {props.label}
    </button>
  );
});
jest.mock('~/componentes/colors', () => ({ Colors: { Azul: 'blue' } }));
jest.mock('~/constantes/url', () => ({ URL_HOME: '/home' }));
jest.mock('./pagina-com-erro.css', () => ({
  Corpo: props => <div data-testid="corpo" {...props} />,
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate }));

describe('PaginaComErro', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza Card, Corpo, mensagem e botão', () => {
    const { getByTestId, getByText } = render(<PaginaComErro />);
    expect(getByTestId('card')).toBeInTheDocument();
    expect(getByTestId('corpo')).toBeInTheDocument();
    expect(getByText('Ocorreu um erro!')).toBeInTheDocument();
    expect(getByTestId('btn-voltar')).toBeInTheDocument();
    expect(getByTestId('btn-voltar').textContent).toContain('Voltar');
  });

  it('chama navigate ao clicar no botão Voltar', () => {
    const { getByTestId } = render(<PaginaComErro />);
    fireEvent.click(getByTestId('btn-voltar'));
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('usa o id gerado pelo shortid', () => {
    const { getByTestId } = render(<PaginaComErro />);
    expect(getByTestId('btn-voltar').id).toBe('mocked-id');
  });
});
