import produce from 'immer';

const inicial = {
  dreId: 0,
  codigoDre: 0,
  ueId: 0,
  codigoUe: 0,
  turmaId: 0,
  codigoTurma: 0,
};

export default function localizarEstudante(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@localizarEstudante/setDreId':
        draft.dreId = action.payload;
        break;
      case '@localizarEstudante/setCodigoDre':
        draft.codigoDre = action.payload;
        break;
      case '@localizarEstudante/setUeId':
        draft.ueId = action.payload;
        break;
      case '@localizarEstudante/setCodigoUe':
        draft.codigoUe = action.payload;
        break;
      case '@localizarEstudante/setTurmaId':
        draft.turmaId = action.payload;
        break;
      case '@localizarEstudante/setCodigoTurma':
        draft.codigoTurma = action.payload;
        break;
      default:
        break;
    }
  });
}
