import { render, screen, fireEvent, act } from '@testing-library/react';
import TabelaRetratil from './index';

const mockCabecalho = jest.fn();
jest.mock('./componentes/Cabecalho', () => props => {
  mockCabecalho(props);
  return <div data-testid="cabecalho">Cabecalho</div>;
});

jest.mock('./componentes/Inconsistencias', () => () => (
  <div data-testid="inconsistencias" />
));
jest.mock('@/components/sgp/estudante-atendido-aee', () => () => (
  <div data-testid="aee" />
));
jest.mock('@/components/sgp/estudante-matriculado-pap', () => () => (
  <div data-testid="pap" />
));

jest.mock('antd', () => ({
  Tooltip: ({ children, title }) => (
    <div data-testid="tooltip" data-title={title}>
      {children}
    </div>
  ),
}));

jest.mock('shortid', () => {
  let count = 0;
  return {
    generate: jest.fn(() => `key${++count}`),
  };
});

describe('Componente TabelaRetratil', () => {
  const alunos = [
    { codigoEOL: 1, numeroChamada: 1, nome: 'Aluno 1' },
    { codigoEOL: 2, numeroChamada: 2, nome: 'Aluno 2', desabilitado: true },
    { codigoEOL: 3, numeroChamada: 3, nome: 'Aluno 3' },
  ];

  beforeEach(() => {
    mockCabecalho.mockClear();
  });

  it('renderiza lista de alunos corretamente', () => {
    render(<TabelaRetratil alunos={alunos} />);
    expect(screen.getByText('Aluno 1')).toBeInTheDocument();
    expect(screen.getByText('Aluno 2')).toBeInTheDocument();
    expect(screen.getByText('Aluno 3')).toBeInTheDocument();
    expect(screen.getByTestId('cabecalho')).toBeInTheDocument();
  });

  it('seleciona aluno clicando na linha', async () => {
    const onChangeAlunoSelecionado = jest.fn();
    render(
      <TabelaRetratil
        alunos={alunos}
        onChangeAlunoSelecionado={onChangeAlunoSelecionado}
      />
    );
    const linha = screen.getByText('Aluno 2').closest('tr');

    await act(async () => {
      fireEvent.click(linha);
    });

    expect(onChangeAlunoSelecionado).toHaveBeenCalledWith(alunos[1]);
  });

  it('chama onClickAnterior e onClickProximo', async () => {
    const permiteOnChangeAluno = jest.fn().mockResolvedValue(true);
    const onChangeAlunoSelecionado = jest.fn();

    render(
      <TabelaRetratil
        alunos={alunos}
        codigoAlunoSelecionado={1}
        permiteOnChangeAluno={permiteOnChangeAluno}
        onChangeAlunoSelecionado={onChangeAlunoSelecionado}
        pularDesabilitados
      />
    );

    const props = mockCabecalho.mock.calls[0][0];

    await act(async () => {
      await props.onClickProximo();
    });

    expect(onChangeAlunoSelecionado).toHaveBeenCalled();

    await act(async () => {
      await props.onClickAnterior();
    });

    expect(onChangeAlunoSelecionado).toHaveBeenCalled();
  });

  it('renderiza com obterIconeEstudanteCustomizado', () => {
    const obterIconeEstudanteCustomizado = jest.fn(() => (
      <div>IconeCustom</div>
    ));

    render(
      <TabelaRetratil
        alunos={alunos}
        obterIconeEstudanteCustomizado={obterIconeEstudanteCustomizado}
      />
    );

    expect(screen.getAllByText('IconeCustom')).toHaveLength(3);
  });

  it('renderiza vazio quando lista de alunos vazia', () => {
    render(<TabelaRetratil alunos={[]} />);
    expect(screen.getByTestId('cabecalho')).toBeInTheDocument();
  });

  it('cobre todos os defaultProps', () => {
    render(<TabelaRetratil />);
    expect(screen.getByTestId('cabecalho')).toBeInTheDocument();
  });

  it('applies selected class to row when codigoAlunoSelecionado prop is set', () => {
    render(<TabelaRetratil alunos={alunos} codigoAlunoSelecionado={2} />);
    const row = document.getElementById(
      'SGP_TABLE_REGISTRO_INDIVIDUAL_LINHA_1'
    );
    expect(row).toBeTruthy();
    expect(row.className).toContain('selecionado');
  });

  it('shows check icon when exibirProcessoConcluido is true', () => {
    const item = { ...alunos[0], processoConcluido: true };
    render(<TabelaRetratil alunos={[item]} exibirProcessoConcluido />);
    const icon = document.querySelector('i.icone-concluido.fa-check-circle');
    expect(icon).toBeInTheDocument();
  });

  it('renders custom marcador tooltip when item.marcador provided', () => {
    const item = { ...alunos[0], marcador: { descricao: 'Test' } };
    render(<TabelaRetratil alunos={[item]} />);
    expect(screen.getByTestId('tooltip')).toHaveAttribute('data-title', 'Test');
  });

  it('renders ausencia percurso icon when alunosValidar contains codigoEOL', () => {
    render(
      <TabelaRetratil alunos={alunos} alunosValidar={[{ alunoCodigo: 2 }]} />
    );
    const icon = document.querySelector('span.iconeAusenciaPercurso');
    expect(icon).toBeInTheDocument();
  });

  it('renders children inside DetalhesAluno', () => {
    render(
      <TabelaRetratil alunos={alunos}>
        <div data-testid="child" />
      </TabelaRetratil>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('executa proximoAlunoHabilitado recursivamente', async () => {
    const permiteOnChangeAluno = jest.fn().mockResolvedValue(true);
    const onChangeAlunoSelecionado = jest.fn();

    const alunosComDesabilitados = [
      { codigoEOL: 1, numeroChamada: 1, nome: 'Aluno 1' },
      { codigoEOL: 2, numeroChamada: 2, nome: 'Aluno 2', desabilitado: true },
      { codigoEOL: 3, numeroChamada: 3, nome: 'Aluno 3', desabilitado: true },
      { codigoEOL: 4, numeroChamada: 4, nome: 'Aluno 4' },
    ];

    render(
      <TabelaRetratil
        alunos={alunosComDesabilitados}
        codigoAlunoSelecionado={2}
        permiteOnChangeAluno={permiteOnChangeAluno}
        onChangeAlunoSelecionado={onChangeAlunoSelecionado}
        pularDesabilitados
      />
    );

    const calls = mockCabecalho.mock.calls;
    const props = calls[calls.length - 1][0];

    await act(async () => {
      await props.onClickProximo();
    });

    expect(onChangeAlunoSelecionado).toHaveBeenCalledWith(
      alunosComDesabilitados[3]
    );
  });

  it('executa anteriorAlunoHabilitado recursivamente', async () => {
    const permiteOnChangeAluno = jest.fn().mockResolvedValue(true);
    const onChangeAlunoSelecionado = jest.fn();

    const alunosComDesabilitados = [
      { codigoEOL: 1, numeroChamada: 1, nome: 'Aluno 1' },
      { codigoEOL: 2, numeroChamada: 2, nome: 'Aluno 2', desabilitado: true },
      { codigoEOL: 3, numeroChamada: 3, nome: 'Aluno 3', desabilitado: true },
      { codigoEOL: 4, numeroChamada: 4, nome: 'Aluno 4' },
    ];

    render(
      <TabelaRetratil
        alunos={alunosComDesabilitados}
        codigoAlunoSelecionado={4}
        permiteOnChangeAluno={permiteOnChangeAluno}
        onChangeAlunoSelecionado={onChangeAlunoSelecionado}
        pularDesabilitados
      />
    );

    const calls = mockCabecalho.mock.calls;
    const props = calls[calls.length - 1][0];

    await act(async () => {
      await props.onClickAnterior();
    });

    expect(onChangeAlunoSelecionado).toHaveBeenCalledWith(
      alunosComDesabilitados[0]
    );
  });
});
