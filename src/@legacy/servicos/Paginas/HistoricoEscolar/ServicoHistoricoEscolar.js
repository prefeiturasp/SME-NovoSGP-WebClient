import api from '~/servicos/api';

const URL_PADRAO = '/v1/historico-escolar';
class ServicoHistoricoEscolar {
  gerar = async params => api.post(`${URL_PADRAO}/gerar`, params);

  obterObservacaoComplementar = codigoAluno =>
    api.get(`${URL_PADRAO}/aluno/${codigoAluno}/observacao-complementar`);

  salvarObservacaoComplementar = (codigoAluno, observacao) =>
    api.post(`${URL_PADRAO}/aluno/${codigoAluno}/observacao-complementar`, {
      observacao
    });
}

export default new ServicoHistoricoEscolar();
