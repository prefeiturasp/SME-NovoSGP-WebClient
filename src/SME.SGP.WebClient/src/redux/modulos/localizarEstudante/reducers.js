import produce from 'immer';

const inicial = {
  dre: {
    id: 0,
    nome: '',
    codigo: '',
  },
  ue: {
    id: 0,
    nome: '',
    codigo: '',
  },
  turma: {
    id: 0,
    nome: '',
    codigo: '',
  },
  codigoAluno: 0,
};

export default function localizarEstudante(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@localizarEstudante/setDre':
        draft.dre = action.payload;
        break;
      case '@localizarEstudante/setUe':
        draft.ue = action.payload;
        break;
      case '@localizarEstudante/setTurma':
        draft.turma = action.payload;
        break;
      case '@localizarEstudante/setAluno':
        draft.codigoAluno = action.payload;
        break;
      case '@localizarEstudante/limparDados':
        draft.dre = inicial.dre;
        draft.ue = inicial.ue;
        draft.turma = inicial.turma;
        draft.codigoAluno = inicial.codigoAluno;
        break;
      default:
        break;
    }
  });
}
