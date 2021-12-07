import produce from 'immer';

const inicial = {
  telaEmEdicao: true,
  salvarAcaoListao: '',
};

export default function Loader(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@loader/setTelaEmEdicao': {
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
