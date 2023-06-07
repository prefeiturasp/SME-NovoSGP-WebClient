import api from '~/servicos/api';

const URL_PADRAO = '/v1/historico-escolar';
class ServicoHistoricoEscolar {
  gerar = async params => api.post(`${URL_PADRAO}/gerar`, params);

  obterObservacaoComplementar = codigoAluno =>
    api.get(`${URL_PADRAO}/aluno/${codigoAluno}/observacao-complementar`);
}

export default new ServicoHistoricoEscolar();
