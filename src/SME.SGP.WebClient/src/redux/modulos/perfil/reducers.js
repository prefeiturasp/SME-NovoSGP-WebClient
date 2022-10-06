import produce from 'immer';

const inicial = {
  perfilSelecionado: {},
  perfis: [],
  trocouPerfil: false,
};

export default function perfil(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@perfil/perfilSelecionado':
        draft.perfilSelecionado = action.payload;
        break;
      case '@perfil/perfis':
        draft.perfis = action.payload;
        break;
      case '@perfil/setTrocouPerfil':
        draft.trocouPerfil = action.payload;
        break;
      default:
        break;
    }
  });
}
