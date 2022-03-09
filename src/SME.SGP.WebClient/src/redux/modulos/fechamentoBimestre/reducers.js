import produce from 'immer';

const inicial = {
  modoEdicaoFechamentoBimestre: { emEdicao: false },
};

export default function fechamentoBimestre(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@fechamentoBimestre/setModoEdicaoFechamentoBimestre':
        draft.modoEdicaoFechamentoBimestre = action.payload;
        break;
      default:
        break;
    }
  });
}
