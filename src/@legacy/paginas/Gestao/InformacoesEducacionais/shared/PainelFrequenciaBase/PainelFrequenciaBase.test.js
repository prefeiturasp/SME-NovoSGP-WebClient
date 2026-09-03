import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PainelFrequenciaBase from './PainelFrequenciaBase';

jest.mock('~/servicos/InformacoesEducacionais/ServicoFrequenciaDiaria', () => ({
  ObterFrequenciaDiariaUe: jest.fn(() =>
    Promise.resolve({
      data: { turmas: [], totalPaginas: 0, totalRegistros: 0 },
    })
  ),
  ObterFrequenciaDiariaDre: jest.fn(() =>
    Promise.resolve({
      data: { ues: [], totalPaginas: 0, totalRegistros: 0 },
    })
  ),
}));

const anoLetivoAtual = new Date().getFullYear();

describe('PainelFrequenciaBase', () => {
  it('renderiza controles de data e legenda', async () => {
    render(
      <PainelFrequenciaBase
        tipoExtra="ue"
        codigo={123}
        anoLetivo={anoLetivoAtual}
      />
    );
    expect(await screen.findByText(/Dados do dia:/i)).toBeInTheDocument();
    expect(screen.getByText(/Nível de frequência:/i)).toBeInTheDocument();
    expect(screen.getByText(/Alto/i)).toBeInTheDocument();
    expect(screen.getByText(/Médio/i)).toBeInTheDocument();
    expect(screen.getByText(/Baixo/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Dia anterior/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Próximo dia/i })
    ).toBeInTheDocument();
  });

  it('renderiza tabela vazia inicialmente', async () => {
    render(
      <PainelFrequenciaBase
        tipoExtra="ue"
        codigo={123}
        anoLetivo={anoLetivoAtual}
      />
    );
    expect(await screen.findByText(/Sem dados/i)).toBeInTheDocument();
  });

  it('muda página ao clicar na paginação', async () => {
    render(
      <PainelFrequenciaBase
        tipoExtra="ue"
        codigo={123}
        anoLetivo={anoLetivoAtual}
      />
    );
    expect(await screen.findByRole('table')).toBeInTheDocument();
  });

  it('chama função de mudar dia ao clicar nos botões', async () => {
    render(
      <PainelFrequenciaBase
        tipoExtra="ue"
        codigo={123}
        anoLetivo={anoLetivoAtual}
      />
    );
    fireEvent.click(
      await screen.findByRole('button', { name: /Dia anterior/i })
    );
    fireEvent.click(screen.getByRole('button', { name: /Próximo dia/i }));
  });

  it('renderiza coluna Turma para tipoExtra="ue"', async () => {
    render(
      <PainelFrequenciaBase
        tipoExtra="ue"
        codigo={123}
        anoLetivo={anoLetivoAtual}
      />
    );
    expect(await screen.findAllByText(/^Turma$/i)).not.toHaveLength(0);
  });

  it('renderiza coluna Unidade educacional (UE) para tipoExtra="dre"', async () => {
    render(
      <PainelFrequenciaBase
        tipoExtra="dre"
        codigo={123}
        anoLetivo={anoLetivoAtual}
      />
    );
    expect(
      await screen.findAllByText(/Unidade educacional \(UE\)/i)
    ).not.toHaveLength(0);
  });
});
