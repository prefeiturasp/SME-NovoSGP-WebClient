import produce from 'immer';
import notificacaoStatus from '~/dtos/notificacaoStatus';

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
      case '@notificacoes/decrementarNaoLidas': {
        const id = action.payload;
        const estaNaLista = draft.notificacoes?.find?.(n => n?.id === id);
        const naoLida = estaNaLista?.status === notificacaoStatus.Pendente;
        if (estaNaLista && naoLida) {
          const index = draft.notificacoes.findIndex(n => n.id === id);
          draft.notificacoes[index].status = notificacaoStatus.Lida;
        }
        if (draft.notificacoes.length > 0 && naoLida) draft.quantidade -= 1;
        break;
      }
      case '@notificacoes/incrementarNaoLidas': {
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
        }
        break;
      }
      default:
        break;
    }
  });
}
