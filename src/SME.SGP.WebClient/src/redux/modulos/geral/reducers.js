import produce from 'immer';

const inicial = {
  telaEmEdicao: true,
};

export default function Geral(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@geral/setTelaEmEdicao': {
        return {
          ...draft,
          telaEmEdicao: action.payload,
        };
      }
      default:
        return draft;
    }
  });
}
