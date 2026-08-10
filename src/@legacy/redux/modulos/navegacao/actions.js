export function menuRetraido(retraido) {
  return {
    type: '@navegacao/retraido',
    payload: retraido,
  };
}

export function menuSelecionado(chave) {
  return {
    type: '@navegacao/menuSelecionado',
    payload: chave,
  };
}

export function rotaAtiva(rota) {
  return {
    type: '@navegacao/rotaAtiva',
    payload: rota,
  };
}

export function setRotas(rotas) {
  return {
    type: '@navegacao/rotas',
    payload: rotas,
  };
}

export function setSomenteConsulta(somenteConsulta) {
  return {
    type: '@navegacao/somenteConsulta',
    payload: somenteConsulta,
  };
}

export function setMensagemSomenteConsulta(mensagem) {
  return {
    type: '@navegacao/mensagemSomenteConsulta',
    payload: mensagem,
  };
}

export function setMenuOculto(oculto) {
  return {
    type: '@navegacao/menuOculto',
    payload: oculto,
  };
}
