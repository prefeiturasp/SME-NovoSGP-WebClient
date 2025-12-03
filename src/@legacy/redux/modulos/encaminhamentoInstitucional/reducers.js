// src/@legacy/redux/modulos/encaminhamentoInstitucional/reducers.js

import produce from 'immer';

// ========================================
// ESTADO INICIAL
// ========================================
const inicial = {
  // Dados principais do encaminhamento
  dadosEncaminhamentoInstitucional: {
    dreId: null,
    dreCodigo: null,
    dreNome: null,
    ueId: null,
    ueCodigo: null,
    ueNome: null,
    anoLetivo: null,
    situação: null,
    tipo: null,
    dataEntradaQueixa: null,
    motivoEncaminhamento: null,
    anexos:[],
    // Outros dados que você precisar
  },

  // Seções do questionário dinâmico (vêm do backend)
  dadosSecoesEncaminhamentoInstitucional: [],

  // Controle de qual tab está ativa
  tabAtivaEncaminhamentoInstitucional: null,

  // Controles de UI
  exibirLoaderEncaminhamentoInstitucional: false,
  desabilitarCamposEncaminhamentoInstitucional: false,

  // Controle para recarregar dados
  carregarDadosEncaminhamentoInstitucional: false,

  // Situação do encaminhamento (Rascunho, Em Atendimento, etc)
  dadosSituacaoEncaminhamentoInstitucional: null,
};

// ========================================
// REDUCER
// ========================================
export default function encaminhamentoInstitucional(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      // ========================================
      // DADOS BÁSICOS
      // ========================================
      case '@encaminhamentoInstitucional/setDadosEncaminhamentoInstitucional': {
        return {
          ...draft,
          dadosEncaminhamentoInstitucional: action.payload,
        };
      }

      case '@encaminhamentoInstitucional/setLimparDadosEncaminhamentoInstitucional': {
        return {
          ...draft,
          dadosEncaminhamentoInstitucional:
            inicial.dadosEncaminhamentoInstitucional,
          dadosSecoesEncaminhamentoInstitucional: [],
          tabAtivaEncaminhamentoInstitucional: null,
          dadosSituacaoEncaminhamentoInstitucional: null,
        };
      }

      // ========================================
      // SEÇÕES DO QUESTIONÁRIO
      // ========================================
      case '@encaminhamentoInstitucional/setDadosSecoesEncaminhamentoInstitucional': {
        return {
          ...draft,
          dadosSecoesEncaminhamentoInstitucional: action.payload,
        };
      }

      // ========================================
      // CONTROLE DE TABS
      // ========================================
      case '@encaminhamentoInstitucional/setTabAtivaEncaminhamentoInstitucional': {
        return {
          ...draft,
          tabAtivaEncaminhamentoInstitucional: action.payload,
        };
      }

      // ========================================
      // CONTROLES DE UI
      // ========================================
      case '@encaminhamentoInstitucional/setExibirLoaderEncaminhamentoInstitucional': {
        return {
          ...draft,
          exibirLoaderEncaminhamentoInstitucional: action.payload,
        };
      }

      case '@encaminhamentoInstitucional/setDesabilitarCamposEncaminhamentoInstitucional': {
        return {
          ...draft,
          desabilitarCamposEncaminhamentoInstitucional: action.payload,
        };
      }

      // ========================================
      // RECARREGAR DADOS
      // ========================================
      case '@encaminhamentoInstitucional/setCarregarDadosEncaminhamentoInstitucional': {
        return {
          ...draft,
          carregarDadosEncaminhamentoInstitucional: action.payload,
        };
      }

      // ========================================
      // SITUAÇÃO
      // ========================================
      case '@encaminhamentoInstitucional/setDadosSituacaoEncaminhamentoInstitucional': {
        return {
          ...draft,
          dadosSituacaoEncaminhamentoInstitucional: action.payload,
        };
      }

      default:
        return draft;
    }
  });
}
