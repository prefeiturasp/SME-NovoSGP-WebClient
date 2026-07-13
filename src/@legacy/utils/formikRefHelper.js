export const obterContextoFormik = formRef => {
  if (!formRef) {
    return {};
  }

  if (typeof formRef.getFormikContext === 'function') {
    return formRef.getFormikContext() || {};
  }

  return formRef;
};

export const obterErrosFormik = formRef => {
  const contexto = obterContextoFormik(formRef);
  return contexto?.errors || {};
};

export const formularioEhValido = formRef => {
  const contexto = obterContextoFormik(formRef);
  const erros = obterErrosFormik(formRef);

  return Boolean(contexto?.isValid) || Object.keys(erros).length === 0;
};
