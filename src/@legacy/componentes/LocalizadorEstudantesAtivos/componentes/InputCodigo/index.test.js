import { render, screen, fireEvent } from '@testing-library/react';
import InputCodigo from './index';

jest.mock('~/componentes/loader', () => {
  return function Loader({ loading, children }) {
    return (
      <div data-testid="loader" data-loading={loading}>
        {children}
      </div>
    );
  };
});

describe('InputCodigo', () => {
  const mockOnSelect = jest.fn();
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o componente corretamente', () => {
    render(<InputCodigo />);

    expect(
      screen.getByPlaceholderText('Digite o Código EOL')
    ).toBeInTheDocument();
    expect(screen.getByTestId('loader')).toHaveAttribute(
      'data-loading',
      'false'
    );
  });

  it('exibe loader quando exibirLoader é true', () => {
    render(<InputCodigo exibirLoader={true} />);
    expect(screen.getByTestId('loader')).toHaveAttribute(
      'data-loading',
      'true'
    );
  });

  it('atualiza valor ao receber pessoaSelecionada', () => {
    const { rerender } = render(<InputCodigo />);

    const input = screen.getByPlaceholderText('Digite o Código EOL');
    expect(input.value).toBe('');

    rerender(<InputCodigo pessoaSelecionada={{ alunoCodigo: '12345' }} />);
    expect(input.value).toBe('12345');
  });

  it('chama onChange com valor numérico ao digitar', () => {
    render(<InputCodigo onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Digite o Código EOL');
    fireEvent.change(input, { target: { value: 'abc123def' } });

    expect(mockOnChange).toHaveBeenCalledWith('123');
  });

  it('não chama onChange quando exibirLoader é true', () => {
    render(<InputCodigo onChange={mockOnChange} exibirLoader={true} />);

    const input = screen.getByPlaceholderText('Digite o Código EOL');
    fireEvent.change(input, { target: { value: '123' } });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('chama onSelect ao pressionar enter com valor válido', () => {
    render(<InputCodigo onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText('Digite o Código EOL');
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 13, charCode: 13 });

    expect(mockOnSelect).toHaveBeenCalledWith({ codigo: '123' });
  });

  it('não chama onSelect ao pressionar enter sem valor', () => {
    render(<InputCodigo onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText('Digite o Código EOL');
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('não chama onSelect ao pressionar enter com exibirLoader true', () => {
    render(<InputCodigo onSelect={mockOnSelect} exibirLoader={true} />);

    const input = screen.getByPlaceholderText('Digite o Código EOL');
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('chama onSelect ao clicar no botão de busca', () => {
    render(<InputCodigo onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText('Digite o Código EOL');
    fireEvent.change(input, { target: { value: '123' } });

    // Seleciona o segundo botão (índice 1), que é o botão de busca
    const botaoBusca = screen.getAllByRole('button')[1];
    fireEvent.click(botaoBusca);

    expect(mockOnSelect).toHaveBeenCalledWith({ codigo: '123' });
  });

  it('desabilita botão quando não há valor', () => {
    render(<InputCodigo />);
    const botaoBusca = screen.getByRole('button');
    expect(botaoBusca).toBeDisabled();
  });

  it('desabilita botão quando componente está desabilitado', () => {
    render(<InputCodigo desabilitado={true} />);

    const input = screen.getByPlaceholderText('Digite o Código EOL');
    fireEvent.change(input, { target: { value: '123' } });

    const botaoBusca = screen.getByRole('button');
    expect(botaoBusca).toBeDisabled();
  });

  it('desabilita input quando componente está desabilitado', () => {
    render(<InputCodigo desabilitado={true} />);
    const input = screen.getByPlaceholderText('Digite o Código EOL');
    expect(input).toBeDisabled();
  });

  it('limpa o input ao clicar no botão clear', () => {
    render(<InputCodigo onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Digite o Código EOL');
    fireEvent.change(input, { target: { value: '123' } });

    const clearButton = screen.getByLabelText('close-circle');
    fireEvent.click(clearButton);

    expect(input.value).toBe('');
    expect(mockOnChange).toHaveBeenLastCalledWith('');
  });
});
