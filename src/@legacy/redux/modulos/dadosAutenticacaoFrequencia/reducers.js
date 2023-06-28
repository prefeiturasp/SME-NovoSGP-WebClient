import produce from 'immer';

const inicial = {
  dadosFiltroAutenticacao: {
    turma: {
      id: 0,
      codigo: '',
      anoLetivo: 0,
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
  },
};

export default function turmaFiltroAutenticacao(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@turmaFiltroAutenticacao/setDadosFiltroAutenticacao': {
        return {
          ...draft,
          dadosFiltroAutenticacao: action.payload,
        };
      }
      case '@turmaFiltroAutenticacao/setLimparTurmaFiltroAutenticacao': {
        return {
          ...inicial,
        };
      }
      default:
        return draft;
    }
  });
}
