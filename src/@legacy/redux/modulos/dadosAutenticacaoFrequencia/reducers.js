import produce from 'immer';

const inicial = {
  turma: {
    id: 0,
    codigo: '',
    anoLetiv: 0,
    tipo: 0,
    modalidadeCodigo: 0,
    tipoTurno: 0,
    nome: '',
    ueNome: '',
    ueCodigo: '',
    ueId: 0,
    tipoEscola: 0,
    dreId: 0,
    dreCodigo: '',
    dreNome: '',
    dreAbreviacao: '',
    nomeTipoUeDre: '',
  },
  componenteCurricularCodigo: 0,
};

export default function turmaFiltroAutenticacao(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@autencicacaoFrequencia/setTurmaFiltroAutenticacao': {
        return {
          ...draft,
          turmaFiltroAutenticacao: action.payload,
        };
      }
      case '@autencicacaoFrequencia/setLimparTurmaFiltroAutenticacao': {
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
