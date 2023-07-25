import api from '~/servicos/api';
import { store } from '@/core/redux';
import { setDadosDashboardFrequencia } from '~/redux/modulos/dashboardFrequencia/actions';
import queryString from 'query-string';

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
    turmaIds,
    dataAula,
    visaoDre
  ) => {
    const url = `${urlPadrao}/anos/${anoLetivo}/dres/${dreId}/ues/${ueId}/modalidades/${modalidade}/consolidado-diario/anos-turmas`;
    const params = {
      semestre,
      turmaIds,
      dataAula,
      visaoDre,
    };
    return api.get(url, {
      params,
      paramsSerializer: {
        serialize: params => {
          return queryString.stringify(params, {
            arrayFormat: 'repeat',
            skipEmptyString: true,
            skipNull: true,
          });
        },
      },
    });
  };

  obterFrequenciasConsolidacaoSemanalMensalPorTurmaEAno = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    turmaIds,
    dataInicio,
    dataFim,
    tipoPeriodoDashboard,
    mes,
    visaoDre
  ) => {
    const url = `${urlPadrao}/anos/${anoLetivo}/dres/${dreId}/ues/${ueId}/modalidades/${modalidade}/consolidado-semanal-mensal/anos-turmas`;
    const params = {
      turmaIds,
      dataInicio,
      dataFim,
      tipoPeriodoDashboard,
      mes,
      visaoDre,
    };
    return api.get(url, {
      params,
      paramsSerializer: {
        serialize: params => {
          return queryString.stringify(params, {
            arrayFormat: 'repeat',
            skipEmptyString: true,
            skipNull: true,
          });
        },
      },
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
