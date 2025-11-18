/* eslint-disable @typescript-eslint/no-var-requires */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RelatorioProdutividade } from './index';
import relatoriosService from '@/core/services/relatorios-service';
import { sucesso } from '~/servicos';
import { OPCAO_TODOS } from '~/constantes';

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
    <button
      data-testid="btn-gerar"
      type="submit"
      disabled={props.desabilitarGerar}
      onClick={props.onClick}
    >
      Gerar
    </button>
  ),
}));
jest.mock('@/components/sgp/inputs/form/anoLetivo', () => {
  const { Form } = require('antd');
  return {
    __esModule: true,
    default: () => (
      <Form.Item name="anoLetivo" initialValue="">
        <input data-testid="ano-letivo" />
      </Form.Item>
    ),
  };
});

jest.mock('@/components/sgp/inputs/form/dre', () => {
  const { Form } = require('antd');
  return {
    __esModule: true,
    default: () => (
      <Form.Item name={['dre', 'value']} initialValue="">
        <input data-testid="dre" />
      </Form.Item>
    ),
  };
});

jest.mock('@/components/sgp/inputs/form/ue', () => {
  const { Form } = require('antd');
  return {
    __esModule: true,
    default: () => (
      <Form.Item name={['ue', 'value']} initialValue="">
        <input data-testid="ue" />
      </Form.Item>
    ),
  };
});

jest.mock('@/components/sgp/inputs/form/exibir-historico', () => {
  const { Form } = require('antd');
  return {
    __esModule: true,
    default: () => (
      // sem initialValue aqui
      <Form.Item name="consideraHistorico" valuePropName="checked">
        <input data-testid="exibir-historico" type="checkbox" />
      </Form.Item>
    ),
  };
});
jest.mock('./components/bimestres', () => {
  const { Form } = require('antd');
  const OPCAO_TODOS = -99;
  return {
    __esModule: true,
    SelectBimestresFrequenciaProdutividade: () => (
      <Form.Item name="bimestre" initialValue={OPCAO_TODOS}>
        <select data-testid="bimestre">
          <option value={OPCAO_TODOS}>Todas</option>
          <option value="2">2º</option>
        </select>
      </Form.Item>
    ),
  };
});

jest.mock('./components/tipo-produtividade', () => {
  const { Form } = require('antd');
  const OPCAO_TODOS = -99;
  return {
    __esModule: true,
    SelectTipoRelatorioFrequenciaProdutividade: () => (
      <Form.Item name="tipoRelatorioProdutividade" initialValue={OPCAO_TODOS}>
        <select data-testid="tipo-prod">
          <option value={OPCAO_TODOS}>Todas</option>
          <option value="X">X</option>
        </select>
      </Form.Item>
    ),
  };
});

jest.mock('./components/professores', () => {
  const { Form } = require('antd');
  return {
    __esModule: true,
    LocalizadorProfessorRelProdutividade: () => (
      <Form.Item name="localizadorProfessor" initialValue="">
        <input data-testid="professor" />
      </Form.Item>
    ),
  };
});

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

  it('deve habilitar o botão de gerar ao disparar onSelect', async () => {
    (relatoriosService.produtividadeFrequencia as jest.Mock).mockResolvedValue({ sucesso: true });
    render(<RelatorioProdutividade />);

    const btn = screen.getByTestId('btn-gerar');
    fireEvent.click(btn);
    await waitFor(() => expect(btn).toBeDisabled());

    fireEvent.select(screen.getByTestId('dre'));
    expect(btn).not.toBeDisabled();
  });

  it('deve mapear corretamente os campos e incluir o bimestre no params', async () => {
    (relatoriosService.produtividadeFrequencia as jest.Mock).mockResolvedValue({ sucesso: true });
    render(<RelatorioProdutividade />);

    fireEvent.change(screen.getByTestId('ano-letivo'), { target: { value: '2023' } });
    fireEvent.change(screen.getByTestId('dre'), { target: { value: 'DRE1' } });
    fireEvent.change(screen.getByTestId('ue'), { target: { value: 'UE1' } });
    fireEvent.change(screen.getByTestId('bimestre'), { target: { value: '2' } });
    fireEvent.change(screen.getByTestId('tipo-prod'), { target: { value: 'X' } });
    fireEvent.change(screen.getByTestId('professor'), { target: { value: 'RF123' } });
    fireEvent.click(screen.getByTestId('exibir-historico'));

    fireEvent.click(screen.getByTestId('btn-gerar'));

    await waitFor(() => {
      expect(relatoriosService.produtividadeFrequencia).toHaveBeenCalledWith({
        anoLetivo: '2023',
        bimestre: '2',
        tipoRelatorioProdutividade: 'X',
        codigoDre: 'DRE1',
        codigoUe: 'UE1',
        rfProfessor: undefined,
      });
    });
  });

  it('deve enviar bimestre null quando for OPCAO_TODOS', async () => {
    (relatoriosService.produtividadeFrequencia as jest.Mock).mockResolvedValue({ sucesso: true });
    render(<RelatorioProdutividade />);

    fireEvent.change(screen.getByTestId('ano-letivo'), { target: { value: '2024' } });
    fireEvent.change(screen.getByTestId('bimestre'), { target: { value: OPCAO_TODOS } });

    fireEvent.click(screen.getByTestId('btn-gerar'));

    await waitFor(() => {
      expect(relatoriosService.produtividadeFrequencia).toHaveBeenCalledWith(
        expect.objectContaining({ anoLetivo: '2024', bimestre: null }),
      );
    });
  });

  it('deve mapear código DRE e UE nos dois casos (valor e OPCAO_TODOS)', async () => {
    (relatoriosService.produtividadeFrequencia as jest.Mock).mockResolvedValue({ sucesso: true });
    render(<RelatorioProdutividade />);

    fireEvent.change(screen.getByTestId('dre'), { target: { value: 'DRE_ABC' } });
    fireEvent.change(screen.getByTestId('ue'), { target: { value: 'UE_XYZ' } });
    fireEvent.click(screen.getByTestId('btn-gerar'));

    await waitFor(() => {
      expect(relatoriosService.produtividadeFrequencia).toHaveBeenCalledWith(
        expect.objectContaining({
          codigoDre: 'DRE_ABC',
          codigoUe: 'UE_XYZ',
        }),
      );
    });

    jest.clearAllMocks();
    const { cleanup } = require('@testing-library/react');
    cleanup();

    render(<RelatorioProdutividade />);
    fireEvent.change(screen.getByTestId('dre'), { target: { value: OPCAO_TODOS } });
    fireEvent.change(screen.getByTestId('ue'), { target: { value: OPCAO_TODOS } });
    fireEvent.click(screen.getByTestId('btn-gerar'));

    await waitFor(() => {
      expect(relatoriosService.produtividadeFrequencia).toHaveBeenCalledWith(
        expect.objectContaining({
          codigoDre: null,
          codigoUe: null,
        }),
      );
    });
  });
});
