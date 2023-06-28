import produce from 'immer';

const inicial = {
  dadosFiltroAutenticacaoFrequencia: {},
};

export default function turmaFiltroAutenticacaoFrequencia(
  state = inicial,
  action
) {
  return produce(state, draft => {
    switch (action.type) {
      case '@turmaFiltroAutenticacaoFrequencia/setDadosFiltroAutenticacaoFrequencia': {
        return {
          ...draft,
          dadosFiltroAutenticacaoFrequencia: action.payload,
        };
      }
      case '@turmaFiltroAutenticacaoFrequencia/setLimparTurmaFiltroAutenticacaoFrequencia': {
        return {
          ...inicial,
        };
      }
      default:
        return draft;
    }
  });
}
