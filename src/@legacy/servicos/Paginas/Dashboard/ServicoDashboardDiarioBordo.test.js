import ServicoDashboardDiarioBordo from './ServicoDashboardDiarioBordo';
import api from '~/servicos/api';
import { store } from '@/core/redux';
import { setDadosDashboardDiarioBordo } from '~/redux/modulos/dashboardDiarioBordo/actions';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
}));

jest.mock('@/core/redux', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({
      dashboardDiarioBordo: {
        dadosDashboardDiarioBordo: {
          anoLetivo: 2025,
        },
      },
    })),
  },
}));

jest.mock('~/redux/modulos/dashboardDiarioBordo/actions', () => ({
  setDadosDashboardDiarioBordo: jest.fn(param => ({ type: 'SET_DADOS', payload: param })),
}));

describe('ServicoDashboardDiarioBordo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar a API correta em obterDiariosBordoPreenchidosPendentes', () => {
    ServicoDashboardDiarioBordo.obterDiariosBordoPreenchidosPendentes(2025, '1', '2', '3');

    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/diario-bordo/quantidade-preenchidos-pendentes?anoLetivo=2025&dreId=1&ueId=2&modalidade=3'
    );
  });

  it('deve chamar a API correta em obterTotalDiariosBordoPorDRE', () => {
    ServicoDashboardDiarioBordo.obterTotalDiariosBordoPorDRE(2025, '9ano');

    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/diario-bordo/quantidade-diarios-pendentes-dre?anoLetivo=2025&ano=9ano'
    );
  });

  it('deve chamar a API correta em obterUltimaConsolidacao', () => {
    ServicoDashboardDiarioBordo.obterUltimaConsolidacao(2024);

    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/diario-bordo/consolidacao?anoLetivo=2024'
    );
  });

  it('deve atualizar filtros corretamente com atualizarFiltros', () => {
    ServicoDashboardDiarioBordo.atualizarFiltros('anoLetivo', 2026);

    expect(setDadosDashboardDiarioBordo).toHaveBeenCalledWith({
      anoLetivo: 2026,
    });

    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'SET_DADOS',
      payload: {
        anoLetivo: 2026,
      },
    });
  });
});
