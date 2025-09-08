import { render, screen, fireEvent } from '@testing-library/react';
import ListCadastroABAE from './index';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { verificaSomenteConsulta } from '~/servicos';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('@/@legacy/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao', () => (props) => (
  <button onClick={props.onClick}>Voltar</button>
));

jest.mock('@/components/lib/button/primary', () => (props) => (
  <button onClick={props.onClick} disabled={props.disabled} id={props.id}>
    {props.children}
  </button>
));

jest.mock('@/components/lib/header-page', () => (props) => (
  <div>
    <h1>{props.title}</h1>
    {props.children}
  </div>
));

jest.mock('@/components/sgp/inputs/form/dre', () => () => <div data-testid="select-dre" />);
jest.mock('@/components/sgp/inputs/form/ue', () => () => <div data-testid="select-ue" />);
jest.mock(
  '@/components/sgp/inputs/form/situacao-ativo-inativo/radio-situacao-ativo-inativo',
  () => () => <div data-testid="radio-situacao" />,
);
jest.mock('./lista-paginada', () => () => <div data-testid="lista-paginada" />);
jest.mock('~/servicos', () => ({
  verificaSomenteConsulta: jest.fn(() => false),
}));

describe('ListCadastroABAE', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useSelector as jest.Mock).mockReturnValue({
      permissoes: {
        CADASTRO_ABAE: { podeIncluir: true },
      },
    });
  });

  it('renderiza o título, botões e inputs principais', () => {
    render(<ListCadastroABAE />);
    expect(screen.getByText('Cadastro de ABAE')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Novo' })).toBeInTheDocument();
    expect(screen.getByTestId('select-dre')).toBeInTheDocument();
    expect(screen.getByTestId('select-ue')).toBeInTheDocument();
    expect(screen.getByTestId('radio-situacao')).toBeInTheDocument();
    expect(screen.getByTestId('lista-paginada')).toBeInTheDocument();
  });

  it('navega ao clicar em Voltar', () => {
    render(<ListCadastroABAE />);
    fireEvent.click(screen.getByRole('button', { name: 'Voltar' }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('desabilita botão Novo quando somenteConsulta é true', () => {
    (verificaSomenteConsulta as jest.Mock).mockReturnValueOnce(true);

    render(<ListCadastroABAE />);

    const botaoNovo = screen.getByRole('button', { name: 'Novo' });
    expect(botaoNovo).toBeDisabled();
  });

  it('desabilita botão Novo quando não tem permissão para incluir', () => {
    (useSelector as jest.Mock).mockReturnValueOnce({
      permissoes: {
        CADASTRO_ABAE: { podeIncluir: false },
      },
    });

    render(<ListCadastroABAE />);

    const botaoNovo = screen.getByRole('button', { name: 'Novo' });
    expect(botaoNovo).toBeDisabled();
  });

  it('navega ao clicar em Novo', () => {
    (useSelector as jest.Mock).mockReturnValueOnce({
      permissoes: {
        '/cadastro-abae': { podeIncluir: true },
      },
    });
    (verificaSomenteConsulta as jest.Mock).mockReturnValueOnce(false);

    render(<ListCadastroABAE />);

    const botaoNovo = screen.getByRole('button', { name: 'Novo' });
    expect(botaoNovo).not.toBeDisabled();

    fireEvent.click(botaoNovo);
    expect(mockNavigate).toHaveBeenCalledWith('/cadastro-abae/novo');
  });
});
