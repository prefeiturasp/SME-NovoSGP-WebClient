import api from '~/servicos/api';

const URL_PADRAO = '/v1/historico-escolar';
class ServicoHistoricoEscolar {
  gerar = async params => api.post(`${URL_PADRAO}/gerar`, params);

  obterObservacaoComplementar = codigoAluno =>
    api.get(`${URL_PADRAO}/observacao-complementar/${codigoAluno}`);

  salvarObservacaoComplementar = (codigoAluno, observacao) =>
    api.post(`${URL_PADRAO}/observacao-complementar`, {
      codigoAluno,
      observacao,
    });
}

export default new ServicoHistoricoEscolar();
