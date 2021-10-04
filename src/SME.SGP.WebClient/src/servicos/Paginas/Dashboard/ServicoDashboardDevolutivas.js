import { store } from '~/redux';
import { setDadosDashboardDevolutivas } from '~/redux/modulos/dashboardDevolutivas/actions';
import api from '~/servicos/api';

const urlPadrao = 'v1/dashboard/devolutivas';

class ServicoDashboardDevolutivas {
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

  obterQtdDevolutivasRegistradasEstimada = (
    anoLetivo,
    dreId,
    ueId,
    modalidade
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'consolidacao/turma-ano',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
    });
  };

  obterQtdDiarioBordoDevolutiva = (anoLetivo, dreId, ueId, modalidade) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'diarios-bordo/turma-ano',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
    });
  };

  obtertdDiariosBordoCampoReflexoesReplanejamentoPreenchido = (
    anoLetivo,
    dreId,
    ueId,
    modalidade
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'diarios-bordo/reflexoes-replanejamentos/turma-ano',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
    });
  };

  obterTotalDevolutivasPorDRE = (anoLetivo, anoEscolar) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'devolutivas/dre',
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

    const { dashboardDevolutivas } = state;
    const { dadosDashboardDevolutivas } = dashboardDevolutivas;

    const novoMap = { ...dadosDashboardDevolutivas };
    novoMap[nomeParametro] = valor;

    dispatch(setDadosDashboardDevolutivas(novoMap));
  };
}

export default new ServicoDashboardDevolutivas();
