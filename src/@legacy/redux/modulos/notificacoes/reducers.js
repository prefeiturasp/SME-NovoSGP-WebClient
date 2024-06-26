import produce from 'immer';
import notificacaoStatus from '~/dtos/notificacaoStatus';
import { ordenarNotificoesNavBar } from '~/utils/funcoes/gerais';

const inicial = {
  notificacoes: [],
  quantidade: 0,
  iniciarNotificacoesSemWebSocket: false,
};

export default function notificacoes(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@notificacoes/notificacoesLista': {
        draft.notificacoes = [];
        draft.notificacoes = action.payload;
        break;
      }
      case '@notificacoes/naoLidas': {
        draft.quantidade = action.payload;
        break;
      }
      case '@notificacoes/setIniciarNotificacoesSemWebSocket': {
        draft.iniciarNotificacoesSemWebSocket = action.payload;
        break;
      }
      case '@notificacoes/webSocketNotificacaoLida': {
        const { codigo, isAnoAnterior, obterListaNotificacoes } =
          action.payload;
        const estaNaLista = draft.notificacoes?.find?.(
          n => n?.codigo === codigo
        );
        const maisQueCincoNotificacoes = draft?.quantidade > 5;
        const naoLida = estaNaLista?.status === notificacaoStatus.Pendente;

        if (maisQueCincoNotificacoes && estaNaLista) {
          obterListaNotificacoes();
        } else if (estaNaLista && naoLida) {
          const index = draft.notificacoes.findIndex(n => n.codigo === codigo);
          draft.notificacoes[index].status = notificacaoStatus.Lida;
          draft.notificacoes = ordenarNotificoesNavBar(draft.notificacoes);
        }
        if (!isAnoAnterior) draft.quantidade -= 1;
        break;
      }
      case '@notificacoes/webSocketNotificacaoCriada': {
        const { codigo, data, titulo, id } = action.payload;
        const estaNaLista = draft.notificacoes?.find?.(n => n?.id === id);
        if (!estaNaLista) {
          if (draft.notificacoes?.length >= 5) {
            draft.notificacoes.pop();
          }
          draft.notificacoes.unshift({
            codigo,
            data,
            titulo,
            id,
            status: notificacaoStatus.Pendente,
          });
          draft.quantidade += 1;
          draft.notificacoes = ordenarNotificoesNavBar(draft.notificacoes);
        }
        break;
      }
      case '@notificacoes/webSocketNotificacaoExcluida': {
        const { codigo, status, isAnoAnterior, obterListaNotificacoes } =
          action.payload;
        const estaNaLista = draft.notificacoes?.find?.(
          n => n?.codigo === codigo
        );
        if (estaNaLista && obterListaNotificacoes) {
          obterListaNotificacoes();
        }
        if (status === notificacaoStatus.Pendente && !isAnoAnterior) {
          draft.quantidade -= 1;
        }
        break;
      }
      default:
        break;
    }
  });
}
