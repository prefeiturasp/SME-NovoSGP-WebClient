import api from '~/servicos/api';

const urlPadrao = 'v1/estudante';

class ServicoEstudante {
  obterDadosEstudante = (codigoAluno, anoLetivo, codigoTurma) => {
    const url = `${urlPadrao}/${codigoAluno}/anosLetivos/${anoLetivo}?codigoTurma=${codigoTurma}`;
    return api.get(url);
  };

  obterInformacoesEscolaresDoAluno = (codigoAluno, codigoTurma) => {
    const url = `${urlPadrao}/informacoes-escolares?codigoAluno=${codigoAluno}&codigoTurma=${codigoTurma}`;
    return api.get(url);
  };
}

export default new ServicoEstudante();
