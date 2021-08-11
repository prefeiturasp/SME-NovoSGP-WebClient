import produce from 'immer';

const inicial = {
  modoEdicaoCadastroComunicados: false,
  formComunicados: null,
  exibirLoaderGeralComunicados: false,
};

export default function comunicados(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@comunicados/setLimparDadosComunicados': {
        return {
          ...draft,
          ...inicial,
        };
      }
      case '@comunicados/setFormComunicados': {
        return {
          ...draft,
          formComunicados: action.payload,
        };
      }
      case '@comunicados/setModoEdicaoCadastroComunicados': {
        return {
          ...draft,
          modoEdicaoCadastroComunicados: action.payload,
        };
      }
      case '@comunicados/setExibirLoaderGeralComunicados': {
        return {
          ...draft,
          exibirLoaderGeralComunicados: action.payload,
        };
      }
      default:
        return draft;
    }
  });
}
