import { render, fireEvent } from '@testing-library/react';
import SemPermissao from './sem-permissao';

jest.mock('~/componentes/card', () => ({ children }) => (
  <div data-testid="card">{children}</div>
));
jest.mock('~/componentes/button', () => props => {
  const { border, ...rest } = props;
  return (
    <button data-testid="btn-voltar" onClick={props.onClick}>
      {props.label}
    </button>
  );
});
jest.mock('~/componentes/colors', () => ({ Colors: { Azul: 'blue' } }));
jest.mock('~/constantes/url', () => ({ URL_HOME: '/home' }));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate }));

describe('SemPermissao', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renderiza mensagem de sem permissão', () => {
    const { getByText } = render(<SemPermissao />);
    expect(
      getByText('Você não tem acesso a esta funcionalidade!')
    ).toBeInTheDocument();
  });

  it('renderiza botão Voltar', () => {
    const { getByTestId } = render(<SemPermissao />);
    expect(getByTestId('btn-voltar').textContent).toBe('Voltar');
  });

  it('navega para home ao clicar em Voltar', () => {
    const { getByTestId } = render(<SemPermissao />);
    fireEvent.click(getByTestId('btn-voltar'));
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});
