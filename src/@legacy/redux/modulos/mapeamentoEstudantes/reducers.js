import produce from 'immer';

const inicial = {
  exibirLoaderMapeamentoEstudantes: false,
  estudantesMapeamentoEstudantes: [],
  desabilitarCamposMapeamentoEstudantes: false,
  dadosAlunoObjectCard: {},
  bimestreSelecionado: '',
  dadosSecoesMapeamentoEstudantes: [],
  mapeamentoEstudanteId: undefined,
};

export default function mapeamentoEstudantes(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@mapeamentoEstudantes/setExibirLoaderMapeamentoEstudantes': {
        return {
          ...draft,
          exibirLoaderMapeamentoEstudantes: action.payload,
        };
      }
      case '@mapeamentoEstudantes/limparDadosMapeamentoEstudantes': {
        return {
          ...draft,
          dadosAlunoObjectCard: undefined,
          dadosSecoesMapeamentoEstudantes: undefined,
          mapeamentoEstudanteId: undefined,
        };
      }
      case '@mapeamentoEstudantes/setEstudantesMapeamentoEstudantes': {
        return {
          ...draft,
          estudantesMapeamentoEstudantes: action.payload,
        };
      }
      case '@mapeamentoEstudantes/setDesabilitarCamposMapeamentoEstudantes': {
        return {
          ...draft,
          desabilitarCamposMapeamentoEstudantes: action.payload,
        };
      }
      case '@mapeamentoEstudantes/setDadosAlunoObjectCard': {
        return {
          ...draft,
          dadosAlunoObjectCard: action.payload,
        };
      }
      case '@mapeamentoEstudantes/setBimestreSelecionado': {
        return {
          ...draft,
          bimestreSelecionado: action.payload,
        };
      }
      case '@mapeamentoEstudantes/setDadosSecoesMapeamentoEstudantes': {
        return {
          ...draft,
          dadosSecoesMapeamentoEstudantes: action.payload,
        };
      }
      case '@mapeamentoEstudantes/setMapeamentoEstudanteId': {
        return {
          ...draft,
          mapeamentoEstudanteId: action.payload,
        };
      }
      default:
        return draft;
    }
  });
}
