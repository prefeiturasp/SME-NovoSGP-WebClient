import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InputNome from './index';

jest.mock('~/componentes/loader', () => {
  return function Loader({ loading, children }) {
    return (
      <div data-testid="loader" data-loading={loading}>
        {children}
      </div>
    );
  };
});

describe('InputNome', () => {
  const mockOnSelect = jest.fn();
  const mockOnChange = jest.fn();

  const mockDataSource = [
    {
      alunoCodigo: '1',
      alunoNome: 'João Silva',
      codigoTurma: '101',
      turmaId: '1',
      nomeAlunoComTurmaModalidade: 'João Silva - 5A',
    },
    {
      alunoCodigo: '2',
      alunoNome: 'Maria Santos',
      codigoTurma: '102',
      turmaId: '2',
      nomeAlunoComTurmaModalidade: 'Maria Santos - 5B',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza componente corretamente', () => {
    render(<InputNome />);
    expect(screen.getByPlaceholderText('Digite o nome')).toBeInTheDocument();
    expect(screen.getByTestId('loader')).toHaveAttribute(
      'data-loading',
      'false'
    );
  });

  it('exibe placeholder customizado quando fornecido', () => {
    render(<InputNome placeholder="Buscar aluno" />);
    expect(screen.getByPlaceholderText('Buscar aluno')).toBeInTheDocument();
  });

  it('exibe loader quando exibirLoader é true', () => {
    render(<InputNome exibirLoader={true} />);
    expect(screen.getByTestId('loader')).toHaveAttribute(
      'data-loading',
      'true'
    );
  });

  it('atualiza valor ao receber pessoaSelecionada', () => {
    const { rerender } = render(<InputNome />);
    const input = screen.getByRole('combobox');

    expect(input.value).toBe('');

    rerender(<InputNome pessoaSelecionada={{ alunoNome: 'João Silva' }} />);
    expect(input.value).toBe('João Silva');
  });

  it('aplica regex para ignorar caracteres quando regexIgnore é fornecido', () => {
    render(<InputNome regexIgnore={/[0-9]/g} onChange={jest.fn()} />);

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'João123' } });

    expect(input.value).toBe('João');
  });

  it('chama onChange ao digitar quando não está carregando', () => {
    render(<InputNome onChange={mockOnChange} />);

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'João' } });

    expect(mockOnChange).toHaveBeenCalledWith('João');
  });

  it('não chama onChange quando está carregando', () => {
    render(<InputNome onChange={mockOnChange} exibirLoader={true} />);

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'João' } });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('não chama onSelect quando está carregando', () => {
    render(
      <InputNome
        dataSource={mockDataSource}
        onSelect={mockOnSelect}
        exibirLoader={true}
      />
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Jo' } });
    fireEvent.click(screen.getAllByText('João Silva')[0]);

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('desabilita input quando desabilitado é true', () => {
    render(<InputNome desabilitado={true} />);

    const input = screen.getByRole('combobox');
    expect(input).toBeDisabled();
  });

  it('limpa o input ao clicar no botão clear', () => {
    function Wrapper() {
      const [value, setValue] = React.useState('João');
      return (
        <InputNome
          onChange={val => {
            mockOnChange(val);
            setValue(val);
          }}
          value={value}
        />
      );
    }

    render(<Wrapper />);

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'João' } });

    const clearButtons = screen.getAllByLabelText('close-circle');
    fireEvent.click(clearButtons[clearButtons.length - 1]);

    waitFor(() => expect(input.value).toBe(''));
  });
});
