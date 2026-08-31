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

export const obterValoresFormik = formRef => {
  if (!formRef) {
    return {};
  }

  const contexto = obterContextoFormik(formRef);

  if (contexto?.values !== undefined) {
    return contexto.values;
  }

  if (formRef?.values !== undefined) {
    return formRef.values;
  }

  if (formRef?.state?.values !== undefined) {
    return formRef.state.values;
  }

  return {};
};

export const validarFormik = async formRef => {
  if (!formRef) {
    return undefined;
  }

  if (typeof formRef.validateForm === 'function') {
    return formRef.validateForm();
  }

  const contexto = obterContextoFormik(formRef);
  if (typeof contexto?.validateForm === 'function') {
    return contexto.validateForm();
  }

  return undefined;
};

export const formularioEhValido = formRef => {
  const contexto = obterContextoFormik(formRef);
  const erros = obterErrosFormik(formRef);

  return Boolean(contexto?.isValid) || Object.keys(erros).length === 0;
};
