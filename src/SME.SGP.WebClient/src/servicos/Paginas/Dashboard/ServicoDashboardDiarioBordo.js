import { store } from '~/redux';
import { setDadosDashboardDiarioBordo } from '~/redux/modulos/dashboardDiarioBordo/actions';
import api from '~/servicos/api';

const urlPadrao = 'v1/dashboard/diario-bordo';

class ServicoDashboardDiarioBordo {
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

  obterQuantidadeTotalDiariosBordos = (
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
      {
        quantidade: 500,
        descricao: 'Qtd. diários de bordos preenchidos',
        turma: 'EI - 5',
      },
      {
        quantidade: 326,
        descricao: 'Qtd. de diários com devolutiva',
        turma: 'EI - 5',
      },
      {
        quantidade: 400,
        descricao: 'Qtd. diários de bordos preenchidos',
        turma: 'EI - 6',
      },
      {
        quantidade: 360,
        descricao: 'Qtd. de diários com devolutiva',
        turma: 'EI - 6',
      },
    ];

    return new Promise(resolve => {
      return setTimeout(() => {
        resolve({ data: mock });
      }, 1000);
    });
  };

  obterQuantidadeTotalDiariosBordoPendentes = (
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
      { quantidade: 50, descricao: 'EI - 5' },
      { quantidade: 42, descricao: 'EI - 6' },
    ];

    return new Promise(resolve => {
      return setTimeout(() => {
        resolve({ data: mock });
      }, 1000);
    });
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
