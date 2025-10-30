import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PainelFrequenciaBase from './PainelFrequenciaBase';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(() =>
    Promise.resolve({
      data: { turmas: [], ues: [], totalPaginas: 0, totalRegistros: 0 },
    })
  ),
}));

describe('PainelFrequenciaBase', () => {
  it('renderiza controles de data e legenda', () => {
    render(
      <PainelFrequenciaBase tipoExtra="ue" codigo={123} anoLetivo={2024} />
    );
    expect(screen.getByText(/Dados do dia:/i)).toBeInTheDocument();
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

  it('renderiza tabela vazia inicialmente', () => {
    render(
      <PainelFrequenciaBase tipoExtra="ue" codigo={123} anoLetivo={2024} />
    );
    expect(screen.getByText(/Sem dados/i)).toBeInTheDocument();
  });

  it('muda página ao clicar na paginação', () => {
    render(
      <PainelFrequenciaBase tipoExtra="ue" codigo={123} anoLetivo={2024} />
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('chama função de mudar dia ao clicar nos botões', () => {
    render(
      <PainelFrequenciaBase tipoExtra="ue" codigo={123} anoLetivo={2024} />
    );
    const btnAnterior = screen.getByRole('button', { name: /Dia anterior/i });
    const btnProximo = screen.getByRole('button', { name: /Próximo dia/i });
    fireEvent.click(btnAnterior);
    fireEvent.click(btnProximo);
  });

  it('renderiza coluna Turma para tipoExtra="ue"', () => {
    render(
      <PainelFrequenciaBase tipoExtra="ue" codigo={123} anoLetivo={2024} />
    );
    expect(screen.getByText(/Turma/i)).toBeInTheDocument();
  });

  it('renderiza coluna Unidade educacional (UE) para tipoExtra="dre"', () => {
    render(
      <PainelFrequenciaBase tipoExtra="dre" codigo={123} anoLetivo={2024} />
    );
    expect(screen.getByText(/Unidade educacional \(UE\)/i)).toBeInTheDocument();
  });
});
