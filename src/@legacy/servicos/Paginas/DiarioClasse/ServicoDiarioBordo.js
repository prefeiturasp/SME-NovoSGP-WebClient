import { store } from '@/core/redux';
import { setDadosObservacoesUsuario } from '~/redux/modulos/observacoesUsuario/actions';
import api from '~/servicos/api';

const urlPadrao = `/v1/diarios-bordo`;

class ServicoDiarioBordo {
  obterDadosObservacoes = diarioBordoId => {
    return api.get(`${urlPadrao}/${diarioBordoId}/observacoes`);
  };

  salvarEditarObservacao = (diarioBordoId, dados) => {
    const observacaoId = dados?.id;
    if (observacaoId) {
      const url = `${urlPadrao}/observacoes/${observacaoId}`;
      return api.put(url, dados);
    }

    const url = `${urlPadrao}/${diarioBordoId}/observacoes`;
    return api.post(url, dados);
  };

  atualizarSalvarEditarDadosObservacao = (dados, dadosAposSalvar) => {
    const { dispatch } = store;
    const state = store.getState();

    const { observacoesUsuario } = state;
    const { dadosObservacoes } = observacoesUsuario;

    const observacaoId = dados?.id;

    if (observacaoId) {
      const item = dadosObservacoes.find(e => e.id === dados.id);
      const index = dadosObservacoes.indexOf(item);
      dados.auditoria = dadosAposSalvar;
      dadosObservacoes[index] = { ...dados };
      dispatch(setDadosObservacoesUsuario([...dadosObservacoes]));
    } else {
      const dadosObs = dadosObservacoes;
      const params = {
        proprietario: true,
        observacao: dados.observacao,
        id: dadosAposSalvar.id,
        auditoria: dadosAposSalvar,
      };
      dadosObs.unshift(params);
      dispatch(setDadosObservacoesUsuario([...dadosObs]));
    }
  };

  excluirObservacao = dados => {
    const observacaoId = dados.id;
    return api.delete(`${urlPadrao}/observacoes/${observacaoId}`);
  };

  excluirDiarioBordo = diarioId => {
    return api.delete(`${urlPadrao}/${diarioId}`);
  };

  atualizarExcluirDadosObservacao = dados => {
    const { dispatch } = store;
    const state = store.getState();

    const { observacoesUsuario } = state;
    const { dadosObservacoes } = observacoesUsuario;

    const item = dadosObservacoes.find(e => e.id === dados.id);
    const index = dadosObservacoes.indexOf(item);
    dadosObservacoes.splice(index, 1);

    dispatch(setDadosObservacoesUsuario([...dadosObservacoes]));
  };

  obterDiarioBordo = (aulaId, componenteCurricularId) => {
    if (aulaId && componenteCurricularId) {
      return api.get(
        `${urlPadrao}/${aulaId}?componenteCurricularId=${componenteCurricularId}`
      );
    }
    return [];
  };

  salvarDiarioBordo = (params, idDiarioBordo) => {
    if (idDiarioBordo) {
      params.id = idDiarioBordo;
      return api.put(urlPadrao, params);
    }
    return api.post(urlPadrao, params);
  };

  obterPlanejamentosPorIntervalo = (
    turmaCodigo,
    componenteCurricularId,
    dataInicio,
    dataFim,
    numeroPagina,
    numeroRegistros
  ) => {
    const url = `${urlPadrao}/turmas/${turmaCodigo}/componentes-curriculares/${componenteCurricularId}/inicio/${dataInicio}/fim/${dataFim}?numeroPagina=${
      numeroPagina || 1
    }&NumeroRegistros=${numeroRegistros}`;
    return api.get(url);
  };

  obterPlanejamentosPorDevolutiva = (
    idDevolutiva,
    anoLetivo,
    numeroPagina,
    numeroRegistros
  ) => {
    const url = `${urlPadrao}/devolutivas/${idDevolutiva}`;
    return api.get(url, {
      params: { anoLetivo, numeroRegistros, numeroPagina: numeroPagina || 1 },
    });
  };

  obterTitulosDiarioBordo = ({
    turmaId,
    componenteCurricularId,
    dataInicio,
    dataFim,
    numeroPagina,
    numeroRegistros,
  }) => {
    const dataBusca =
      dataInicio || dataFim
        ? `dataInicio=${dataInicio ?? ''}&dataFim=${dataFim ?? ''}&`
        : '';
    return api.get(
      `${urlPadrao}/titulos/turmas/${turmaId}/componentes-curriculares/${componenteCurricularId}?` +
        `${dataBusca}numeroPagina=${numeroPagina}&numeroRegistros=${numeroRegistros}`
    );
  };

  obterDiarioBordoPorData = ({
    turmaCodigo,
    componenteCurricularId,
    dataInicio,
    dataFim,
  }) => {
    return api.get(
      `${urlPadrao}/turmas/${turmaCodigo}/componentes-curriculares/${componenteCurricularId}` +
        `/inicio/${dataInicio}/fim/${dataFim}`
    );
  };

  obterDiarioBordoDetalhes = diarioBordoId => {
    return api.get(`${urlPadrao}/detalhes/${diarioBordoId}`);
  };

  obterNotificarUsuarios = ({ turmaId, observacaoId = '', diarioBordoId }) => {
    return api.get(`${urlPadrao}/notificacoes/usuarios`, {
      params: {
        turmaId,
        observacaoId,
        diarioBordoId,
      },
    });
  };

  obterDiarioBordoListao = (
    turmaCodigo,
    dataInicio,
    dataFim,
    componenteCurricularId
  ) => {
    return api.get(
      `${urlPadrao}/turmas/${turmaCodigo}/inicio/${dataInicio}/fim/${dataFim}` +
        `/componentes-curriculares/${componenteCurricularId}`
    );
  };

  salvarDiarioBordoListao = params => api.post(`${urlPadrao}/salvar`, params);
}

export default new ServicoDiarioBordo();
