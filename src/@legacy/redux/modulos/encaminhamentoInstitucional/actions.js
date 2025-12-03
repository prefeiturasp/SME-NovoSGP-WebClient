// ========================================
// AÇÕES PARA DADOS BÁSICOS DO ENCAMINHAMENTO
// ========================================

export const setDadosEncaminhamentoInstitucional = payload => ({
  type: '@encaminhamentoInstitucional/setDadosEncaminhamentoInstitucional',
  payload,
});

export const setLimparDadosEncaminhamentoInstitucional = () => ({
  type: '@encaminhamentoInstitucional/setLimparDadosEncaminhamentoInstitucional',
});

// ========================================
// AÇÕES PARA SEÇÕES DO QUESTIONÁRIO DINÂMICO
// ========================================

export const setDadosSecoesEncaminhamentoInstitucional = payload => ({
  type: '@encaminhamentoInstitucional/setDadosSecoesEncaminhamentoInstitucional',
  payload,
});

// ========================================
// AÇÕES PARA CONTROLE DE TABS
// ========================================

export const setTabAtivaEncaminhamentoInstitucional = payload => ({
  type: '@encaminhamentoInstitucional/setTabAtivaEncaminhamentoInstitucional',
  payload,
});

// ========================================
// AÇÕES PARA CONTROLE DE UI (LOADER, DESABILITAR CAMPOS)
// ========================================

export const setExibirLoaderEncaminhamentoInstitucional = payload => ({
  type: '@encaminhamentoInstitucional/setExibirLoaderEncaminhamentoInstitucional',
  payload,
});

export const setDesabilitarCamposEncaminhamentoInstitucional = payload => ({
  type: '@encaminhamentoInstitucional/setDesabilitarCamposEncaminhamentoInstitucional',
  payload,
});

// ========================================
// AÇÕES PARA RECARREGAR DADOS
// ========================================

export const setCarregarDadosEncaminhamentoInstitucional = payload => ({
  type: '@encaminhamentoInstitucional/setCarregarDadosEncaminhamentoInstitucional',
  payload,
});

// ========================================
// AÇÕES PARA SITUAÇÃO DO ENCAMINHAMENTO
// ========================================

export const setDadosSituacaoEncaminhamentoInstitucional = payload => ({
  type: '@encaminhamentoInstitucional/setDadosSituacaoEncaminhamentoInstitucional',
  payload,
});