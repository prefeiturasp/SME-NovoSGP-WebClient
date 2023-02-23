import produce from 'immer';

const inicial = {
  dadosDashboardFechamento: {
    consideraHistorico: false,
  },
};

export default function dashboardFechamento(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@dashboardFechamento/setDadosDashboardFechamento': {
        return {
          ...draft,
          dadosDashboardFechamento: action.payload,
        };
      }
      case '@dashboardFechamento/limparDadosDashboardFechamento': {
        return {
          ...draft,
          dadosDashboardFechamento: {
            consideraHistorico: false,
          },
        };
      }

      default:
        return draft;
    }
  });
}
