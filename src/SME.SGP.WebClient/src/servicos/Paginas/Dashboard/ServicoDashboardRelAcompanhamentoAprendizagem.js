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
    // TODO
    // return this.montarConsultaPadraoGraficos({
    //   rota: 'TODO',
    //   anoLetivo,
    //   dreId,
    //   ueId,
    //   semestre,
    // });
    debugger

    return new Promise(resolve =>
      resolve({
        data: [
          {
            quantidade: 5748,
            descricao: 'Qtd. de crianças com relatório pedagógico registrado',
            turma: 'EI-5',
          },
          {
            quantidade: 1321,
            descricao: 'Qtd. de crianças com relatório pedagógico pendente',
            turma: 'EI-5',
          },
          {
            quantidade: 3741,
            descricao: 'Qtd. de crianças com relatório pedagógico registrado',
            turma: 'EI-6',
          },
          {
            quantidade: 1145,
            descricao: 'Qtd. de crianças com relatório pedagógico pendente',
            turma: 'EI-6',
          },
        ],
      })
    );
  };
}

export default new ServicoDashboardRelAcompanhamentoAprendizagem();
