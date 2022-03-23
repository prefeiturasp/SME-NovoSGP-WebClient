import produce from 'immer';

const inicial = {
  exibirModalAnotacaoFrequencia: false,
  dadosModalAnotacaoFrequencia: {},
};

export default function modalAnotacaoFrequencia(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@modalAnotacaoFrequencia/setExibirModalAnotacaoFrequencia': {
        return {
          ...draft,
          exibirModalAnotacaoFrequencia: action.payload,
        };
      }
      case '@modalAnotacaoFrequencia/setDadosModalAnotacaoFrequencia': {
        return {
          ...draft,
          dadosModalAnotacaoFrequencia: action.payload,
        };
      }

      default:
        return draft;
    }
  });
}
