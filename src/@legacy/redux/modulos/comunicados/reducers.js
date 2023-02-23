import produce from 'immer';

const inicial = {
  modoEdicaoCadastroComunicados: false,
  formComunicados: null,
  exibirLoaderGeralComunicados: false,
  alunosComunicados: [],
  exibirModalAlunos: false,
  listaModalidadesComunicados: [],
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
      case '@comunicados/setAlunosComunicados': {
        return {
          ...draft,
          alunosComunicados: action.payload,
        };
      }
      case '@comunicados/setExibirModalAlunos': {
        return {
          ...draft,
          exibirModalAlunos: action.payload,
        };
      }
      case '@comunicados/setListaModalidadesComunicados': {
        return {
          ...draft,
          listaModalidadesComunicados: action.payload,
        };
      }
      default:
        return draft;
    }
  });
}
