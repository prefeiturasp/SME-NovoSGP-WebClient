import React from 'react';
import { render, screen } from '@testing-library/react';
import ListaFrequenciaPorBimestre from './listaFrequenciaPorBimestre';

// Mock dos componentes filhos
jest.mock('./ausenciasEstudante', () => () => (
  <div data-testid="ausencias-estudante" />
));
jest.mock('./btnExpandirAusenciaEstudante', () => () => (
  <button data-testid="btn-expandir" />
));
jest.mock('./modalAnotacoes', () => () => (
  <div data-testid="modal-anotacoes" />
));
jest.mock('~/utils', () => ({
  formatarFrequencia: jest.fn(f => `${f}%`),
}));

describe('ListaFrequenciaPorBimestre', () => {
  const baseProps = {
    dados: [
      {
        bimestre: 1,
        aulasRealizadas: 20,
        ausencias: 2,
        frequenciaFormatado: 90,
        semestre: 1,
      },
    ],
    turmaId: 'turma-1',
    codigoAluno: 'aluno-1',
    componenteCurricularId: 123,
    esconderBimestre: false,
  };

  it('deve renderizar corretamente com dados', () => {
    render(<ListaFrequenciaPorBimestre {...baseProps} />);
    expect(screen.getByTestId('modal-anotacoes')).toBeInTheDocument();
    expect(screen.getByText('1°')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getByTestId('btn-expandir')).toBeInTheDocument();
    expect(screen.getByTestId('ausencias-estudante')).toBeInTheDocument();
  });

  it('deve exibir "Sem dados" quando dados estiver vazio', () => {
    render(<ListaFrequenciaPorBimestre dados={[]} />);
    expect(screen.getByText('Sem dados')).toBeInTheDocument();
  });

  it('deve renderizar sem a coluna Bimestre quando esconderBimestre for true', () => {
    render(<ListaFrequenciaPorBimestre {...baseProps} esconderBimestre />);
    expect(screen.queryByText('Bimestre')).not.toBeInTheDocument();
    expect(screen.queryByText('1°')).not.toBeInTheDocument();
  });

  it('deve renderizar corretamente se frequenciaFormatado for undefined', () => {
    const props = {
      ...baseProps,
      dados: [
        {
          ...baseProps.dados[0],
          frequenciaFormatado: undefined,
        },
      ],
    };
    render(<ListaFrequenciaPorBimestre {...props} />);
    // Não deve encontrar o texto "90%"
    expect(screen.queryByText('90%')).not.toBeInTheDocument();
  });

  it('deve usar os valores defaultProps quando não passados', () => {
    render(<ListaFrequenciaPorBimestre />);
    expect(screen.getByText('Sem dados')).toBeInTheDocument();
  });
});
