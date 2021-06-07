import { store } from '~/redux';
import { setDadosDashboardRegistroIndividual } from '~/redux/modulos/dashboardRegistroIndividual/actions';
import api from '~/servicos/api';

const urlPadrao = 'v1/dashboard/registro-individual';

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
    modalidade,
    semestre
  ) => {
    // TODO
    // return this.montarConsultaPadraoGraficos({
    //   rota: '',
    //   anoLetivo,
    //   dreId,
    //   ueId,
    //   modalidade,
    // });

    const mock = [
      { quantidade: 500, descricao: 'EI - 5' },
      { quantidade: 350, descricao: 'EI - 6' },
    ];

    return new Promise(resolve => {
      return setTimeout(() => {
        resolve({ data: mock });
      }, 1000);
    });
  };

  obterMediaPeriodoRegistrosIndividuaisPorCrianca = (
    anoLetivo,
    dreId,
    ueId,
    modalidade
  ) => {
    // TODO
    // return this.montarConsultaPadraoGraficos({
    //   rota: '',
    //   anoLetivo,
    //   dreId,
    //   ueId,
    //   modalidade,
    // });

    const mock = [
      { quantidade: 30, descricao: 'EI - 5' },
      { quantidade: 25, descricao: 'EI - 6' },
    ];

    return new Promise(resolve => {
      return setTimeout(() => {
        resolve({ data: mock });
      }, 1000);
    });
  };

  obterQuantidadeCriancasSemRegistros = (
    anoLetivo,
    dreId,
    ueId,
    modalidade
  ) => {
    // TODO
    // return this.montarConsultaPadraoGraficos({
    //   rota: '',
    //   anoLetivo,
    //   dreId,
    //   ueId,
    //   modalidade,
    // });

    const mock = [
      { quantidade: 100, descricao: 'EI - 5' },
      { quantidade: 75, descricao: 'EI - 6' },
    ];

    return new Promise(resolve => {
      return setTimeout(() => {
        resolve({ data: mock });
      }, 1000);
    });
  };

  obterUltimaConsolidacao = anoLetivo => {
    // TODO
    // return api.get(`${urlPadrao}/consolidacao?anoLetivo=${anoLetivo}`);
    return new Promise(resolve => {
      return resolve({ data: '2021-06-07T17:36:39-03:00' });
    });
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
