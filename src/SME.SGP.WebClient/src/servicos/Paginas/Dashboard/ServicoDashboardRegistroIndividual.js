import { store } from '~/redux';
import { setDadosDashboardRegistroIndividual } from '~/redux/modulos/dashboardRegistroIndividual/actions';
import api from '~/servicos/api';

const urlPadrao = 'v1/dashboard/registros_individuais';

class ServicoDashboardRegistroIndividual {
  montarConsultaPadraoGraficos = params => {
    const { rota, anoLetivo, dreId, ueId, modalidade } = params;

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
    return api.get(url);
  };

  obterQuantidadeTotalRegistrosIndividuais = (
    anoLetivo,
    dreId,
    ueId,
    modalidade
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'total-ano-turma',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
    });
  };

  obterMediaPeriodoRegistrosIndividuaisPorCrianca = (
    anoLetivo,
    dreId,
    ueId,
    modalidade
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'media',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
    });
  };

  obterQuantidadeCriancasSemRegistros = (
    anoLetivo,
    dreId,
    ueId,
    modalidade
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'alunos-sem-registro',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
    });
  };

  obterUltimaConsolidacao = anoLetivo => {
    return api.get(`${urlPadrao}/ultima-consolidacao?anoLetivo=${anoLetivo}`);
  };

  obterQuantidadeDiasSemRegistro = anoLetivo => {
    return api.get(
      `${urlPadrao}/quantidade-dias-sem-registro?anoLetivo=${anoLetivo}`
    );
  };

  atualizarFiltros = (nomeParametro, valor) => {
    const { dispatch } = store;
    const state = store.getState();

    const { dashboardRegistroIndividual } = state;
    const { dadosDashboardRegistroIndividual } = dashboardRegistroIndividual;

    const novoMap = { ...dadosDashboardRegistroIndividual };
    novoMap[nomeParametro] = valor;

    dispatch(setDadosDashboardRegistroIndividual(novoMap));
  };
}

export default new ServicoDashboardRegistroIndividual();
