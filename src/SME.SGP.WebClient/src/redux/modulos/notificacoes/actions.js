export function notificacoesLista(lista) {
  return {
    type: '@notificacoes/notificacoesLista',
    payload: lista,
  };
}

export function naoLidas(quantidade) {
  return {
    type: '@notificacoes/naoLidas',
    payload: quantidade,
  };
}

export function webSocketNotificacaoCriada(payload) {
  return {
    type: '@notificacoes/webSocketNotificacaoCriada',
    payload,
  };
}

export function webSocketNotificacaoLida(payload) {
  return {
    type: '@notificacoes/webSocketNotificacaoLida',
    payload,
  };
}

export function webSocketNotificacaoExcluida(payload) {
  return {
    type: '@notificacoes/webSocketNotificacaoExcluida',
    payload,
  };
}

export function setIniciarNotificacoesSemWebSocket(payload) {
  return {
    type: '@notificacoes/setIniciarNotificacoesSemWebSocket',
    payload,
  };
}
