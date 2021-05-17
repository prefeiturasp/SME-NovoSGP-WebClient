import api from '~/servicos/api';

const urlPadrao = 'v1/dashboard/informacoes-escolares';

class ServicoDashboardInformacoesEscolares {
  montarConsultaPadraoGraficos = (
    rota,
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    anoEscolar
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
    if (anoEscolar) {
      url += `&ano=${anoEscolar}`;
    }

    return api.get(url);
  };

  obterQuantidadeTurmasPorAno = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    anoEscolar
  ) => {
    return this.montarConsultaPadraoGraficos(
      'turmas',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      anoEscolar
    );
  };

  obterQuantidadeMatriculasPorAno = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    anoEscolar
  ) => {
    return this.montarConsultaPadraoGraficos(
      'matriculas',
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      anoEscolar
    );
  };
}

export default new ServicoDashboardInformacoesEscolares();
