import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RelatorioProdutividade } from './index';
import relatoriosService from '@/core/services/relatorios-service';
import { sucesso } from '~/servicos';

jest.mock('@/components/lib/card-content', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="card-content">{props.children}</div>,
}));
jest.mock('@/components/lib/header-page', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="header-page">{props.children}</div>,
}));
jest.mock('@/components/sgp/botoes-acoes/relatorio', () => ({
  __esModule: true,
  BotoesAcoesRelatorio: (props: any) => (
    <button data-testid="btn-gerar" disabled={props.desabilitarGerar} onClick={props.onClick}>
      Gerar
    </button>
  ),
}));
jest.mock('@/components/sgp/inputs/form/anoLetivo', () => ({
  __esModule: true,
  default: () => <input data-testid="ano-letivo" name="anoLetivo" />,
}));
jest.mock('@/components/sgp/inputs/form/dre', () => ({
  __esModule: true,
  default: () => <input data-testid="dre" name="dre" />,
}));
jest.mock('@/components/sgp/inputs/form/ue', () => ({
  __esModule: true,
  default: () => <input data-testid="ue" name="ue" />,
}));
jest.mock('@/components/sgp/inputs/form/exibir-historico', () => ({
  __esModule: true,
  default: () => <input data-testid="exibir-historico" name="exibirHistorico" type="checkbox" />,
}));
jest.mock('./components/bimestres', () => ({
  __esModule: true,
  SelectBimestresFrequenciaProdutividade: () => (
    <select data-testid="bimestre" name="bimestre">
      <option value="1">1º</option>
    </select>
  ),
}));
jest.mock('./components/professores', () => ({
  __esModule: true,
  LocalizadorProfessorRelProdutividade: () => (
    <input data-testid="professor" name="localizadorProfessor" />
  ),
}));
jest.mock('./components/tipo-produtividade', () => ({
  __esModule: true,
  SelectTipoRelatorioFrequenciaProdutividade: () => (
    <select data-testid="tipo-prod" name="tipoRelatorioProdutividade">
      <option value="1">Tipo</option>
    </select>
  ),
}));
jest.mock('~/componentes', () => ({
  __esModule: true,
  Loader: (props: any) =>
    props.loading ? <div data-testid="loader">Carregando...</div> : <div>{props.children}</div>,
}));
jest.mock('~/servicos', () => ({ sucesso: jest.fn() }));

jest.mock('@/core/services/relatorios-service', () => ({
  __esModule: true,
  default: {
    produtividadeFrequencia: jest.fn(),
  },
}));

describe('RelatorioProdutividade', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar todos os campos do formulário', () => {
    render(<RelatorioProdutividade />);
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
    expect(screen.getByTestId('header-page')).toBeInTheDocument();
    expect(screen.getByTestId('btn-gerar')).toBeInTheDocument();
    expect(screen.getByTestId('ano-letivo')).toBeInTheDocument();
    expect(screen.getByTestId('dre')).toBeInTheDocument();
    expect(screen.getByTestId('ue')).toBeInTheDocument();
    expect(screen.getByTestId('exibir-historico')).toBeInTheDocument();
    expect(screen.getByTestId('bimestre')).toBeInTheDocument();
    expect(screen.getByTestId('tipo-prod')).toBeInTheDocument();
    expect(screen.getByTestId('professor')).toBeInTheDocument();
  });

  it('deve exibir o loader quando loading for true', async () => {
    (relatoriosService.produtividadeFrequencia as jest.Mock).mockImplementation(() => {
      return new Promise(() => {
        /* nunca resolve */
      });
    });
    render(<RelatorioProdutividade />);
    fireEvent.click(screen.getByTestId('btn-gerar'));
    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });

  it('deve chamar o serviço e exibir mensagem de sucesso ao gerar relatório', async () => {
    (relatoriosService.produtividadeFrequencia as jest.Mock).mockResolvedValue({ sucesso: true });
    render(<RelatorioProdutividade />);
    fireEvent.click(screen.getByTestId('btn-gerar'));
    await waitFor(() => {
      expect(relatoriosService.produtividadeFrequencia).toHaveBeenCalled();
      expect(sucesso).toHaveBeenCalled();
    });
  });

  it('deve desabilitar o botão de gerar após sucesso', async () => {
    (relatoriosService.produtividadeFrequencia as jest.Mock).mockResolvedValue({ sucesso: true });
    render(<RelatorioProdutividade />);
    const btn = screen.getByTestId('btn-gerar');
    fireEvent.click(btn);
    await waitFor(() => {
      expect(btn).toBeDisabled();
    });
  });

  it('deve habilitar o botão de gerar ao alterar o formulário', async () => {
    (relatoriosService.produtividadeFrequencia as jest.Mock).mockResolvedValue({ sucesso: true });
    render(<RelatorioProdutividade />);
    const btn = screen.getByTestId('btn-gerar');
    fireEvent.click(btn);
    await waitFor(() => {
      expect(btn).toBeDisabled();
    });
    fireEvent.change(screen.getByTestId('ano-letivo'), { target: { value: '2024' } });
    expect(btn).not.toBeDisabled();
  });

  it('deve tratar resposta de erro do serviço sem chamar sucesso', async () => {
    (relatoriosService.produtividadeFrequencia as jest.Mock).mockResolvedValue({ sucesso: false });
    render(<RelatorioProdutividade />);
    fireEvent.click(screen.getByTestId('btn-gerar'));
    await waitFor(() => {
      expect(relatoriosService.produtividadeFrequencia).toHaveBeenCalled();
      expect(sucesso).not.toHaveBeenCalled();
    });
  });
});
