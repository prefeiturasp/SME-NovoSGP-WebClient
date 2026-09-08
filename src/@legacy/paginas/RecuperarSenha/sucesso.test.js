import { render, screen } from '@testing-library/react';
import Sucesso from './sucesso';

describe('Sucesso', () => {
  it('mascara o e-mail e pede para verificar a caixa de entrada', () => {
    render(<Sucesso email="usuario@escola.com" />);
    expect(
      screen.getByText(/Seu link de recuperação de senha foi enviado para/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Verifique sua caixa de entrada/)).toBeInTheDocument();
    expect(screen.getByText(/usu\*+@escola.com/)).toBeInTheDocument();
  });
});
