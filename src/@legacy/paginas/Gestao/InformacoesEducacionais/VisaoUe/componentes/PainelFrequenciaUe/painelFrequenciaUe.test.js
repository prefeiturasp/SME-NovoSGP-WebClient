import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PainelFrequenciaUe from './painelFrequenciaUe';

describe('PainelFrequenciaUe', () => {
  it('renderiza título e descrição', () => {
    render(
      <PainelFrequenciaUe
        ueCodigo={123}
        anoLetivo={2024}
        nomeUe="Escola Teste"
      />
    );
    expect(
      screen.getByRole('heading', { name: /Média de frequência/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /O gráfico representa a média de frequência semanal dos alunos da/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/Escola Teste/i)).toBeInTheDocument();
  });

  it('renderiza controles de data', () => {
    render(
      <PainelFrequenciaUe
        ueCodigo={123}
        anoLetivo={2024}
        nomeUe="Escola Teste"
      />
    );
    expect(screen.getByText(/Dados do dia:/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Dia anterior/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Próximo dia/i })
    ).toBeInTheDocument();
  });

  it('renderiza tabela vazia inicialmente', () => {
    render(
      <PainelFrequenciaUe
        ueCodigo={123}
        anoLetivo={2024}
        nomeUe="Escola Teste"
      />
    );
    expect(screen.getByText(/Sem dados/i)).toBeInTheDocument();
  });

  it('chama função de mudar dia ao clicar nos botões', () => {
    render(
      <PainelFrequenciaUe
        ueCodigo={123}
        anoLetivo={2024}
        nomeUe="Escola Teste"
      />
    );
    const btnAnterior = screen.getByRole('button', { name: /Dia anterior/i });
    const btnProximo = screen.getByRole('button', { name: /Próximo dia/i });
    fireEvent.click(btnAnterior);
    fireEvent.click(btnProximo);
  });

  it('não renderiza tabela se ueCodigo ou anoLetivo não forem informados', () => {
    render(<PainelFrequenciaUe />);
    expect(screen.getByText(/Sem dados/i)).toBeInTheDocument();
  });
});
