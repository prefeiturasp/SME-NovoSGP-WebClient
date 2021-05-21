import api from '~/servicos/api';

const urlPadrao = `/v1/fechamentos/acompanhamentos/turmas`;

class ServicoAcompanhamentoFechamento {
  obterTurmas = params => {
    let url = `${urlPadrao}?anoLetivo=${params.anoLetivo}&dreId=${params.dreId}`;
    url = `${url}&ueId=${params.ueId}&modalidade=${params.modalidadeId}&semestre=${params.semestre}`;
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
}

export default new ServicoAcompanhamentoFechamento();
