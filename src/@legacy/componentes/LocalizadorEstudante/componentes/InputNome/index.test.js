import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import InputNome from './index';

jest.mock('~/componentes/loader', () => {
  return jest.fn(({ loading, children }) =>
    loading ? <div>Carregando...</div> : children
  );
});

jest.mock('./styles', () => ({
  InputNomeEstilo: ({ children }) => (
    <div data-testid="input-nome-estilo">{children}</div>
  ),
}));

const mockDataSource = [
  { alunoCodigo: '1', alunoNome: 'ANA MARIA' },
  { alunoCodigo: '2', alunoNome: 'ANA BEATRIZ' },
];

describe('Componente: InputNome', () => {
  let onSelectMock;
  let onChangeMock;

  beforeEach(() => {
    onSelectMock = jest.fn();
    onChangeMock = jest.fn();
  });

  // Testes de Renderização e Props
  test('deve renderizar com placeholder padrão quando a prop placeholder for vazia', () => {
    render(<InputNome placeholder="" />);
    expect(screen.getByPlaceholderText('Digite o nome')).toBeInTheDocument();
  });

  test('deve renderizar com placeholder customizado', () => {
    render(<InputNome placeholder="Buscar aluno por nome" />);
    expect(
      screen.getByPlaceholderText('Buscar aluno por nome')
    ).toBeInTheDocument();
  });

  test('deve exibir o loader e esconder o input quando exibirLoader for true', () => {
    render(<InputNome exibirLoader />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    // Validamos que o input NÃO está na tela, cobrindo a lógica `if (!exibirLoader)`
    expect(
      screen.queryByPlaceholderText('Digite o nome')
    ).not.toBeInTheDocument();
  });

  test('deve desabilitar o componente quando desabilitado for true', () => {
    render(<InputNome desabilitado />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  test('deve definir o valor inicial com base na prop pessoaSelecionada', () => {
    const pessoa = { alunoNome: 'ALUNO SELECIONADO' };
    render(<InputNome pessoaSelecionada={pessoa} />);
    expect(screen.getByDisplayValue('ALUNO SELECIONADO')).toBeInTheDocument();
  });

  test('deve atualizar o valor quando a prop pessoaSelecionada mudar', () => {
    const { rerender } = render(<InputNome pessoaSelecionada={null} />);
    expect(screen.getByRole('combobox')).toHaveValue('');

    rerender(<InputNome pessoaSelecionada={{ alunoNome: 'NOVO ALUNO' }} />);
    expect(screen.getByRole('combobox')).toHaveValue('NOVO ALUNO');
  });

  test('deve chamar onSearch (prop onChange) ao digitar no campo', () => {
    render(<InputNome onChange={onChangeMock} />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'BUSCA' } });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith('BUSCA');
  });

  test('deve aplicar a regexIgnore para remover caracteres indesejados', () => {
    render(<InputNome regexIgnore={/\d/g} />);
    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'NOME COM 123 NUMEROS' } });

    expect(input).toHaveValue('NOME COM  NUMEROS');
  });

  test('não deve aplicar regex se o valor for vazio', () => {
    const regexMock = /abc/g;
    const replaceSpy = jest.spyOn(String.prototype, 'replace');

    render(<InputNome regexIgnore={regexMock} />);
    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: '' } });

    expect(replaceSpy).not.toHaveBeenCalledWith(regexMock, '');
    expect(input).toHaveValue('');

    replaceSpy.mockRestore();
  });

  test('não deve quebrar se onSelect e onChange não forem fornecidas', async () => {
    render(<InputNome dataSource={mockDataSource} />);
    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'ANA' } });

    const option = await screen.findByRole('option', { name: 'ANA MARIA' });

    expect(() => fireEvent.click(option)).not.toThrow();
  });
});
