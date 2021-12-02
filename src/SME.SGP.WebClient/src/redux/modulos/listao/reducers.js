import produce from 'immer';

const inicial = {
  listaoEmEdicao: true,
  salvarAcaoListao: '',
};

export default function Loader(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@loader/setListaoEmEdicao': {
        return {
          ...draft,
          listaoEmEdicao: action.payload,
        };
      }
      case '@loader/setSalvarAcaoListao': {
        return {
          ...draft,
          salvarAcaoListao: action.payload,
        };
      }
      default:
        return draft;
    }
  });
}
