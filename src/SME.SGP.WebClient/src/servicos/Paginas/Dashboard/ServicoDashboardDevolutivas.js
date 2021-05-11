import * as moment from 'moment';
import { store } from '~/redux';
import { setDadosDashboardDevolutivas } from '~/redux/modulos/dashboardDevolutivas/actions';
import api from '~/servicos/api';

const urlPadrao = 'v1/dashboard/devolutivas';

class ServicoDashboardDevolutivas {
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

  obterQtdDevolutivasRegistradasEstimada = (
    anoLetivo,
    dreId,
    ueId,
    modalidade
  ) => {
    // TODO - Validar rota e parametros!
    // return this.montarConsultaPadraoGraficos({
    //   rota: 'SEM-ROTA-AINDA',
    //   anoLetivo,
    //   dreId,
    //   ueId,
    //   modalidade,
    // });
    const mock = [
      {
        quantidade: 500,
        descricao: 'Qtd. estimativa de devolutivas',
        turma: 'EI-5',
      },
      {
        quantidade: 326,
        descricao: 'Qtd. de devolutivas registradas',
        turma: 'EI-5',
      },
      {
        quantidade: 400,
        descricao: 'Qtd. estimativa de devolutivas',
        turma: 'EI-6',
      },
      {
        quantidade: 360,
        descricao: 'Qtd. de devolutivas registradas',
        turma: 'EI-6',
      },
    ];

    return new Promise(resolve => {
      const retorno = { data: mock };
      setTimeout(() => {
        resolve(retorno);
      }, 2000);
    });
  };

  obterQtdDiarioBordoDevolutiva = (anoLetivo, dreId, ueId, modalidade) => {
    // TODO - Validar rota e parametros!
    // return this.montarConsultaPadraoGraficos({
    //   rota: 'SEM-ROTA-AINDA',
    //   anoLetivo,
    //   dreId,
    //   ueId,
    //   modalidade,
    // });
    const mock = [
      {
        quantidade: 500,
        descricao: 'Qtd. com devolutiva',
        turma: 'EI-5',
      },
      {
        quantidade: 72,
        descricao: 'Qtd.com devolutiva pendente',
        turma: 'EI-5',
      },
      {
        quantidade: 400,
        descricao: 'Qtd. com devolutiva',
        turma: 'EI-6',
      },
      {
        quantidade: 150,
        descricao: 'Qtd.com devolutiva pendente',
        turma: 'EI-6',
      },
    ];

    return new Promise(resolve => {
      const retorno = { data: mock };
      setTimeout(() => {
        resolve(retorno);
      }, 2000);
    });
  };

  obtertdDiariosBordoCampoReflexoesReplanejamentoPreenchido = (
    anoLetivo,
    dreId,
    ueId,
    modalidade
  ) => {
    // TODO - Validar rota e parametros!
    // return this.montarConsultaPadraoGraficos({
    //   rota: 'SEM-ROTA-AINDA',
    //   anoLetivo,
    //   dreId,
    //   ueId,
    //   modalidade,
    // });
    const mock = [
      {
        quantidade: 500,
        descricao: 'Qtd. com o campo reflexões e replanejamento preenchido',
        turma: 'EI-5',
      },
      {
        quantidade: 200,
        descricao: 'Qtd. com o campo reflexões e replanejamento não preenchido',
        turma: 'EI-5',
      },
      {
        quantidade: 400,
        descricao: 'Qtd. com o campo reflexões e replanejamento preenchido',
        turma: 'EI-6',
      },
      {
        quantidade: 150,
        descricao: 'Qtd. com o campo reflexões e replanejamento não preenchido',
        turma: 'EI-6',
      },
    ];

    return new Promise(resolve => {
      const retorno = { data: mock };
      setTimeout(() => {
        resolve(retorno);
      }, 2000);
    });
  };

  obterUltimaConsolidacao = anoLetivo => {
    // TODO - Validar rota e parametros!
    // return api.get(`${urlPadrao}/consolidacao?anoLetivo=${anoLetivo}`);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: moment() });
      }, 2000);
    });
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
