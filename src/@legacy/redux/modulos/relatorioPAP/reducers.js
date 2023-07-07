import produce from 'immer';

const inicial = {
  dadosSecoesRelatorioPAP: null,
  exibirLoaderRelatorioPAP: false,
  estudantesRelatorioPAP: [],
  listaPeriodosPAP: [],
  desabilitarCamposRelatorioPAP: false,
  periodoSelecionadoPAP: undefined,
  estudanteSelecionadoRelatorioPAP: undefined,
};

export default function RelatorioPAP(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@relatorioPAP/setDadosSecoesRelatorioPAP': {
        return {
          ...draft,
          dadosSecoesRelatorioPAP: action.payload,
        };
      }
      case '@relatorioPAP/setExibirLoaderRelatorioPAP': {
        return {
          ...draft,
          exibirLoaderRelatorioPAP: action.payload,
        };
      }
      case '@relatorioPAP/setLimparDadosRelatorioPAP': {
        return {
          ...draft,
          dadosSecoesRelatorioPAP: null,
          exibirLoaderRelatorioPAP: false,
          desabilitarCamposRelatorioPAP: false,
          estudanteSelecionadoRelatorioPAP: undefined,
        };
      }
      case '@relatorioPAP/setEstudantesRelatorioPAP': {
        return {
          ...draft,
          estudantesRelatorioPAP: action.payload,
        };
      }
      case '@relatorioPAP/setListaPeriodosPAP': {
        return {
          ...draft,
          listaPeriodosPAP: action.payload,
        };
      }
      case '@relatorioPAP/setDesabilitarCamposRelatorioPAP': {
        return {
          ...draft,
          desabilitarCamposRelatorioPAP: action.payload,
        };
      }
      case '@relatorioPAP/setPeriodoSelecionadoPAP': {
        return {
          ...draft,
          periodoSelecionadoPAP: action.payload,
        };
      }
      case '@relatorioPAP/setEstudanteSelecionadoRelatorioPAP': {
        return {
          ...draft,
          estudanteSelecionadoRelatorioPAP: action.payload,
        };
      }
      default:
        return draft;
    }
  });
}
