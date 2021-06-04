import api from '~/servicos/api';

const urlPadrao = `/v1/fechamentos/acompanhamentos/turmas`;

class ServicoAcompanhamentoFechamento {
  obterTurmas = params => {
    let url = `${urlPadrao}?anoLetivo=${params.anoLetivo}&dreId=${params.dreId}`;
    url = `${url}&ueId=${params.ueId}&modalidade=${params.modalidadeId}&semestre=${params.semestre}`;
    url = `${url}&situacaoFechamento=${params.situacaoFechamento}&situacaoConselhoClasse=${params.situacaoConselhoClasse}`;
    url = `${url}&bimestre=${params.bimestre}&numeroPagina=${params.numeroPagina}&numeroRegistros=10`;

    if (params.turmasId?.length) {
      url += `&turmasId=${params.turmasId.join('&turmasId=', params.turmasId)}`;
    }

    return api.get(url);
  };

  obterFechamentos = ({ turmaId, bimestre }) => {
    return api.get(`${urlPadrao}/${turmaId}/fechamentos/bimestres/${bimestre}`);
  };

  obterConselhoClasse = ({ turmaId, bimestre }) => {
    return api.get(
      `${urlPadrao}/${turmaId}/conselho-classe/bimestres/${bimestre}`
    );
  };

  obterListaAlunosPorTurma = (turmaId, bimestre) => {
    return api.get(
      `${urlPadrao}/${turmaId}/conselho-classe/bimestres/${bimestre}/alunos`
    );
  };

  obterDetalhamentoComponentesCurricularesAluno = (
    turmaId,
    bimestre,
    alunoCodigo
  ) => {
    return api.get(
      `${urlPadrao}/${turmaId}/conselho-classe/bimestres/${bimestre}/alunos/${alunoCodigo}/componentes-curriculares/detalhamento`
    );
  };

  obterComponentesCurricularesFechamento = (turmaId, bimestre) => {
    return api.get(
      `${urlPadrao}/${turmaId}/fechamento/bimestres/${bimestre}/componentes-curriculares`
    );
  };

  obterDetalhesPendencias = (turmaId, bimestre, componenteCurricularId) => {
    return api.get(
      `${urlPadrao}/${turmaId}/fechamento/bimestres/${bimestre}/componentes-curriculares/${componenteCurricularId}/pendencias`
    );
  };

  obterDetalhePendencia = (tipoPendencia, pendenciaId) => {
    switch (tipoPendencia) {
      case 5:
      case 6:
        return api.get(`${urlPadrao}/pendencias/${pendenciaId}/detalhamentos`);
      default:
        return api.get(
          `${urlPadrao}/pendencias/${pendenciaId}/aulas/detalhamentos`
        );
    }
  };
}

export default new ServicoAcompanhamentoFechamento();
