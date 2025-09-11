// ServicoDashboardFrequencia.test.tsx
import ServicoDashboardFrequencia from './ServicoDashboardFrequencia';
import api from '~/servicos/api';
import { store } from '@/core/redux';
import { setDadosDashboardFrequencia } from '~/redux/modulos/dashboardFrequencia/actions';

jest.mock('~/servicos/api');
jest.mock('@/core/redux', () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
  },
}));
jest.mock('~/redux/modulos/dashboardFrequencia/actions', () => ({
  setDadosDashboardFrequencia: jest.fn(),
}));

describe('ServicoDashboardFrequencia', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve obter frequência global por ano', () => {
    const mockResponse = { data: 'teste' };
    api.get.mockResolvedValue(mockResponse);

    const params = {
      anoLetivo: 2025,
      dreId: 1,
      ueId: 2,
      modalidade: 3,
      semestre: 1,
    };

    return ServicoDashboardFrequencia.obterFrequenciaGlobalPorAno(
      params.anoLetivo,
      params.dreId,
      params.ueId,
      params.modalidade,
      params.semestre
    ).then(response => {
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('global/por-ano')
      );
      expect(response).toEqual(mockResponse);
    });
  });

  it('deve atualizar os filtros corretamente', () => {
    const stateMock = {
      dashboardFrequencia: {
        dadosDashboardFrequencia: {
          filtroAnterior: 'valor',
        },
      },
    };

    store.getState.mockReturnValue(stateMock);

    ServicoDashboardFrequencia.atualizarFiltros('novoFiltro', 'valorNovo');

    expect(setDadosDashboardFrequencia).toHaveBeenCalledWith({
      filtroAnterior: 'valor',
      novoFiltro: 'valorNovo',
    });

    expect(store.dispatch).toHaveBeenCalled();
  });

  it('deve obter última consolidação', () => {
    const anoLetivo = 2025;
    ServicoDashboardFrequencia.obterUltimaConsolidacao(anoLetivo);
    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/frequencias/consolidacao?anoLetivo=2025'
    );
  });

  it('deve chamar corretamente obterFrequenciasConsolidacaoSemanalMensalPorTurmaEAno', () => {
    const mockParams = {
      anoLetivo: 2025,
      dreId: 1,
      ueId: 2,
      modalidade: 3,
      semestre: 1,
      anoTurma: 5,
      dataInicio: '2025-03-01',
      dataFim: '2025-03-31',
      tipoConsolidadoFrequencia: 'mensal',
      mes: 3,
      visaoDre: true,
    };

    ServicoDashboardFrequencia.obterFrequenciasConsolidacaoSemanalMensalPorTurmaEAno(
      ...Object.values(mockParams)
    );

    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('/consolidado-semanal-mensal'),
      {
        params: {
          semestre: 1,
          dataInicio: '2025-03-01',
          dataFim: '2025-03-31',
          tipoConsolidadoFrequencia: 'mensal',
          mes: 3,
          visaoDre: true,
        },
      }
    );
  });
});
