import api from '~/servicos/api';

const AtribuicaoEsporadicaServico = {
  buscarDres() {
    return api.get('/v1/abrangencias/false/dres');
  },
  buscarUes(dreId) {
    return api.get(`/v1/abrangencias/false/dres/${dreId}/ues`);
  },
  salvarAtribuicaoEsporadica(atribuicaoEsporadica) {
    return api.post(`/v1/atribuicao/esporadica`, atribuicaoEsporadica);
  },
  buscarAtribuicaoEsporadica(id) {
    return api.get(`/v1/atribuicao/esporadica/${id}`);
  },
  deletarAtribuicaoEsporadica(id) {
    return api.delete(`/v1/atribuicao/esporadica/${id}`);
  },
  obterPeriodos(ueId, anoLetivo) {
    return api.get(
      `/v1/atribuicao/esporadica/periodos/ues/${ueId}/anos/${anoLetivo}`
    );
  },
};

export default AtribuicaoEsporadicaServico;
