import produce from 'immer';

const inicial = {
  alunosAcompanhamentoAprendizagem: [],
  dadosAlunoObjectCard: {},
  codigoAlunoSelecionado: null,
  exibirLoaderGeralAcompanhamentoAprendizagem: false,
  dadosAcompanhamentoAprendizagem: {},
  acompanhamentoAprendizagemEmEdicao: false,
  desabilitarCamposAcompanhamentoAprendizagem: false,
  dadosApanhadoGeral: {},
  apanhadoGeralEmEdicao: false,
  qtdMaxImagensCampoPercursoColetivo: null,
  qtdMaxImagensCampoPercursoIndividual: null,
  errosAcompanhamentoAprendizagem: [],
  exibirModalErrosAcompanhamentoAprendizagem: false,
  exibirLoaderAlunosAcompanhamentoAprendizagem: false,
  exibirLoaderAtualizandoUrlImagensRAA: false,
};

export default function AcompanhamentoAprendizagem(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@acompanhamentoAprendizagem/setAlunosAcompanhamentoAprendizagem': {
        return {
          ...draft,
          alunosAcompanhamentoAprendizagem: action.payload,
        };
      }
      case '@acompanhamentoAprendizagem/setDadosAlunoObjectCard': {
        return {
          ...draft,
          dadosAlunoObjectCard: action.payload,
        };
      }
      case '@acompanhamentoAprendizagem/setCodigoAlunoSelecionado': {
        return {
          ...draft,
          codigoAlunoSelecionado: action.payload,
        };
      }
      case '@acompanhamentoAprendizagem/limparDadosAcompanhamentoAprendizagem': {
        return {
          ...draft,
          dadosAlunoObjectCard: {},
          codigoAlunoSelecionado: null,
          exibirLoaderGeralAcompanhamentoAprendizagem: false,
          dadosAcompanhamentoAprendizagem: null,
          acompanhamentoAprendizagemEmEdicao: false,
          errosAcompanhamentoAprendizagem: [],
          exibirModalErrosAcompanhamentoAprendizagem: false,
        };
      }
      case '@acompanhamentoAprendizagem/setExibirLoaderGeralAcompanhamentoAprendizagem': {
        return {
          ...draft,
          exibirLoaderGeralAcompanhamentoAprendizagem: action.payload,
        };
      }
      case '@acompanhamentoAprendizagem/setDadosAcompanhamentoAprendizagem': {
        return {
          ...draft,
          dadosAcompanhamentoAprendizagem: action.payload,
        };
      }
      case '@acompanhamentoAprendizagem/setAcompanhamentoAprendizagemEmEdicao': {
        return {
          ...draft,
          acompanhamentoAprendizagemEmEdicao: action.payload,
        };
      }
      case '@acompanhamentoAprendizagem/setDesabilitarCamposAcompanhamentoAprendizagem': {
        return {
          ...draft,
          desabilitarCamposAcompanhamentoAprendizagem: action.payload,
        };
      }
      case '@acompanhamentoAprendizagem/setDadosApanhadoGeral': {
        return {
          ...draft,
          dadosApanhadoGeral: action.payload,
        };
      }
      case '@acompanhamentoAprendizagem/setApanhadoGeralEmEdicao': {
        return {
          ...draft,
          apanhadoGeralEmEdicao: action.payload,
        };
      }
      case '@acompanhamentoAprendizagem/setQtdMaxImagensCampoPercursoColetivo': {
        return {
          ...draft,
          qtdMaxImagensCampoPercursoColetivo: action.payload,
        };
      }
      case '@acompanhamentoAprendizagem/setQtdMaxImagensCampoPercursoIndividual': {
        return {
          ...draft,
          qtdMaxImagensCampoPercursoIndividual: action.payload,
        };
      }
      case '@acompanhamentoAprendizagem/setErrosAcompanhamentoAprendizagem': {
        return {
          ...draft,
          errosAcompanhamentoAprendizagem: action.payload,
        };
      }
      case '@acompanhamentoAprendizagem/setExibirModalErrosAcompanhamentoAprendizagem': {
        return {
          ...draft,
          exibirModalErrosAcompanhamentoAprendizagem: action.payload,
        };
      }
      case '@acompanhamentoAprendizagem/setExibirLoaderAlunosAcompanhamentoAprendizagem': {
        return {
          ...draft,
          exibirLoaderAlunosAcompanhamentoAprendizagem: action.payload,
        };
      }
      case '@acompanhamentoAprendizagem/setExibirLoaderAtualizandoUrlImagensRAA': {
        return {
          ...draft,
          exibirLoaderAtualizandoUrlImagensRAA: action.payload,
        };
      }

      default:
        return draft;
    }
  });
}
