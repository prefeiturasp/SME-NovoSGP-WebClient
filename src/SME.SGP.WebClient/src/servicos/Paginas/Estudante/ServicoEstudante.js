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

  obterGrauParentesco = () => {
    const url = `${urlPadrao}/graus-parentesco`;
    return api.get(url);
  };

  obterInformacoesAlunoPorCodigo = codigoAluno => {
    const url = `${urlPadrao}/${codigoAluno}/informacoes`;
    return api.get(url);
  };

  obterLocalAtividadeAluno = (
    codigoAluno,
    anoLetivo,
    filtrarSituacaoMatricula = true,
    tipoTurma = false
  ) => {
    const queryString = `codigoAluno=${codigoAluno}&anoLetivo=${anoLetivo}&filtrarSituacaoMatricula=${filtrarSituacaoMatricula}&tipoTurma=${tipoTurma}`;
    const url = `${urlPadrao}/local-atividade?${queryString}}`;
    return api.get(url);
  };
}

export default new ServicoEstudante();
