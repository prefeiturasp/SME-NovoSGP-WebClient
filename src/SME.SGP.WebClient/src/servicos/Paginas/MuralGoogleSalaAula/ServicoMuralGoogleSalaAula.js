import api from '~/servicos/api';

const urlPadrao = '/v1/mural/avisos';

class ServicoMuralGoogleSalaAula {
  obterDadosMuralGoogleSalaAula = aulaId => {
    return api.get(`${urlPadrao}?aulaId=${aulaId}`);
  };

  editarMensagem = (avisoId, mensagem) => {
    return api.put(`${urlPadrao}/${avisoId}`, { mensagem });
  };
}

export default new ServicoMuralGoogleSalaAula();
