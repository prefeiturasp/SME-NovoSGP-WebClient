import ServicoDashboardFechamento from './ServicoDashboardFechamento';
import api from '~/servicos/api';
import { store } from '@/core/redux';
import { setDadosDashboardFechamento } from '~/redux/modulos/dashboardFechamento/actions';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
}));

jest.mock('@/core/redux', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({
      dashboardFechamento: {
        dadosDashboardFechamento: {
          dreId: 'original',
          ueId: 'original',
        },
      },
    })),
  },
}));

jest.mock('~/redux/modulos/dashboardFechamento/actions', () => ({
  setDadosDashboardFechamento: jest.fn((payload) => ({
    type: 'SET_DADOS_DASHBOARD_FECHAMENTO',
    payload,
  })),
}));

describe('ServicoDashboardFechamento', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const parametrosComuns = {
    anoLetivo: 2025,
    dreId: 'dre123',
    ueId: 'ue456',
    modalidade: '1',
    semestre: '2',
    bimestre: '3',
  };

  it('montarConsultaPadraoGraficos deve construir a URL corretamente', () => {
    ServicoDashboardFechamento.montarConsultaPadraoGraficos({
      rota: 'teste',
      ...parametrosComuns,
    });

    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/fechamentos/teste?anoLetivo=2025&dreId=dre123&ueId=ue456&modalidade=1&semestre=2&bimestre=3'
    );
  });

  it('obterSituacaoProcessoFechamento deve chamar montarConsultaPadraoGraficos com rota correta', () => {
    ServicoDashboardFechamento.obterSituacaoProcessoFechamento(
      2025,
      'dreX',
      'ueY',
      '2',
      '1',
      '4'
    );
    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/fechamentos/situacoes?anoLetivo=2025&dreId=dreX&ueId=ueY&modalidade=2&semestre=1&bimestre=4'
    );
  });

  it('obterFechamentoPorEstudantes deve funcionar corretamente', () => {
    ServicoDashboardFechamento.obterFechamentoPorEstudantes(
      2024,
      'dre1',
      'ue1',
      '3',
      '2',
      '1'
    );
    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/fechamentos/estudantes?anoLetivo=2024&dreId=dre1&ueId=ue1&modalidade=3&semestre=2&bimestre=1'
    );
  });

  it('obterPendenciasFechamento deve funcionar corretamente', () => {
    ServicoDashboardFechamento.obterPendenciasFechamento(
      2023,
      'dre',
      'ue',
      '4',
      '2',
      '1'
    );
    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/fechamentos/pendencias?anoLetivo=2023&dreId=dre&ueId=ue&modalidade=4&semestre=2&bimestre=1'
    );
  });

  it('atualizarFiltros deve chamar o dispatch com novo estado atualizado', () => {
    ServicoDashboardFechamento.atualizarFiltros('dreId', 'novoDre');
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SET_DADOS_DASHBOARD_FECHAMENTO',
        payload: expect.objectContaining({
          dreId: 'novoDre',
          ueId: 'original',
        }),
      })
    );
  });

  it('obterAnosEscolaresPorModalidade deve funcionar corretamente', () => {
    ServicoDashboardFechamento.obterAnosEscolaresPorModalidade(
      2025,
      'dreX',
      'ueY',
      '5',
      '2'
    );
    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/fechamentos/modalidades/ano?anoLetivo=2025&dreId=dreX&ueId=ueY&modalidade=5&semestre=2'
    );
  });

  it('obterSituacaoConselhoClasse deve funcionar corretamente', () => {
    ServicoDashboardFechamento.obterSituacaoConselhoClasse(
      2022,
      'dre1',
      'ue1',
      '6',
      '1',
      '3'
    );
    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/fechamentos/conselhos-classes/situacoes?anoLetivo=2022&dreId=dre1&ueId=ue1&modalidade=6&semestre=1&bimestre=3'
    );
  });

  it('obterNotasFinais deve funcionar corretamente', () => {
    ServicoDashboardFechamento.obterNotasFinais(
      2025,
      'dreX',
      'ueY',
      '7',
      '1',
      '2'
    );
    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/fechamentos/conselhos-classes/notas-finais?anoLetivo=2025&dreId=dreX&ueId=ueY&modalidade=7&semestre=1&bimestre=2'
    );
  });

  it('obterParecerConclusivo deve funcionar corretamente', () => {
    ServicoDashboardFechamento.obterParecerConclusivo(
      2025,
      'dreZ',
      'ueZ',
      '9',
      '2',
      '1'
    );
    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/fechamentos/conselhos-classes/pareceres-conclusivos?anoLetivo=2025&dreId=dreZ&ueId=ueZ&modalidade=9&semestre=2&bimestre=1'
    );
  });
});
