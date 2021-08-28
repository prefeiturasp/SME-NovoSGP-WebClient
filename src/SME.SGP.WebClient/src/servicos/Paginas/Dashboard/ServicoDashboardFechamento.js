import api from '~/servicos/api';
import { store } from '~/redux';
import { setDadosDashboardFechamento } from '~/redux/modulos/dashboardFechamento/actions';

class ServicoDashboardFechamento {
  montarConsultaPadraoGraficos = params => {
    const {
      rota,
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      semestre,
      bimestre,
    } = params;

    let url = `v1/dashboard/fechamentos/${rota}?anoLetivo=${anoLetivo}`;

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
    if (bimestre) {
      url += `&bimestre=${bimestre}`;
    }
    return api.get(url);
  };

  obterSituacaoProcessoFechamento = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    semestre,
    bimestre
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'situacoes',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      semestre,
      bimestre,
    });
  };

  obterFechamentoPorEstudantes = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    semestre,
    bimestre
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'estudantes',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      semestre,
      bimestre,
    });
  };

  obterPendenciasFechamento = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    semestre,
    bimestre
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'pendencias',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      semestre,
      bimestre,
    });
  };

  atualizarFiltros = (nomeParametro, valor) => {
    const { dispatch } = store;
    const state = store.getState();

    const { dashboardFechamento } = state;
    const { dadosDashboardFechamento } = dashboardFechamento;

    const novoMap = { ...dadosDashboardFechamento };
    novoMap[nomeParametro] = valor;

    dispatch(setDadosDashboardFechamento(novoMap));
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

  obterSituacaoConselhoClasse = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    semestre,
    bimestre
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'situacoes',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      semestre,
      bimestre,
    });
  };

  obterNotasFinais = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    semestre,
    bimestre
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'situacoes',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      semestre,
      bimestre,
    });
  };

  obterParecerConclusivo = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    semestre,
    bimestre
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'situacoes',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      semestre,
      bimestre,
    });
  };
}

export default new ServicoDashboardFechamento();
