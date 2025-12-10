import produce from 'immer';

const inicial = {
  usuarioBloqueado: false,
  numeroFila: 0,
};

export default function usuarioFilaEspera(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@filaEspera/setUsuarioBloqueado':
        console.log('Reducer - setUsuarioBloqueado: ', action.payload);
        draft.usuarioBloqueado = true;
        draft.numeroFila = action.payload;
        break;
      case '@filaEspera/setUsuarioDesbloqueado':
        console.log('Reducer - setUsuarioDesbloqueado');
        draft.usuarioBloqueado = false;
        draft.numeroFila = 0;
        break;
      default:
        break;
    }
  });
}
