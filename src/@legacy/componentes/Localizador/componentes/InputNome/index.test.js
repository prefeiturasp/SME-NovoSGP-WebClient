import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

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
  { professorRf: '123', professorNome: 'João da Silva', usuarioId: 'uid1' },
  { professorRf: '456', professorNome: 'Maria Oliveira', usuarioId: 'uid2' },
  { professorRf: '789', professorNome: 'Carlos Pereira', usuarioId: 'uid3' },
];

describe('Componente: InputNome', () => {
  let onSelectMock;
  let onChangeMock;

  beforeEach(() => {
    onSelectMock = jest.fn();
    onChangeMock = jest.fn();
  });

  test('deve renderizar corretamente com as props mínimas', () => {
    render(<InputNome placeholderNome="Buscar professor..." />);

    expect(
      screen.getByPlaceholderText('Buscar professor...')
    ).toBeInTheDocument();
    expect(screen.getByTestId('input-nome-estilo')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(document.querySelector('.fa-search')).toBeInTheDocument();
  });

  test('deve exibir o loader quando a prop exibirLoader for true', () => {
    render(<InputNome placeholderNome="Buscar..." exibirLoader />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  test('deve estar desabilitado quando a prop desabilitado for true', () => {
    render(<InputNome placeholderNome="Buscar..." desabilitado />);

    const input = screen.getByPlaceholderText('Buscar...');
    expect(input).toBeDisabled();
  });

  test('deve preencher o valor inicial baseado na prop pessoaSelecionada', () => {
    const pessoa = { professorNome: 'Maria Oliveira' };
    render(
      <InputNome placeholderNome="Buscar..." pessoaSelecionada={pessoa} />
    );

    const input = screen.getByDisplayValue('Maria Oliveira');
    expect(input).toBeInTheDocument();
  });

  test('deve chamar a função onChange quando o usuário digita', () => {
    render(
      <InputNome
        placeholderNome="Buscar..."
        onChange={onChangeMock}
        dataSource={mockDataSource}
      />
    );

    const input = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(input, { target: { value: 'João' } });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith('João');
  });

  test('deve chamar onSelect com os dados corretos ao selecionar um item', async () => {
    render(
      <InputNome
        placeholderNome="Buscar..."
        onChange={onChangeMock}
        onSelect={onSelectMock}
        dataSource={mockDataSource}
      />
    );

    const input = screen.getByPlaceholderText('Buscar...');

    fireEvent.change(input, { target: { value: 'Maria' } });

    const option = await screen.findByText('Maria Oliveira');
    fireEvent.click(option);

    expect(onSelectMock).toHaveBeenCalledTimes(1);
    const expectedPayload = expect.objectContaining({
      key: '456',
      props: expect.objectContaining({
        value: 'Maria Oliveira',
        usuarioId: 'uid2',
      }),
    });
    expect(onSelectMock).toHaveBeenCalledWith(expectedPayload);

    expect(input).toHaveValue('Maria Oliveira');
  });

  test('deve atualizar a lista de sugestões quando a prop dataSource mudar', async () => {
    const onChangeMock = jest.fn();

    const { rerender } = render(
      <InputNome
        placeholderNome="Buscar..."
        dataSource={[]}
        onChange={onChangeMock}
      />
    );

    const input = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(input, { target: { value: 'Carlos' } });

    expect(screen.queryByText('Carlos Pereira')).not.toBeInTheDocument();

    rerender(
      <InputNome
        placeholderNome="Buscar..."
        dataSource={mockDataSource}
        onChange={onChangeMock}
      />
    );

    fireEvent.change(input, { target: { value: 'Carlos' } });

    const option = await screen.findByText('Carlos Pereira');
    expect(option).toBeInTheDocument();

    expect(onChangeMock).toHaveBeenCalledWith('Carlos');
  });

  test('deve atualizar o valor do input quando a prop pessoaSelecionada mudar', () => {
    const { rerender } = render(
      <InputNome
        placeholderNome="Buscar..."
        pessoaSelecionada={{ professorNome: 'Valor Antigo' }}
      />
    );

    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('Valor Antigo');

    const novaPessoa = { professorNome: 'Valor Novo' };
    rerender(
      <InputNome placeholderNome="Buscar..." pessoaSelecionada={novaPessoa} />
    );

    expect(input).toHaveValue('Valor Novo');
  });
});
