import { store } from '~/redux';
import { setDadosObservacoesUsuario } from '~/redux/modulos/observacoesUsuario/actions';

class ServicoObservacoesUsuario {
  atualizarSalvarEditarDadosObservacao = (dados, dadosAposSalvar) => {
    const { dispatch } = store;
    const state = store.getState();

    const { observacoesUsuario } = state;
    const { dadosObservacoes, listaUsuariosNotificacao } = observacoesUsuario;

    const observacaoId = dados.id;

    if (observacaoId) {
      const item = dadosObservacoes.find(e => e.id === dados.id);
      const index = dadosObservacoes.indexOf(item);
      dados.auditoria = dadosAposSalvar;
      dadosObservacoes[index] = {
        ...dados,
      };

      dispatch(setDadosObservacoesUsuario([...dadosObservacoes]));
    } else {
      const dadosObs = dadosObservacoes;
      const usuariosNotificacao = listaUsuariosNotificacao?.length
        ? listaUsuariosNotificacao.map(usuario => usuario.nome).join(', ')
        : '';

      const params = {
        proprietario: true,
        observacao: dados.observacao,
        id: dadosAposSalvar.id,
        auditoria: dadosAposSalvar,
        usuariosNotificacao,
      };
      dadosObs.unshift(params);
      dispatch(setDadosObservacoesUsuario([...dadosObs]));
    }
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

  obterUsuarioPorObservacao = (dadosObservacoes, listagemDiario = false) => {
    const dadosAlterados = dadosObservacoes.map(observacao => {
      if (dadosObservacoes) {
        return {
          ...observacao,
          usuariosNotificacao: observacao?.nomeUsuariosNotificados,
          listagemDiario,
        };
      }
      return observacao;
    });
    return dadosAlterados;
  };
}

export default new ServicoObservacoesUsuario();
