import { render, screen, waitFor } from '@testing-library/react';
import TabelaIndicadoresPap from './TabelaIndicadoresPap';
import ServicoPap from '~/servicos/InformacoesEducacionais/ServicoPap';
import { erros } from '~/servicos/alertas';

jest.mock('~/servicos/InformacoesEducacionais/ServicoPap', () => ({
  obterIndicadoresPap: jest.fn().mockResolvedValue({ data: [] }),
}));

jest.mock('~/servicos/alertas', () => ({
  erros: jest.fn(),
}));

jest.mock('./tabelaIndicadoresPapDetalhes', () => {
  return function MockTabelaIndicadoresPapDetalhes({ dados }) {
    return <div data-testid="mock-tabela">{JSON.stringify(dados)}</div>;
  };
});

jest.mock('@ckeditor/ckeditor5-react', () => ({
  default: () => <textarea data-testid="ckeditor-mock" />,
}));

jest.mock('@ckeditor/ckeditor5-build-classic', () => ({
  default: class MockEditor {},
}));

global.api = {
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
};

// Limpa os mocks antes de cada teste para garantir o isolamento
beforeEach(() => {
  jest.clearAllMocks();
});

describe('TabelaIndicadoresPap', () => {
  const propsPadrao = {
    anoLetivo: 2025,
    codigoDre: '123',
    codigoUe: '456',
  };

  it('deve renderizar sem erros', () => {
    ServicoPap.obterIndicadoresPap.mockResolvedValue({ data: [] });
    render(<TabelaIndicadoresPap {...propsPadrao} />);

    expect(screen.getByText(/Carregando/)).toBeInTheDocument();
  });

  it('deve sair do estado de loading', async () => {
    ServicoPap.obterIndicadoresPap.mockResolvedValue({ data: [] });
    render(<TabelaIndicadoresPap {...propsPadrao} />);

    expect(
      screen.getByText('Carregando indicadores PAP...')
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByText('Carregando indicadores PAP...')
      ).not.toBeInTheDocument();
    });
  });

  it('deve exibir o título após carregar', async () => {
    ServicoPap.obterIndicadoresPap.mockResolvedValue({ data: [] });
    render(<TabelaIndicadoresPap {...propsPadrao} />);

    expect(
      await screen.findByText('Projeto de Apoio Pedagógico (PAP)')
    ).toBeInTheDocument();
  });

  it('deve chamar o serviço de erros quando a API falhar', async () => {
    const erroSimulado = new Error('Falha ao buscar dados');
    ServicoPap.obterIndicadoresPap.mockRejectedValueOnce(erroSimulado);

    render(<TabelaIndicadoresPap {...propsPadrao} />);

    await waitFor(() => {
      expect(screen.queryByText('Carregando indicadores PAP...')).not.toBeInTheDocument();
    });

    expect(erros).toHaveBeenCalledTimes(1);
    expect(erros).toHaveBeenCalledWith(erroSimulado);
  });


  it('deve chamar o serviço com os parâmetros corretos e passar os dados para a tabela filha', async () => {
     const dadosSimulados = { totalTurmas: 10, totalAlunos: 150 };
    ServicoPap.obterIndicadoresPap.mockResolvedValueOnce({ data: dadosSimulados });

    render(<TabelaIndicadoresPap {...propsPadrao} />);

    await waitFor(() => {
      expect(screen.queryByText('Carregando indicadores PAP...')).not.toBeInTheDocument();
    });

    expect(ServicoPap.obterIndicadoresPap).toHaveBeenCalledTimes(1);
    expect(ServicoPap.obterIndicadoresPap).toHaveBeenCalledWith(
      propsPadrao.anoLetivo,
      propsPadrao.codigoDre,
      propsPadrao.codigoUe
    );

    const tabelaMock = screen.getByTestId('mock-tabela');
    expect(tabelaMock).toHaveTextContent(JSON.stringify(dadosSimulados));
  });
});
