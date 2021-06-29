import api from '~/servicos/api';

const urlPadrao = 'v1/dashboard/acompanhamento-aprendizagem';

class ServicoDashboardRelAcompanhamentoAprendizagem {
  montarConsultaPadraoGraficos = params => {
    const { rota, anoLetivo, dreId, ueId, semestre } = params;

    let url = `${urlPadrao}/${rota}?anoLetivo=${anoLetivo}`;

    if (dreId) {
      url += `&dreId=${dreId}`;
    }
    if (ueId) {
      url += `&ueId=${ueId}`;
    }
    if (semestre) {
      url += `&semestre=${semestre}`;
    }
    return api.get(url);
  };

  obterTotalCriancasComAcompanhamentoAprendizagem = (
    anoLetivo,
    dreId,
    ueId,
    semestre
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'acompanhamento-aluno',
      anoLetivo,
      dreId,
      ueId,
      semestre,
    });
  };

  obterUltimaConsolidacao = anoLetivo => {
    return api.get(`${urlPadrao}/ultima-consolidacao?anoLetivo=${anoLetivo}`);
  };
}

export default new ServicoDashboardRelAcompanhamentoAprendizagem();
