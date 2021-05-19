import api from '~/servicos/api';

const urlPadrao = `/v1/fechamentos/acompanhamentos/turmas`;

class ServicoAcompanhamentoFechamento {
  obterTurmas = params => {
    // bimestre: ["1"]

    // turmaId: ["625915"]
    let url = `${urlPadrao}?anoLetivo=${params.anoLetivo}&dreId=${params.dreId}`;
    url = `${url}&ueId=${params.ueId}&modalidade=${params.modalidadeId}&semestre=${params.semestre}`;
    url = `${url}&numeroPagina=${params.numeroPagina}&numeroRegistros=10`;

    if (params.turmasId?.length) {
      url += `&turmasId=${params.turmasId.join('&turmasId=', params.turmasId)}`;
    }

    if (params.bimestres?.length) {
      url += `&bimestres=${params.bimestres.join(
        '&bimestres=',
        params.bimestres
      )}`;
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
