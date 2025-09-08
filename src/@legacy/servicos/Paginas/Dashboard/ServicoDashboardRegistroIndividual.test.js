import ServicoDashboardRegistroIndividual from './ServicoDashboardRegistroIndividual';
import api from '~/servicos/api';
import { store } from '@/core/redux';
import { setDadosDashboardRegistroIndividual } from '~/redux/modulos/dashboardRegistroIndividual/actions';

jest.mock('~/servicos/api');
jest.mock('@/core/redux', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(),
  },
}));
jest.mock('~/redux/modulos/dashboardRegistroIndividual/actions', () => ({
  setDadosDashboardRegistroIndividual: jest.fn(val => ({ type: 'SET_DADOS', payload: val })),
}));

describe('ServicoDashboardRegistroIndividual', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store.getState.mockReturnValue({
      dashboardRegistroIndividual: {
        dadosDashboardRegistroIndividual: { filtroAtual: 'valor' },
      },
    });
  });

  it('deve montar corretamente a URL para obterTotalRegistrosIndividuaisPorDRE', () => {
    ServicoDashboardRegistroIndividual.obterTotalRegistrosIndividuaisPorDRE(2025, 9);
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('dre?anoLetivo=2025&ano=9')
    );
  });

  it('deve chamar api.get corretamente em obterUltimaConsolidacao', () => {
    ServicoDashboardRegistroIndividual.obterUltimaConsolidacao(2025);
    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/registros_individuais/ultima-consolidacao?anoLetivo=2025'
    );
  });

  it('deve atualizar os filtros corretamente com atualizarFiltros', () => {
    ServicoDashboardRegistroIndividual.atualizarFiltros('filtroAtual', 'novoValor');
    
    expect(store.dispatch).toHaveBeenCalledWith(
      setDadosDashboardRegistroIndividual({
        filtroAtual: 'novoValor',
      })
    );
  });

  it('deve montar corretamente a URL para obterQuantidadeTotalRegistrosIndividuais', () => {
    ServicoDashboardRegistroIndividual.obterQuantidadeTotalRegistrosIndividuais(2025, 1, 2, 3);
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('total-ano-turma?anoLetivo=2025&dreId=1&ueId=2&modalidade=3')
    );
  });

  it('deve montar corretamente a URL para obterQuantidadeCriancasSemRegistros', () => {
    ServicoDashboardRegistroIndividual.obterQuantidadeCriancasSemRegistros(2025, 1, 2, 3);
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('alunos-sem-registro?anoLetivo=2025&dreId=1&ueId=2&modalidade=3')
    );
  });

  it('deve montar corretamente a URL para obterMediaPeriodoRegistrosIndividuaisPorCrianca', () => {
    ServicoDashboardRegistroIndividual.obterMediaPeriodoRegistrosIndividuaisPorCrianca(2025, 1, 2, 3);
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('media?anoLetivo=2025&dreId=1&ueId=2&modalidade=3')
    );
  });

  it('deve chamar api.get corretamente em obterQuantidadeDiasSemRegistro', () => {
    ServicoDashboardRegistroIndividual.obterQuantidadeDiasSemRegistro(2025);
    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/registros_individuais/quantidade-dias-sem-registro?anoLetivo=2025'
    );
  });
});
