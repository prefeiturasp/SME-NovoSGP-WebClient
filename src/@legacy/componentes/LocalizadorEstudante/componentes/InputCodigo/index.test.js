import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import InputCodigo from './index';

jest.mock('~/componentes/loader', () => {
  return jest.fn(({ loading, children }) =>
    loading ? <div>Carregando...</div> : children
  );
});

jest.mock('./styles', () => ({
  InputRFEstilo: ({ children }) => (
    <div data-testid="input-codigo-estilo">{children}</div>
  ),
}));

describe('Componente: InputCodigo', () => {
  let onSelectMock;
  let onChangeMock;

  beforeEach(() => {
    onSelectMock = jest.fn();
    onChangeMock = jest.fn();
  });

  test('deve renderizar corretamente com as props padrão', () => {
    render(<InputCodigo id="codigo-aluno" />);

    expect(
      screen.getByPlaceholderText('Digite o Código EOL')
    ).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(document.getElementById('codigo-aluno')).toBeInTheDocument();
  });

  test('deve exibir o loader quando exibirLoader for true', () => {
    render(<InputCodigo exibirLoader />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  test('deve desabilitar o input e o botão quando desabilitado for true', () => {
    render(<InputCodigo desabilitado />);
    expect(screen.getByPlaceholderText('Digite o Código EOL')).toBeDisabled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('deve definir o valor inicial com base na prop pessoaSelecionada', () => {
    const pessoa = { alunoCodigo: '123456' };
    render(<InputCodigo pessoaSelecionada={pessoa} />);
    expect(screen.getByDisplayValue('123456')).toBeInTheDocument();
  });

  test('deve atualizar o valor quando pessoaSelecionada mudar', () => {
    const { rerender } = render(<InputCodigo pessoaSelecionada={null} />);
    const input = screen.getByPlaceholderText('Digite o Código EOL');
    expect(input).toHaveValue('');

    const novaPessoa = { alunoCodigo: '98765' };
    rerender(<InputCodigo pessoaSelecionada={novaPessoa} />);
    expect(input).toHaveValue('98765');
  });

  test('deve chamar onChange apenas com números e atualizar o valor do input', () => {
    render(<InputCodigo onChange={onChangeMock} />);
    const input = screen.getByPlaceholderText('Digite o Código EOL');

    fireEvent.change(input, { target: { value: '1a2b3c4' } });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith('1234');
    expect(input).toHaveValue('1234');
  });

  test('deve chamar onSelect com o código ao clicar no botão de busca', () => {
    render(<InputCodigo onSelect={onSelectMock} />);
    const input = screen.getByPlaceholderText('Digite o Código EOL');
    const botao = screen.getByRole('button');

    fireEvent.change(input, { target: { value: '555' } });
    fireEvent.click(botao);

    expect(onSelectMock).toHaveBeenCalledTimes(1);
    expect(onSelectMock).toHaveBeenCalledWith({ codigo: '555' });
  });

  test('botão de busca deve estar desabilitado se o input estiver vazio e habilitado se tiver valor', () => {
    render(<InputCodigo />);
    const botao = screen.getByRole('button');
    const input = screen.getByPlaceholderText('Digite o Código EOL');

    expect(botao).toBeDisabled();

    fireEvent.change(input, { target: { value: '1' } });
    expect(botao).toBeEnabled();

    fireEvent.change(input, { target: { value: '' } });
    expect(botao).toBeDisabled();
  });

  test('deve chamar onSelect ao pressionar Enter com um valor válido', () => {
    render(<InputCodigo onSelect={onSelectMock} />);
    const input = screen.getByPlaceholderText('Digite o Código EOL');

    fireEvent.change(input, { target: { value: '9a8b7' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(onSelectMock).toHaveBeenCalledTimes(1);
    expect(onSelectMock).toHaveBeenCalledWith({ codigo: '987' });
  });

  test('NÃO deve chamar onSelect ao pressionar Enter se o campo estiver vazio', () => {
    render(<InputCodigo onSelect={onSelectMock} />);
    const input = screen.getByPlaceholderText('Digite o Código EOL');

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(onSelectMock).not.toHaveBeenCalled();
  });
});
