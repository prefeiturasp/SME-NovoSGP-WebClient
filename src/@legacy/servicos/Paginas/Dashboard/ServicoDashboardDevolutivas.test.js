import ServicoDashboardDevolutivas from './ServicoDashboardDevolutivas';
import api from '~/servicos/api';
import { store } from '@/core/redux';
import { setDadosDashboardDevolutivas } from '~/redux/modulos/dashboardDevolutivas/actions';

jest.mock('~/servicos/api');
jest.mock('@/core/redux', () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
  },
}));
jest.mock('~/redux/modulos/dashboardDevolutivas/actions', () => ({
  setDadosDashboardDevolutivas: jest.fn(),
}));

describe('ServicoDashboardDevolutivas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve montar corretamente a URL e chamar api.get em obterQtdDevolutivasRegistradasEstimada', async () => {
    const mockResponse = { data: 'ok' };
    api.get.mockResolvedValue(mockResponse);

    await ServicoDashboardDevolutivas.obterQtdDevolutivasRegistradasEstimada(2025, 1, 2, 3);

    expect(api.get).toHaveBeenCalledWith(expect.stringContaining('consolidacao/turma-ano'));
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining('anoLetivo=2025'));
  });

  it('deve montar corretamente a URL para obterQtdDiarioBordoDevolutiva', () => {
    ServicoDashboardDevolutivas.obterQtdDiarioBordoDevolutiva(2025, 1, 2, 3);
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining('diarios-bordo/turma-ano'));
  });

  it('deve montar corretamente a URL para obterUsuariosQueRegistraramDevolutivas', () => {
    ServicoDashboardDevolutivas.obterUsuariosQueRegistraramDevolutivas(2025, 1, 5);
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining('quantidade-devolutivas-por-ano'));
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining('mes=5'));
  });

  it('deve montar corretamente a URL para obterTotalDevolutivasPorDRE', () => {
    ServicoDashboardDevolutivas.obterTotalDevolutivasPorDRE(2025, 9);
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining('devolutivas/dre'));
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining('ano=9'));
  });

  it('deve chamar api.get corretamente em obterUltimaConsolidacao', () => {
    ServicoDashboardDevolutivas.obterUltimaConsolidacao(2025);
    expect(api.get).toHaveBeenCalledWith('v1/dashboard/devolutivas/consolidacao?anoLetivo=2025');
  });

  it('deve atualizar os filtros corretamente com atualizarFiltros', () => {
    const stateMock = {
      dashboardDevolutivas: {
        dadosDashboardDevolutivas: {
          filtroAtual: 'valorAtual',
        },
      },
    };

    store.getState.mockReturnValue(stateMock);

    ServicoDashboardDevolutivas.atualizarFiltros('novoFiltro', 'novoValor');

    expect(setDadosDashboardDevolutivas).toHaveBeenCalledWith({
      filtroAtual: 'valorAtual',
      novoFiltro: 'novoValor',
    });
    expect(store.dispatch).toHaveBeenCalled();
  });
});
