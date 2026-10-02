import { render, screen } from '@testing-library/react';
import Orientacoes from './orientacoes';

describe('Orientacoes', () => {
  it('renderiza texto sobre e-mail cadastrado', () => {
    render(<Orientacoes />);
    expect(
      screen.getByText(/informe seu usuário ou RF/i)
    ).toBeInTheDocument();
  });

  it('renderiza texto sobre e-mail não cadastrado', () => {
    render(<Orientacoes />);
    expect(
      screen.getByText(/procure o responsável pelo SGP/i)
    ).toBeInTheDocument();
  });
});
