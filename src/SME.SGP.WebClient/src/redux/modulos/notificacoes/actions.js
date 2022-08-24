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

export function incrementarNaoLidas(payload) {
  return {
    type: '@notificacoes/incrementarNaoLidas',
    payload,
  };
}

export function decrementarNaoLidas(payload) {
  return {
    type: '@notificacoes/decrementarNaoLidas',
    payload,
  };
}

export function decrementarExcluida(payload) {
  return {
    type: '@notificacoes/decrementarExcluida',
    payload,
  };
}

export function setIniciarNotificacoesSemWebSocket(payload) {
  return {
    type: '@notificacoes/setIniciarNotificacoesSemWebSocket',
    payload,
  };
}
