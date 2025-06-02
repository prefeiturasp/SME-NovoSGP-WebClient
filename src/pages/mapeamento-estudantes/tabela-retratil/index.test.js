import React from 'react';
import { render, screen } from '@testing-library/react';
import { useAppSelector } from '@/core/hooks/use-redux';
import { TabelaRetratilMapeamentoEstudantes } from './index';
import '@testing-library/jest-dom';

jest.mock('@/core/hooks/use-redux');
jest.mock('../botao-ordenar-estudantes', () => ({
  BotaoOrdenarMapeamentoEstudantes: () => <div data-testid="botao-ordenar" />,
}));
jest.mock('~/componentes/TabelaRetratil', () =>
  jest.fn(({ alunos = [], obterIconeEstudanteCustomizado, children }) => (
    <div data-testid="tabela-retratil">
      {alunos.map((aluno, idx) => (
        <div key={aluno.id || idx} data-testid={`icone-aluno-${idx}`}>
          {obterIconeEstudanteCustomizado &&
            obterIconeEstudanteCustomizado(aluno)}
        </div>
      ))}
      {children}
    </div>
  ))
);

describe('TabelaRetratilMapeamentoEstudantes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente quando mapeamentoEstudantes existe no store', () => {
    useAppSelector.mockImplementation(fn =>
      fn({
        mapeamentoEstudantes: {
          estudantesMapeamentoEstudantes: [
            {
              id: 10,
              nome: 'Aluno Store',
              exibirIconeCustomizado: false,
              numeroChamada: 5,
            },
          ],
        },
      })
    );
    render(<TabelaRetratilMapeamentoEstudantes />);
    const iconeAluno = screen.getByTestId('icone-aluno-0');
    const icone = iconeAluno.querySelector('.fa-check-circle');
    expect(icone).toBeInTheDocument();
    expect(icone).toHaveClass('icone-concluido');
  });

  it('não renderiza nada se estudantesMapeamentoEstudantes for vazio', () => {
    useAppSelector.mockReturnValue([]);
    const { container } = render(<TabelaRetratilMapeamentoEstudantes />);
    expect(container).toBeEmptyDOMElement();
  });

  it('não renderiza nada se estudantesMapeamentoEstudantes for undefined', () => {
    useAppSelector.mockReturnValue(undefined);
    const { container } = render(<TabelaRetratilMapeamentoEstudantes />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza BotaoOrdenarMapeamentoEstudantes, TabelaRetratil e filhos quando há estudantes', () => {
    useAppSelector.mockReturnValue([{ id: 1, nome: 'Aluno 1' }]);
    render(
      <TabelaRetratilMapeamentoEstudantes
        permiteOnChangeAluno
        onChangeAlunoSelecionado={() => {}}
      >
        <div data-testid="filho" />
      </TabelaRetratilMapeamentoEstudantes>
    );
    expect(screen.getByTestId('botao-ordenar')).toBeInTheDocument();
    expect(screen.getByTestId('tabela-retratil')).toBeInTheDocument();
    expect(screen.getByTestId('filho')).toBeInTheDocument();
  });

  it('renderiza ícone de concluído se exibirIconeCustomizado for falsy', () => {
    useAppSelector.mockReturnValue([
      {
        id: 1,
        nome: 'Aluno 1',
        exibirIconeCustomizado: false,
        numeroChamada: 1,
      },
    ]);
    render(<TabelaRetratilMapeamentoEstudantes />);
    const iconeAluno = screen.getByTestId('icone-aluno-0');
    const icone = iconeAluno.querySelector('.fa-check-circle');
    expect(icone).toBeInTheDocument();
    expect(icone).toHaveClass('icone-concluido');
    expect(icone.style.color).toBeFalsy();
  });

  it('renderiza ícone laranja se processoConcluido for true', () => {
    useAppSelector.mockReturnValue([
      {
        id: 2,
        nome: 'Aluno 2',
        exibirIconeCustomizado: true,
        processoConcluido: true,
        numeroChamada: 2,
      },
    ]);
    render(<TabelaRetratilMapeamentoEstudantes />);
    const iconeAluno = screen.getByTestId('icone-aluno-0');
    const icone = iconeAluno.querySelector('.fa-check-circle');
    expect(icone).toBeInTheDocument();
    expect(icone).toHaveClass('icone-concluido');
    expect(icone.style.color).toBeTruthy();
  });

  it('renderiza ícone vermelho se alertaVermelho for true', () => {
    useAppSelector.mockReturnValue([
      {
        id: 3,
        nome: 'Aluno 3',
        exibirIconeCustomizado: true,
        alertaVermelho: true,
        numeroChamada: 3,
      },
    ]);
    render(<TabelaRetratilMapeamentoEstudantes />);
    const iconeAluno = screen.getByTestId('icone-aluno-0');
    const icone = iconeAluno.querySelector('.fa-info-circle');
    expect(icone).toBeInTheDocument();
    expect(icone.style.color).toBeTruthy();
  });

  it('renderiza ícone amarelo se alertaVermelho for false', () => {
    useAppSelector.mockReturnValue([
      {
        id: 4,
        nome: 'Aluno 4',
        exibirIconeCustomizado: true,
        alertaVermelho: false,
        numeroChamada: 4,
      },
    ]);
    render(<TabelaRetratilMapeamentoEstudantes />);
    const iconeAluno = screen.getByTestId('icone-aluno-0');
    const icone = iconeAluno.querySelector('.fa-info-circle');
    expect(icone).toBeInTheDocument();
    expect(icone.style.color).toBeTruthy();
  });

  it('não renderiza nada se estudantesMapeamentoEstudantes for null', () => {
    useAppSelector.mockReturnValue(null);
    const { container } = render(<TabelaRetratilMapeamentoEstudantes />);
    expect(container).toBeEmptyDOMElement();
  });
});
