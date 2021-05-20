import api from '~/servicos/api';

const urlPadrao = 'v1/dashboard/informacoes-escolares';

class ServicoDashboardInformacoesEscolares {
  montarConsultaPadraoGraficos = (
    rota,
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    anosEscolares
  ) => {
    let url = `${urlPadrao}/${rota}?anoLetivo=${anoLetivo}`;
    if (dreId) {
      url += `&dreId=${dreId}`;
    }
    if (ueId) {
      url += `&ueId=${ueId}`;
    }
    if (modalidade) {
      url += `&modalidade=${modalidade}`;
    }
    if (anosEscolares?.length) {
      url += `&anos=${anosEscolares.join('&anos=', anosEscolares)}`;
    }

    return api.get(url);
  };

  obterQuantidadeTurmasPorAno = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    anosEscolares
  ) => {
    return this.montarConsultaPadraoGraficos(
      'turmas',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      anosEscolares
    );
  };

  obterQuantidadeMatriculasPorAno = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    anosEscolares
  ) => {
    return this.montarConsultaPadraoGraficos(
      'matriculas',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      anosEscolares
    );
  };

  obterUltimaConsolidacao = anoLetivo => {
    return api.get(`${urlPadrao}/consolidacao?anoLetivo=${anoLetivo}`);
  };
}

export default new ServicoDashboardInformacoesEscolares();
