import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PainelFrequenciaDre from './painelFrequenciaDre';

describe('PainelFrequenciaDre', () => {
  it('renderiza título e descrição', () => {
    render(<PainelFrequenciaDre dreCodigo={123} anoLetivo={2024} />);
    expect(
      screen.getByRole('heading', { name: /Painel de frequência/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Aqui, você encontra informações sobre a frequência escolar dos alunos/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });

  it('renderiza controles de data', () => {
    render(<PainelFrequenciaDre dreCodigo={123} anoLetivo={2024} />);
    expect(screen.getByText(/Dados do dia:/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Dia anterior/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Próximo dia/i })
    ).toBeInTheDocument();
  });

  it('renderiza tabela vazia inicialmente', () => {
    render(<PainelFrequenciaDre dreCodigo={123} anoLetivo={2024} />);
    expect(screen.getByText(/Sem dados/i)).toBeInTheDocument();
  });

  it('chama função de mudar dia ao clicar nos botões', () => {
    render(<PainelFrequenciaDre dreCodigo={123} anoLetivo={2024} />);
    const btnAnterior = screen.getByRole('button', { name: /Dia anterior/i });
    const btnProximo = screen.getByRole('button', { name: /Próximo dia/i });
    fireEvent.click(btnAnterior);
    fireEvent.click(btnProximo);
  });

  it('não renderiza tabela se dreCodigo ou anoLetivo não forem informados', () => {
    render(<PainelFrequenciaDre />);
    expect(screen.getByText(/Sem dados/i)).toBeInTheDocument();
  });
});
