import produce from 'immer';

const inicial = {
  planoAEEDados: {},
  desabilitarCamposPlanoAEE: false,
  planoAEEEmEdicao: false,
  exibirLoaderPlanoAEE: false,
  planoAEESituacaoEncaminhamentoAEE: {},
  planoAEEDadosSecoesPorEtapa: [],
  exibirModalErrosPlano: false,
  reestruturacaoDados: [],
  atualizarDados: false,
  dadosParecer: {},
  parecerCoordenacao: '',
  parecerPAAI: '',
  parecerEmEdicao: false,
  dadosAtribuicaoResponsavel: {},
  exibirCollapseVersao: null,
  dadosModalReestruturacao: {},
  exibirModalDevolverPlanoAEE: false,
  typePlanoAEECadastro: false,
};

export default function PlanoAEE(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@planoAEE/setExibirModalErrosPlano': {
        return {
          ...draft,
          exibirModalErrosPlano: action.payload,
        };
      }

      case '@planoAEE/setExibirLoaderPlanoAEE': {
        return {
          ...draft,
          exibirLoaderPlanoAEE: action.payload,
        };
      }
      case '@planoAEE/setTypePlanoAEECadastro':
        draft.typePlanoAEECadastro = action.payload;
        return draft;
      case '@planoAEE/setPlanoAEEDados': {
        return {
          ...draft,
          planoAEEDados: action.payload,
        };
      }
      case '@planoAEE/setPlanoAEESituacaoEncaminhamentoAEE': {
        return {
          ...draft,
          planoAEESituacaoEncaminhamentoAEE: action.payload,
        };
      }
      case '@planoAEE/setDesabilitarCamposPlanoAEE': {
        return {
          ...draft,
          desabilitarCamposPlanoAEE: action.payload,
        };
      }
      case '@planoAEE/setPlanoAEEEmEdicao': {
        return {
          ...draft,
          planoAEEEmEdicao: action.payload,
        };
      }
      case '@planoAEE/setPlanoAEEDadosSecoesPorEtapa': {
        return {
          ...draft,
          planoAEEDadosSecoesPorEtapa: action.payload,
        };
      }
      case '@planoAEE/setPlanoAEELimparDados': {
        return {
          ...draft,
          planoAEESituacaoEncaminhamentoAEE: {},
          planoAEEDados: null,
          exibirLoaderPlanoAEE: false,
          planoAEEDadosSecoesPorEtapa: [],
          exibirModalErrosPlano: false,
          exibirCollapseVersao: null,
        };
      }
      case '@planoAEE/setReestruturacaoDados': {
        return {
          ...draft,
          reestruturacaoDados: action.payload,
        };
      }
      case '@planoAEE/setAlteracaoDados': {
        let dadosParaSalvar = draft.reestruturacaoDados.map(item => {
          if (item.id === action.payload?.id) {
            return {
              ...item,
              ...action.payload,
              data: item.data,
            };
          }
          return item;
        });

        if (action.payload.adicionando) {
          dadosParaSalvar = [...draft.reestruturacaoDados, action.payload];
        }
        return {
          ...draft,
          reestruturacaoDados: dadosParaSalvar,
        };
      }
      case '@planoAEE/setAtualizarPlanoAEEDados': {
        return {
          ...draft,
          planoAEEDados: {
            ...draft.planoAEEDados,
            ...action.payload,
          },
        };
      }
      case '@planoAEE/setDadosParecer': {
        return {
          ...draft,
          dadosParecer: action.payload,
        };
      }
      case '@planoAEE/setParecerCoordenacao': {
        return {
          ...draft,
          parecerCoordenacao: action.payload,
        };
      }
      case '@planoAEE/setAtualizarDados': {
        return {
          ...draft,
          atualizarDados: action.payload,
        };
      }
      case '@planoAEE/setParecerPAAI': {
        return {
          ...draft,
          parecerPAAI: action.payload,
        };
      }
      case '@planoAEE/setParecerEmEdicao': {
        return {
          ...draft,
          parecerEmEdicao: action.payload,
        };
      }
      case '@planoAEE/limparDadosParecer': {
        return {
          ...draft,
          parecerCoordenacao: '',
          parecerPAAI: '',
          dadosAtribuicaoResponsavel: {},
        };
      }
      case '@planoAEE/setDadosAtribuicaoResponsavel': {
        return {
          ...draft,
          dadosAtribuicaoResponsavel: action.payload,
        };
      }

      case '@planoAEE/setExibirCollapseVersao': {
        return {
          ...draft,
          exibirCollapseVersao: action.payload,
        };
      }

      case '@planoAEE/setDadosModalReestruturacao': {
        return {
          ...draft,
          dadosModalReestruturacao: action.payload,
        };
      }

      case '@planoAEE/setExibirModalDevolverPlanoAEE': {
        return {
          ...draft,
          exibirModalDevolverPlanoAEE: action.payload,
        };
      }
      default:
        return draft;
    }
  });
}
