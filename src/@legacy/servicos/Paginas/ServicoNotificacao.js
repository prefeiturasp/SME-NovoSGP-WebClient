import { erros, erro, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';
import {
  naoLidas,
  notificacoesLista,
} from '~/redux/modulos/notificacoes/actions';
import { store } from '@/core/redux';

class ServicoNotificacao {
  excluirNot = notificacoesId => {
    return api.delete('v1/notificacoes/', {
      data: notificacoesId,
    });
  };

  excluir = async (notificacoesId, callback) => {
    api
      .delete('v1/notificacoes/', {
        data: notificacoesId,
      })
      .then(resposta => {
        if (resposta.data) {
          resposta.data.forEach(resultado => {
            if (resultado.sucesso) {
              sucesso(resultado.mensagem);
            } else {
              erro(resultado.mensagem);
            }
          });
        }
        if (callback) callback();
      })
      .catch(listaErros => erros(listaErros));
  };

  marcarComoLidaNot = idsNotificacoes => {
    return api.put('v1/notificacoes/status/lida', idsNotificacoes);
  };

  marcarComoLida = (idsNotificacoes, callback) => {
    api
      .put('v1/notificacoes/status/lida', idsNotificacoes)
      .then(resposta => {
        if (resposta.data) {
          resposta.data.forEach(resultado => {
            if (resultado.sucesso) {
              sucesso(resultado.mensagem);
            } else {
              erro(resultado.mensagem);
            }
          });
        }
        if (callback) callback();
      })
      .catch(listaErros => erros(listaErros));
  };

  enviarAprovacaoNot = (idNotificacao, parametros) => {
    return api.put(
      `v1/workflows/aprovacoes/notificacoes/${idNotificacao}/aprova`,
      parametros
    );
  };

  buscaNotificacoesPorAnoRf = async (ano, rf) => {
    await api
      .get(`v1/notificacoes/resumo?anoLetivo=${ano}&usuarioRf=${rf}`)
      .then(res => {
        if (res.data) {
          store.dispatch(naoLidas(res.data.quantidadeNaoLidas));
          store.dispatch(notificacoesLista(res.data.notificacoes));
        }
      });
  };

  buscaNotificacoesNaoLidas = async (ano, rf) => {
    await api
      .get(`v1/notificacoes/resumo?anoLetivo=${ano}&usuarioRf=${rf}`)
      .then(res => {
        if (res.data) {
          // store.dispatch(naoLidas(res.data.quantidadeNaoLidas));
          store.dispatch(notificacoesLista(res.data.notificacoes));
        }
      });
  };

  obterQuantidadeNotificacoesNaoLidas = async () => {
    await api.get(`v1/notificacoes/nao-lidas/quantidade`).then(res => {
      if (res.data) {
        store.dispatch(naoLidas(res.data));
      } else {
        store.dispatch(naoLidas(0));
      }
    });
  };

  obterUltimasNotificacoesNaoLidas = async () => {
    await api.get(`v1/notificacoes/nao-lidas`).then(res => {
      if (res.data) {
        store.dispatch(notificacoesLista(res.data));
      }
    });
  };

  validarBuscaNotificacoesPorAnoRf = (ano, rf) => {
    const state = store.getState();
    const { notificacoes } = state;
    const { iniciarNotificacoesSemWebSocket } = notificacoes;
    if (iniciarNotificacoesSemWebSocket) {
      this.buscaNotificacoesPorAnoRf(ano, rf);
    }
  };
}

export default new ServicoNotificacao();
