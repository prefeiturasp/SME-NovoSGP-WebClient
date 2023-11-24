import produce from 'immer';

const inicial = {
  dadosBuscaAtivaRegistroAcoes: null,
  dadosSecoesBuscaAtivaRegistroAcoes: null,
  exibirLoaderBuscaAtivaRegistroAcoes: false,
  exibirLoaderDrawerAtendimento: false,
  desabilitarCamposBuscaAtivaRegistroAcoes: false,
  tabAtivaBuscaAtivaRegistroAcoes: 0,
  dadosSituacaoBuscaAtivaRegistroAcoes: null,
  exibirModalEncerramentoBuscaAtivaRegistroAcoes: false,
  carregarDadosBuscaAtivaRegistroAcoes: false,
};

export default function buscaAtivaRegistroAcoes(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@buscaAtivaRegistroAcoes/setDadosBuscaAtivaRegistroAcoes': {
        return {
          ...draft,
          dadosBuscaAtivaRegistroAcoes: action.payload,
        };
      }
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
          dadosSituacaoBuscaAtivaRegistroAcoes: null,
          exibirModalEncerramentoBuscaAtivaRegistroAcoes: false,
        };
      }
      case '@buscaAtivaRegistroAcoes/setDesabilitarCamposBuscaAtivaRegistroAcoes': {
        return {
          ...draft,
          desabilitarCamposBuscaAtivaRegistroAcoes: action.payload,
        };
      }
      case '@buscaAtivaRegistroAcoes/setCarregarDadosBuscaAtivaRegistroAcoes': {
        return {
          ...draft,
          carregarDadosBuscaAtivaRegistroAcoes: action.payload,
        };
      }
      default:
        return draft;
    }
  });
}
