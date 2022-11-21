import produce from 'immer';

const inicial = {
  dadosEncaminhamentoNAAPA: null,
  dadosSecoesEncaminhamentoNAAPA: null,
  exibirLoaderEncaminhamentoNAAPA: false,
};

export default function EncaminhamentoAEE(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@encaminhamentoAEE/setDadosEncaminhamentoNAAPA': {
        return {
          ...draft,
          dadosEncaminhamentoNAAPA: action.payload,
        };
      }
      case '@encaminhamentoAEE/setDadosSecoesEncaminhamentoNAAPA': {
        return {
          ...draft,
          dadosSecoesEncaminhamentoNAAPA: action.payload,
        };
      }
      case '@encaminhamentoAEE/setExibirLoaderEncaminhamentoNAAPA': {
        return {
          ...draft,
          exibirLoaderEncaminhamentoNAAPA: action.payload,
        };
      }
      case '@encaminhamentoAEE/setLimparDadosEncaminhamentoNAAPA': {
        return {
          ...draft,
          dadosSecoesEncaminhamentoNAAPA: null,
          exibirLoaderEncaminhamentoNAAPA: false,
        };
      }
      default:
        return draft;
    }
  });
}
