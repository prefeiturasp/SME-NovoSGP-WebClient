import produce from 'immer';

const inicial = {
  dadosEncaminhamentoInstitucional: {
    Id: null,
    DreId: null,
    UeId: null,
    Situacao: null,
    Tipo: null,
  },

  dadosSecoesEncaminhamentoInstitucional: [],

  tabAtivaEncaminhamentoInstitucional: null,

  exibirLoaderEncaminhamentoInstitucional: false,
  desabilitarCamposEncaminhamentoInstitucional: false,

  carregarDadosEncaminhamentoInstitucional: false,

  dadosSituacaoEncaminhamentoInstitucional: null,
};

export default function encaminhamentoInstitucional(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
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

      case '@encaminhamentoInstitucional/setDadosSecoesEncaminhamentoInstitucional': {
        return {
          ...draft,
          dadosSecoesEncaminhamentoInstitucional: action.payload,
        };
      }

      case '@encaminhamentoInstitucional/setTabAtivaEncaminhamentoInstitucional': {
        return {
          ...draft,
          tabAtivaEncaminhamentoInstitucional: action.payload,
        };
      }

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

      case '@encaminhamentoInstitucional/setCarregarDadosEncaminhamentoInstitucional': {
        return {
          ...draft,
          carregarDadosEncaminhamentoInstitucional: action.payload,
        };
      }

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
