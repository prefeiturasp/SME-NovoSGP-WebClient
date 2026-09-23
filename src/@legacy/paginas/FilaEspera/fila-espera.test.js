import { render, screen, fireEvent } from '@testing-library/react';
import FilaEspera from './fila-espera';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));
jest.mock('react-redux', () => ({
  useSelector: cb => cb({ usuarioFilaEspera: { numeroFila: 7 } }),
}));
jest.mock('~/componentes/card', () => () => null);
jest.mock('~/componentes/button', () => () => null);
jest.mock('~/componentes/colors', () => ({ Colors: {} }));

describe('FilaEspera', () => {
  it('exibe posição na fila e textos de espera', () => {
    render(<FilaEspera />);
    expect(screen.getByText(/sala/i)).toBeInTheDocument();
    expect(screen.getByText(/Sua posição na fila: 7/)).toBeInTheDocument();
    expect(screen.getByText(/Não atualize a página/)).toBeInTheDocument();
  });

  it('navega para login da sondagem ao clicar no link', () => {
    render(<FilaEspera />);
    fireEvent.click(screen.getByText('clique aqui'));
    expect(mockNavigate).toHaveBeenCalledWith('/login-sondagem');
  });
});
