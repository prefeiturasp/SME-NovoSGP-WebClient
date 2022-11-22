import produce from 'immer';

const inicial = {
  dadosEncaminhamentoNAAPA: null,
  dadosSecoesEncaminhamentoNAAPA: null,
  exibirLoaderEncaminhamentoNAAPA: false,
  listaSecoesEmEdicao: [],
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
      case '@encaminhamentoNAAPA/setListaSecoesEmEdicao': {
        return {
          ...draft,
          listaSecoesEmEdicao: action.payload,
        };
      }
      case '@encaminhamentoNAAPA/setLimparDadosEncaminhamentoNAAPA': {
        return {
          ...draft,
          dadosSecoesEncaminhamentoNAAPA: null,
          exibirLoaderEncaminhamentoNAAPA: false,
          listaSecoesEmEdicao: [],
        };
      }
      default:
        return draft;
    }
  });
}
