import produce from 'immer';

const inicial = {
  anoLetivo: 0,
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
  aluno: {},
};

export default function localizarEstudante(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@localizarEstudante/setAnoLetivo':
        draft.anoLetivo = action.payload;
        break;
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
        draft.aluno = action.payload;
        break;
      case '@localizarEstudante/limparDadosLocalizarEstudante':
        draft.anoLetivo = inicial.anoLetivo;
        draft.dre = inicial.dre;
        draft.ue = inicial.ue;
        draft.turma = inicial.turma;
        draft.aluno = inicial.aluno;
        break;
      default:
        break;
    }
  });
}
