import { render, screen, fireEvent, waitFor } from '@testing-library/react';
jest.mock('./styles', () => ({
  InputBuscaEstilo: ({ children }) => <div>{children}</div>,
}));

jest.mock('~/componentes', () => ({
  Label: ({ text }) => <label>{text}</label>,
  Loader: ({ loading, children }) => (
    <div data-testid="loader" data-loading={loading ? 'true' : 'false'}>
      {children}
    </div>
  ),
}));

const mockApiGet = jest.fn();
jest.mock('~/servicos', () => ({
  api: { get: (...args) => mockApiGet(...args) },
}));

import LocalizadorPadrao from './index'; // Import correto!

describe('LocalizadorPadrao', () => {
  const defaultProps = {
    labelNome: 'Nome',
    valorSelecionado: '',
    onChange: jest.fn(),
    desabilitado: false,
    url: '/api/test',
    campoValor: 'valor',
    campoDescricao: 'descricao',
    placeholder: 'Buscar...',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza label quando labelNome é fornecido', () => {
    render(<LocalizadorPadrao {...defaultProps} />);
    expect(screen.getByText('Nome')).toBeInTheDocument();
  });

  it('não renderiza label quando labelNome é vazio', () => {
    render(<LocalizadorPadrao {...defaultProps} labelNome="" />);
    expect(screen.queryByText('Nome')).not.toBeInTheDocument();
  });

  it('renderiza loader corretamente', () => {
    render(<LocalizadorPadrao {...defaultProps} />);
    expect(screen.getByTestId('loader')).toHaveAttribute(
      'data-loading',
      'false'
    );
  });

  it('renderiza input com placeholder', () => {
    render(<LocalizadorPadrao {...defaultProps} />);
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
  });

  it('atualiza valor ao receber valorSelecionado', () => {
    const { rerender } = render(
      <LocalizadorPadrao {...defaultProps} valorSelecionado="" />
    );
    const input = screen.getByPlaceholderText('Buscar...');
    expect(input.value).toBe('');
    rerender(
      <LocalizadorPadrao {...defaultProps} valorSelecionado="Novo valor" />
    );
    expect(input.value).toBe('Novo valor');
  });

  it('chama onChangeValor ao digitar', () => {
    render(<LocalizadorPadrao {...defaultProps} />);
    const input = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input.value).toBe('abc');
  });

  it('validaAntesBuscar faz busca na API quando url e busca >= 3', async () => {
    mockApiGet.mockResolvedValue({
      status: 200,
      data: [{ valor: '1', descricao: 'Teste' }],
    });
    render(<LocalizadorPadrao {...defaultProps} />);
    const input = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalledWith('/api/test?nome=abc');
      expect(screen.getByTestId('loader')).toHaveAttribute(
        'data-loading',
        'false'
      );
    });
  });

  it('validaAntesBuscar não faz busca se busca < 3', () => {
    render(<LocalizadorPadrao {...defaultProps} />);
    const input = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.blur(input);
    expect(mockApiGet).not.toHaveBeenCalled();
  });

  it('onSearchValor não altera dataSource se status diferente de 200', async () => {
    mockApiGet.mockResolvedValue({ status: 500, data: [] });
    render(<LocalizadorPadrao {...defaultProps} />);
    const input = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalled();
      expect(screen.getByTestId('loader')).toHaveAttribute(
        'data-loading',
        'false'
      );
    });
  });

  it('onSelect chama onChange com objeto correto', async () => {
    mockApiGet.mockResolvedValue({
      status: 200,
      data: [{ valor: '1', descricao: 'Teste' }],
    });
    render(<LocalizadorPadrao {...defaultProps} />);
    const input = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(input, { target: { value: 'Teste' } });

    await waitFor(() => {
      expect(screen.getByText('Teste')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Teste'));
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      valor: '1',
      descricao: 'Teste',
    });
  });

  it('desabilita input quando desabilitado é true', () => {
    render(<LocalizadorPadrao {...defaultProps} desabilitado={true} />);
    const input = screen.getByPlaceholderText('Buscar...');
    expect(input).toBeDisabled();
  });

  it('renderiza opções corretamente', async () => {
    mockApiGet.mockResolvedValue({
      status: 200,
      data: [{ valor: '1', descricao: 'Teste' }],
    });
    render(<LocalizadorPadrao {...defaultProps} />);
    const input = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' }); // Adicional

    await waitFor(() => {
      expect(screen.getByText('Teste')).toBeInTheDocument();
    });
  });
});
