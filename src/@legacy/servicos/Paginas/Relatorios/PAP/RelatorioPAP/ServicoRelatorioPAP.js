import api from '~/servicos/api';

const URL_PADRAO = 'v1/relatorios/pap';

class ServicoRelatorioPAP {
  obterPeriodos = turmaCodigo => {
    return api.get(`${URL_PADRAO}/periodos/${turmaCodigo}`);
  };

  obterDadosSecoes = (turmaCodigo, alunoCodigo, periodoRelatorioPAPId) => {
    const url = `${URL_PADRAO}/turma/${turmaCodigo}/aluno/${alunoCodigo}/periodo/${periodoRelatorioPAPId}/secoes`;
    return api.get(url);
  };

  obterQuestionario = param => {
    const url = `${URL_PADRAO}/turma/${param.turmaCodigo}/aluno/${param.alunoCodigo}/periodo/${param.periodoRelatorioPAPId}/questionario/${param.questionarioId}`;
    return api.get(url);
  };
}

export default new ServicoRelatorioPAP();
