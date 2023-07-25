import produce from 'immer';

const inicial = {
  recarregarHistorico: false,
};

export default function HistoricoPaginado(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@historicoPaginado/setRecarregarHistorico': {
        return {
          ...draft,
          recarregarHistorico: action.payload,
        };
      }
      default:
        return draft;
    }
  });
}
