import produce from 'immer';

const inicial = {
  telaEmEdicao: false,
  acaoTelaEmEdicao: null,
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
      case '@geral/setAcaoTelaEmEdicao': {
        return {
          ...draft,
          acaoTelaEmEdicao: action.payload,
        };
      }
      case '@geral/setLimparModoEdicaoGeral': {
        return {
          ...draft,
          ...inicial,
        };
      }
      default:
        return draft;
    }
  });
}
