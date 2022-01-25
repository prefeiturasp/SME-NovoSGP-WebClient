import produce from 'immer';

const inicial = {
  dadosDashboardDevolutivas: {
    consideraHistorico: false,
    dataUltimaConsolidacao: null,
  },
};

export default function dashboardDevolutivas(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@dashboardDevolutivas/setDadosDashboardDevolutivas': {
        return {
          ...draft,
          dadosDashboardDevolutivas: action.payload,
        };
      }
      case '@dashboardDevolutivas/limparDadosDashboardDevolutivas': {
        return {
          ...draft,
          dadosDashboardDevolutivas: {
            consideraHistorico: false,
            dataUltimaConsolidacao: null,
          },
        };
      }

      default:
        return draft;
    }
  });
}
