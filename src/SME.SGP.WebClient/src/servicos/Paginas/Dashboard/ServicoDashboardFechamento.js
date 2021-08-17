import api from '~/servicos/api';
import { store } from '~/redux';
import { setDadosDashboardFechamento } from '~/redux/modulos/dashboardFechamento/actions';

const urlPadrao = 'v1/dashboard/frequencias';

class ServicoDashboardFechamento {
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

  obterSituacaoProcessoFechamento = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    semestre,
    bimestre
  ) => {
    return new Promise((resolve, reject) => {
      resolve({
        data: [
          {
            turma: 'EF - 1',
            descricao: 'Qtd. acima do mínimo de frequencia',
            quantidade: 3018,
          },
          {
            turma: 'EF - 1',
            descricao: 'Qtd. abaixo do mínimo de frequencia',
            quantidade: 300,
          },
        ],
      });
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
    return new Promise((resolve, reject) => {
      resolve({
        data: [
          {
            turma: 'EF - 1',
            descricao: 'Qtd. acima do mínimo de frequencia',
            quantidade: 3018,
          },
          {
            turma: 'EF - 1',
            descricao: 'Qtd. abaixo do mínimo de frequencia',
            quantidade: 300,
          },
        ],
      });
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
    return new Promise((resolve, reject) => {
      resolve({
        data: [
          {
            turma: 'EF - 1',
            descricao: 'Qtd. acima do mínimo de frequencia',
            quantidade: 3018,
          },
          {
            turma: 'EF - 1',
            descricao: 'Qtd. abaixo do mínimo de frequencia',
            quantidade: 300,
          },
        ],
      });
    });
  };

  obterUltimaConsolidacao = anoLetivo => {
    return api.get(`${urlPadrao}/consolidacao?anoLetivo=${anoLetivo}`);
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
}

export default new ServicoDashboardFechamento();
