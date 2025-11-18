import { store } from '@/core/redux';
import { setDadosDashboardDiarioBordo } from '~/redux/modulos/dashboardDiarioBordo/actions';
import api from '~/servicos/api';

const urlPadrao = 'v1/dashboard/diario-bordo';

class ServicoDashboardDiarioBordo {
  montarConsultaPadraoGraficos = params => {
    const { rota, anoLetivo, dreId, ueId, modalidade, anoEscolar } = params;

    let url = `${urlPadrao}/${rota}?anoLetivo=${anoLetivo}`;

    if (dreId) {
      url += `&dreId=${dreId}`;
    }
    if (ueId) {
      url += `&ueId=${ueId}`;
    }
    if (modalidade) {
      url += `&modalidade=${modalidade}`;
    }
    if (anoEscolar) {
      url += `&ano=${anoEscolar}`;
    }
    return api.get(url);
  };

  obterDiariosBordoPreenchidosPendentes = (
    anoLetivo,
    dreId,
    ueId,
    modalidade
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'quantidade-preenchidos-pendentes',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
    });
  };

  obterTotalDiariosBordoPorDRE = (anoLetivo, anoEscolar) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'quantidade-diarios-pendentes-dre',
      anoLetivo,
      anoEscolar,
    });
  };

  obterUltimaConsolidacao = anoLetivo => {
    return api.get(`${urlPadrao}/consolidacao?anoLetivo=${anoLetivo}`);
  };

  atualizarFiltros = (nomeParametro, valor) => {
    const { dispatch } = store;
    const state = store.getState();

    const { dashboardDiarioBordo } = state;
    const { dadosDashboardDiarioBordo } = dashboardDiarioBordo;

    const novoMap = { ...dadosDashboardDiarioBordo };
    novoMap[nomeParametro] = valor;

    dispatch(setDadosDashboardDiarioBordo(novoMap));
  };
}

export default new ServicoDashboardDiarioBordo();
