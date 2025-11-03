import React from 'react';
import { render, screen } from '@testing-library/react';
import PainelFrequenciaBase from './PainelFrequenciaBase';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(() =>
    Promise.resolve({
      data: { turmas: [], ues: [], totalPaginas: 0, totalRegistros: 0 },
    })
  ),
}));

describe('PainelFrequenciaBase', () => {
  it('exibe mensagem de sem dados para o ano letivo selecionado quando anoLetivo não é o atual', () => {
    render(
      <PainelFrequenciaBase tipoExtra="ue" codigo={123} anoLetivo="2000" />
    );
    expect(
      screen.getByText(/Sem dados para o ano letivo selecionado/i)
    ).toBeInTheDocument();
  });

  it('exibe mensagem de sem dados para o ano letivo selecionado quando anoLetivo é null', () => {
    render(
      <PainelFrequenciaBase tipoExtra="ue" codigo={123} anoLetivo={null} />
    );
    expect(
      screen.getByText(/Sem dados para o ano letivo selecionado/i)
    ).toBeInTheDocument();
  });

  it('não exibe controles ou tabela quando anoLetivo não é o atual', () => {
    render(
      <PainelFrequenciaBase tipoExtra="dre" codigo={123} anoLetivo="1999" />
    );
    expect(screen.queryByText(/Dados do dia:/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Dia anterior/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Turma/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Unidade educacional \(UE\)/i)
    ).not.toBeInTheDocument();
  });
});
