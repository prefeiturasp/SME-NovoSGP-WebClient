import produce from 'immer';

const inicial = {
  dadosBuscaAtivaRegistroAcoes: null,
  dadosSecoesBuscaAtivaRegistroAcoes: null,
  exibirLoaderBuscaAtivaRegistroAcoes: false,
  desabilitarCamposBuscaAtivaRegistroAcoes: false,
};

export default function buscaAtivaRegistroAcoes(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@buscaAtivaRegistroAcoes/setDadosSecoesBuscaAtivaRegistroAcoes': {
        return {
          ...draft,
          dadosSecoesBuscaAtivaRegistroAcoes: action.payload,
        };
      }
      case '@buscaAtivaRegistroAcoes/setExibirLoaderBuscaAtivaRegistroAcoes': {
        return {
          ...draft,
          exibirLoaderBuscaAtivaRegistroAcoes: action.payload,
        };
      }
      case '@buscaAtivaRegistroAcoes/setLimparDadosBuscaAtivaRegistroAcoes': {
        return {
          ...draft,
          dadosBuscaAtivaRegistroAcoes: null,
          dadosSecoesBuscaAtivaRegistroAcoes: null,
          exibirLoaderBuscaAtivaRegistroAcoes: false,
        };
      }
      case '@buscaAtivaRegistroAcoes/setDesabilitarCamposBuscaAtivaRegistroAcoes': {
        return {
          ...draft,
          desabilitarCamposBuscaAtivaRegistroAcoes: action.payload,
        };
      }
      default:
        return draft;
    }
  });
}
