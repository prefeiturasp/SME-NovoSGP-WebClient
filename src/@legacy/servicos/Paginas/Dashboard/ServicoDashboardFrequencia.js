import { store } from '@/core/redux';
import { setDadosDashboardFrequencia } from '~/redux/modulos/dashboardFrequencia/actions';
import api from '~/servicos/api';

const urlPadrao = 'v1/dashboard/frequencias';

class ServicoDashboardFrequencia {
  montarConsultaPadraoGraficos = params => {
    const {
      rota,
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      semestre,
      anoEscolar,
      turmaId,
    } = params;

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
    if (semestre) {
      url += `&semestre=${semestre}`;
    }
    if (anoEscolar) {
      url += `&ano=${anoEscolar}`;
    }
    if (turmaId) {
      url += `&turmaId=${turmaId}`;
    }
    return api.get(url);
  };

  obterFrequenciaGlobalPorAno = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    semestre
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'global/por-ano',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      semestre,
    });
  };

  obterFrequenciaGlobalPorDRE = (
    anoLetivo,
    modalidade,
    anoEscolar,
    semestre
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'global/dre',
      anoLetivo,
      modalidade,
      anoEscolar,
      semestre,
    });
  };

  obterQuantidadeAusenciasPossuemJustificativa = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    semestre
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'ausencias/justificativas',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      semestre,
    });
  };

  obterQuantidadeJustificativasMotivo = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    semestre,
    anoEscolar,
    turmaId
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'ausencias/motivo',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      semestre,
      anoEscolar,
      turmaId,
    });
  };

  obterAnosEscolaresPorModalidade = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    semestre
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'modalidades/ano',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      semestre,
    });
  };

  obterUltimaConsolidacao = anoLetivo => {
    return api.get(`${urlPadrao}/consolidacao?anoLetivo=${anoLetivo}`);
  };

  atualizarFiltros = (nomeParametro, valor) => {
    const { dispatch } = store;
    const state = store.getState();

    const { dashboardFrequencia } = state;
    const { dadosDashboardFrequencia } = dashboardFrequencia;

    const novoMap = { ...dadosDashboardFrequencia };
    novoMap[nomeParametro] = valor;

    dispatch(setDadosDashboardFrequencia(novoMap));
  };

  obterTipoGraficos = tipoGraficos => {
    const retorno = Object.keys(tipoGraficos).map(item => tipoGraficos[item]);
    this.atualizarFiltros('listaTipoGrafico', retorno);
  };

  obterListaMeses = (obterTodosMeses, mesAtual, todosMeses) => {
    const retorno = obterTodosMeses();
    const meses = todosMeses
      ? retorno
      : retorno.filter(item => Number(item.numeroMes) <= mesAtual);
    this.atualizarFiltros('listaMeses', meses);
  };

  obterSemanas = anoLetivo => {
    return api.get(`${urlPadrao}/filtro/anos/${anoLetivo}/semanas`);
  };

  obterFrequenciasConsolidadacaoDiariaPorTurmaEAno = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    semestre,
    anoTurma,
    dataAula,
    visaoDre
  ) => {
    const url = `${urlPadrao}/anos/${anoLetivo}/dres/${dreId}/ues/${ueId}/modalidades/${modalidade}/anoTurma/${anoTurma}/consolidado-diario`;
    const params = {
      semestre,
      dataAula,
      visaoDre,
    };
    return api.get(url, {
      params,
    });
  };

  obterFrequenciasConsolidacaoSemanalMensalPorTurmaEAno = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    semestre,
    anoTurma,
    dataInicio,
    dataFim,
    tipoConsolidadoFrequencia,
    mes,
    visaoDre
  ) => {
    const url = `${urlPadrao}/anos/${anoLetivo}/dres/${dreId}/ues/${ueId}/modalidades/${modalidade}/anoTurma/${anoTurma}/consolidado-semanal-mensal`;
    const params = {
      semestre,
      dataInicio,
      dataFim,
      tipoConsolidadoFrequencia,
      mes,
      visaoDre,
    };
    return api.get(url, {
      params,
    });
  };

  obterTotalAusenciasCompensadas = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    semestre,
    bimestre
  ) => {
    return api.get(
      `/v1/dashboard/compensacoes/ausencia/anos/${anoLetivo}/dres/${dreId}/ues/${ueId}/modalidades/${modalidade}/` +
        `consolidado/anos-turmas`,
      {
        params: {
          semestre,
          bimestre,
        },
      }
    );
  };

  obterTotalAtividadeCompensacao = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    semestre,
    bimestre
  ) => {
    return api.get(
      `/v1/dashboard/compensacoes/ausencia/anos/${anoLetivo}/dres/${dreId}/ues/${ueId}/modalidades/${modalidade}/` +
        `consolidado/compensacoes-consideradas`,
      {
        params: {
          semestre,
          bimestre,
        },
      }
    );
  };
}

export default new ServicoDashboardFrequencia();
