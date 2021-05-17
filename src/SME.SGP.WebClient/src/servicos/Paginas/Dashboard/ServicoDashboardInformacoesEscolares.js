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
    // TODO MOCK!
    // return this.montarConsultaPadraoGraficos(
    //   'turmas/anos',
    //   anoLetivo,
    //   dreId,
    //   ueId,
    //   modalidade,
    //   anoEscolar
    // );

    return new Promise(resolve => {
      const mock = [
        {
          quantidade: 81,
          descricao: 'BT',
        },
        {
          quantidade: 106,
          descricao: 'CL',
        },
        {
          quantidade: 121,
          descricao: 'CS',
        },
        {
          quantidade: 107,
          descricao: 'FB',
        },
        {
          quantidade: 93,
          descricao: 'GA',
        },
        {
          quantidade: 62,
          descricao: 'IP',
        },
        {
          quantidade: 81,
          descricao: 'IT',
        },
        {
          quantidade: 106,
          descricao: 'JT',
        },
        {
          quantidade: 121,
          descricao: 'PE',
        },
        {
          quantidade: 107,
          descricao: 'PI',
        },
        {
          quantidade: 93,
          descricao: 'SA',
        },
        {
          quantidade: 62,
          descricao: 'SM',
        },
        {
          quantidade: 62,
          descricao: 'MP',
        },
      ];
      setTimeout(() => {
        resolve({ data: mock });
      }, 1000);
    });
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
