import produce from 'immer';

const inicial = {
  dadosDashboardDiarioBordo: {
    consideraHistorico: false,
  },
};

export default function dashboardDiarioBordo(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@dashboardDiarioBordo/setDadosDashboardDiarioBordo': {
        return {
          ...draft,
          dadosDashboardDiarioBordo: action.payload,
        };
      }
      case '@dashboardDiarioBordo/limparDadosDashboardDiarioBordo': {
        return {
          ...draft,
          dadosDashboardDiarioBordo: {
            consideraHistorico: false,
          },
        };
      }

      default:
        return draft;
    }
  });
}
