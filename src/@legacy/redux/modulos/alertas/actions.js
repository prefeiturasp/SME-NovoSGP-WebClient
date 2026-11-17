export function exibir(alerta) {
  return {
    type: '@alertas/exibir',
    payload: alerta,
  };
}

export function removerAlerta(id) {
  return {
    type: '@alertas/remover',
    payload: { id },
  };
}

export function alertaConfirmar(
  titulo,
  texto,
  textoNegrito,
  resolve,
  textoOk,
  textoCancelar,
  primeiroExibirTextoNegrito,
  inverterBotoes
) {
  return {
    type: '@alertas/confirmar',
    payload: {
      titulo,
      texto,
      textoNegrito,
      resolve,
      textoOk,
      textoCancelar,
      primeiroExibirTextoNegrito,
      inverterBotoes,
    },
  };
}

export function alertaFechar() {
  return {
    type: '@alertas/fecharConfirmacao',
  };
}
