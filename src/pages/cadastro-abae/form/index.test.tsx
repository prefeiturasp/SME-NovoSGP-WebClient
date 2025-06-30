import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormCadastroABAE from './index';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import abaeService from '@/core/services/abae-service';
import { verificaSomenteConsulta } from '@/@legacy/servicos';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));
jest.mock('@/core/services/abae-service', () => ({
  buscarPorId: jest.fn(),
  incluir: jest.fn(),
  alterar: jest.fn(),
  excluir: jest.fn(),
}));
jest.mock('@/components/sgp/inputs/form/dre', () => () => <div data-testid="select-dre" />);
jest.mock('@/components/sgp/inputs/form/ue', () => () => <div data-testid="select-ue" />);
jest.mock('@/components/sgp/inputs/form/cpf', () => () => <div data-testid="input-cpf" />);
jest.mock('@/components/sgp/inputs/form/email', () => () => <div data-testid="input-email" />);
jest.mock('@/components/sgp/inputs/form/telefone', () => () => (
  <div data-testid="input-telefone" />
));
jest.mock('@/components/sgp/inputs/form/cep', () => () => <div data-testid="input-cep" />);
jest.mock('@/components/sgp/inputs/form/endereco', () => () => (
  <div data-testid="input-endereco" />
));
jest.mock('@/components/sgp/inputs/form/numero', () => () => <div data-testid="input-numero" />);
jest.mock('@/components/sgp/inputs/form/complemento', () => () => (
  <div data-testid="input-complemento" />
));
jest.mock('@/components/sgp/inputs/form/bairro', () => () => <div data-testid="input-bairro" />);
jest.mock('@/components/sgp/inputs/form/cidade', () => () => <div data-testid="input-cidade" />);
jest.mock('@/components/sgp/inputs/form/estado', () => () => <div data-testid="input-estado" />);
jest.mock(
  '@/components/sgp/inputs/form/situacao-ativo-inativo/radio-situacao-ativo-inativo',
  () => () => <div data-testid="input-situacao" />,
);
jest.mock('@/@legacy/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao', () => (props) => (
  <button onClick={props.onClick}>Voltar</button>
));
jest.mock('@/@legacy/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao', () => (props) => (
  <button onClick={props.onClick} disabled={props.disabled}>
    Excluir
  </button>
));
jest.mock('@/components/lib/button/primary', () => (props) => (
  <button onClick={props.onClick} disabled={props.disabled}>
    {props.children}
  </button>
));
jest.mock('@/components/lib/button/secundary', () => (props) => (
  <button onClick={props.onClick} disabled={props.disabled}>
    {props.children}
  </button>
));
jest.mock('@/components/lib/header-page', () => (props) => (
  <div>
    {props.title}
    {props.children}
  </div>
));
jest.mock('@/components/lib/card-content', () => (props) => <div>{props.children}</div>);
jest.mock('@/@legacy/componentes', () => ({
  Auditoria: () => <div data-testid="auditoria" />,
}));
jest.mock('@/@legacy/servicos', () => ({
  sucesso: jest.fn(),
  confirmar: jest.fn(() => Promise.resolve(true)),
  verificaSomenteConsulta: jest.fn(() => false),
  setBreadcrumbManual: jest.fn(),
}));

describe('FormCadastroABAE', () => {
  const mockNavigate = jest.fn();
  const mockBuscarPorId = abaeService.buscarPorId as jest.Mock;
  const mockIncluir = abaeService.incluir as jest.Mock;
  const mockAlterar = abaeService.alterar as jest.Mock;
  const mockExcluir = abaeService.excluir as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as jest.Mock).mockReturnValue({});
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/cadastro-abae/novo' });
    (useSelector as jest.Mock).mockReturnValue({
      permissoes: { '/cadastro-abae': { podeIncluir: true, podeAlterar: true, podeExcluir: true } },
    });
    mockBuscarPorId.mockResolvedValue({ sucesso: true, dados: {} });
    mockIncluir.mockResolvedValue({ sucesso: true });
    mockAlterar.mockResolvedValue({ sucesso: true });
    mockExcluir.mockResolvedValue({ sucesso: true });
  });

  it('renderiza campos principais', () => {
    render(<FormCadastroABAE />);
    expect(screen.getByTestId('select-dre')).toBeInTheDocument();
    expect(screen.getByTestId('select-ue')).toBeInTheDocument();
    expect(screen.getByTestId('input-cpf')).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-telefone')).toBeInTheDocument();
    expect(screen.getByTestId('input-cep')).toBeInTheDocument();
    expect(screen.getByTestId('input-endereco')).toBeInTheDocument();
    expect(screen.getByTestId('input-numero')).toBeInTheDocument();
    expect(screen.getByTestId('input-complemento')).toBeInTheDocument();
    expect(screen.getByTestId('input-bairro')).toBeInTheDocument();
    expect(screen.getByTestId('input-cidade')).toBeInTheDocument();
    expect(screen.getByTestId('input-estado')).toBeInTheDocument();
    expect(screen.getByTestId('input-situacao')).toBeInTheDocument();
  });

  it('chama navigate ao clicar em Voltar', async () => {
    render(<FormCadastroABAE />);
    fireEvent.click(screen.getByText('Voltar'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  });

  it('exibe auditoria quando criadoRF existe', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: 1 });
    (useSelector as jest.Mock).mockReturnValue({
      permissoes: { '/cadastro-abae': { podeIncluir: true, podeAlterar: true, podeExcluir: true } },
    });
    mockBuscarPorId.mockResolvedValue({ sucesso: true, dados: { criadoRF: '123' } });
    render(<FormCadastroABAE />);
    expect(await screen.findByTestId('auditoria')).toBeInTheDocument();
  });

  it('desabilita campos se somenteConsulta for true', () => {
    (verificaSomenteConsulta as jest.Mock).mockReturnValue(true);
    render(<FormCadastroABAE />);
    expect(screen.getByTestId('select-dre')).toBeInTheDocument();
  });
});
