const converterAcaoTecla = keyCode => {
  switch (keyCode) {
    case 38:
      return -1;
    case 40:
      return 1;
    case 48:
      return 0;
    case 96:
      return 0;
    default:
      return false;
  }
};

const acharItem = (dados, alunoEscolhido, numero, nomeItem) => {
  if (dados?.length) {
    return dados
      ?.map((valor, index, elementos) => {
        if (valor[nomeItem] === alunoEscolhido[nomeItem]) {
          return elementos[index + numero];
        }
        return '';
      })
      .filter(item => item && item[nomeItem]);
  }
  return '';
};

const esperarMiliSegundos = milisegundos => {
  return new Promise(resolve => setTimeout(resolve, milisegundos));
};

const tratarStringComponenteCurricularNome = item =>
  item
    ?.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]|[^a-zA-Zs]|\s/g, '');

const focusRegenciaElementoDiv = async elemento => {
  const [elementoDiv] = elemento;
  const [elementoInput] = elementoDiv?.getElementsByTagName?.('input');

  if (elementoInput?.focus) {
    elementoInput.focus();
    elementoInput.select();
    return true;
  }
  return false;
};

const validaFocusRegencia = async elemento => {
  await esperarMiliSegundos(600);
  // TODO PENDENTE LISTAO FECHAMENTO
  let fezFocus = false;

  if (elemento?.length) {
    fezFocus = await focusRegenciaElementoDiv(elemento);
  }

  if (fezFocus) return;

  if (elemento?.length) {
    await esperarMiliSegundos(600);
    await focusRegenciaElementoDiv(elemento);
  }
};

const moverCursor = async (
  itemEscolhido,
  indexElemento = 0,
  regencia = false
) => {
  const elemento = document.getElementsByName(itemEscolhido);
  const elementoCursor = elemento[indexElemento];
  if (regencia) {
    validaFocusRegencia(elemento);
  } else if (elementoCursor) {
    elementoCursor.focus();
    elementoCursor.select();
  }
};

export {
  converterAcaoTecla,
  acharItem,
  esperarMiliSegundos,
  tratarStringComponenteCurricularNome,
  moverCursor,
};
