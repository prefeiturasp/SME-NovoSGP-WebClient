import produce from 'immer';

const inicial = {
  dadosEncaminhamentoNAAPA: null,
  dadosSecoesEncaminhamentoNAAPA: null,
  exibirLoaderEncaminhamentoNAAPA: false,
  exibirLoaderDrawerAtendimento: false,
  desabilitarCamposEncaminhamentoNAAPA: false,
  tabAtivaEncaminhamentoNAAPA: 0,
  dadosSituacaoEncaminhamentoNAAPA: null,
  exibirModalEncerramentoEncaminhamentoNAAPA: false,
  carregarDadosEncaminhamentoNAAPA: false,
};

export default function EncaminhamentoNAAPA(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@encaminhamentoNAAPA/setDadosEncaminhamentoNAAPA': {
        return {
          ...draft,
          dadosEncaminhamentoNAAPA: action.payload,
        };
      }
      case '@encaminhamentoNAAPA/setDadosSecoesEncaminhamentoNAAPA': {
        return {
          ...draft,
          dadosSecoesEncaminhamentoNAAPA: action.payload,
        };
      }
      case '@encaminhamentoNAAPA/setExibirLoaderEncaminhamentoNAAPA': {
        return {
          ...draft,
          exibirLoaderEncaminhamentoNAAPA: action.payload,
        };
      }
      case '@encaminhamentoNAAPA/setExibirLoaderDrawerAtendimento': {
        return {
          ...draft,
          exibirLoaderDrawerAtendimento: action.payload,
        };
      }
      case '@encaminhamentoNAAPA/setLimparDadosEncaminhamentoNAAPA': {
        return {
          ...draft,
          dadosEncaminhamentoNAAPA: null,
          dadosSecoesEncaminhamentoNAAPA: null,
          exibirLoaderEncaminhamentoNAAPA: false,
          dadosSituacaoEncaminhamentoNAAPA: null,
          exibirModalEncerramentoEncaminhamentoNAAPA: false,
        };
      }
      case '@encaminhamentoNAAPA/setDesabilitarCamposEncaminhamentoNAAPA': {
        return {
          ...draft,
          desabilitarCamposEncaminhamentoNAAPA: action.payload,
        };
      }
      case '@encaminhamentoNAAPA/setTabAtivaEncaminhamentoNAAPA': {
        return {
          ...draft,
          tabAtivaEncaminhamentoNAAPA: action.payload,
        };
      }
      case '@encaminhamentoNAAPA/setDadosSituacaoEncaminhamentoNAAPA': {
        return {
          ...draft,
          dadosSituacaoEncaminhamentoNAAPA: action.payload,
        };
      }
      case '@encaminhamentoNAAPA/setExibirModalEncerramentoEncaminhamentoNAAPA': {
        return {
          ...draft,
          exibirModalEncerramentoEncaminhamentoNAAPA: action.payload,
        };
      }
      case '@encaminhamentoNAAPA/setCarregarDadosEncaminhamentoNAAPA': {
        return {
          ...draft,
          carregarDadosEncaminhamentoNAAPA: action.payload,
        };
      }
      default:
        return draft;
    }
  });
}
