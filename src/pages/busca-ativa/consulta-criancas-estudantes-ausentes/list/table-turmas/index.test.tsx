import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Form } from 'antd';
import TableTurmasCriancasEstudantesAusentes from './index';
import { OPCAO_TODOS } from '@/@legacy/constantes';

jest.mock('../table-ausentes', () => () => <div>MockTableAusentes</div>);

const mockListaTurmas = [
  { codigo: 'T1', value: 'T1', nomeFiltro: 'Turma 1' },
  { codigo: 'T2', value: 'T2', nomeFiltro: 'Turma 2' },
  { codigo: OPCAO_TODOS, value: OPCAO_TODOS, nomeFiltro: 'Todos' },
];

const mountWithForm = (formValues: any) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [form] = Form.useForm();
    form.getFieldsValue = jest.fn(() => formValues);
    return <Form form={form}>{children}</Form>;
  };
  return render(
    <Wrapper>
      <TableTurmasCriancasEstudantesAusentes />
    </Wrapper>,
  );
};

describe('TableTurmasCriancasEstudantesAusentes', () => {
  afterEach(() => cleanup());

  it('renderiza sem dados', () => {
    mountWithForm({ listaTurmas: [] });
    const semDados = screen.getAllByText('Sem dados');
    expect(semDados).toHaveLength(2);
  });

  it('renderiza turmas corretamente', () => {
    mountWithForm({ listaTurmas: mockListaTurmas, turma: mockListaTurmas[2], ausencias: 2 });
    expect(screen.getByText('Turma 1')).toBeInTheDocument();
    expect(screen.getByText('Turma 2')).toBeInTheDocument();
  });

  it('seleciona turma ao clicar na linha', async () => {
    mountWithForm({ listaTurmas: mockListaTurmas, turma: mockListaTurmas[0], ausencias: 2 });
    const linha = screen.getByText('Turma 1').closest('tr');
    if (linha) fireEvent.click(linha);
    await waitFor(() => {
      expect(screen.getByText('MockTableAusentes')).toBeInTheDocument();
    });
  });

  it('mostra tabela de ausentes ao selecionar turma', async () => {
    mountWithForm({ listaTurmas: mockListaTurmas, turma: mockListaTurmas[1], ausencias: 2 });
    await waitFor(() => {
      expect(screen.getByText('MockTableAusentes')).toBeInTheDocument();
    });
  });

  it('mostra todas as turmas exceto TODOS quando selecionado TODOS', () => {
    mountWithForm({ listaTurmas: mockListaTurmas, turma: mockListaTurmas[2], ausencias: 2 });
    expect(screen.getByText('Turma 1')).toBeInTheDocument();
    expect(screen.getByText('Turma 2')).toBeInTheDocument();
    expect(screen.queryByText('Todos')).not.toBeInTheDocument();
  });

  it('limpa seleção ao clicar em linha sem código', () => {
    const listaTurmasSemCodigo = [
      { value: 'SEM_CODIGO', nomeFiltro: 'Sem Código' },
      { codigo: 'T1', value: 'T1', nomeFiltro: 'Turma 1' },
    ];
    mountWithForm({
      listaTurmas: listaTurmasSemCodigo,
      turma: listaTurmasSemCodigo[0],
      ausencias: 2,
    });
    const linha = screen.getByText('Sem Código').closest('tr');
    if (linha) fireEvent.click(linha);
    const semDados = screen.getAllByText('Sem dados');
    expect(semDados.length).toBeGreaterThan(0);
  });
});
