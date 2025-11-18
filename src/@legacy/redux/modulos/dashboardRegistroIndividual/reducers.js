import produce from 'immer';

const inicial = {
  dadosDashboardRegistroIndividual: {
    consideraHistorico: false,
  },
};

export default function dashboardRegistroIndividual(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@dashboardRegistroIndividual/setDadosDashboardRegistroIndividual': {
        return {
          ...draft,
          dadosDashboardRegistroIndividual: action.payload,
        };
      }
      case '@dashboardRegistroIndividual/limparDadosDashboardRegistroIndividual': {
        return {
          ...draft,
          dadosDashboardRegistroIndividual: {
            consideraHistorico: false,
          },
        };
      }

      default:
        return draft;
    }
  });
}
