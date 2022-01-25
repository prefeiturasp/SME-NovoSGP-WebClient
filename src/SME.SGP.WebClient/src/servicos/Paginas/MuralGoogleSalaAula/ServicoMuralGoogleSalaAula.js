import api from '~/servicos/api';

const urlPadrao = '/v1/mural';

class ServicoMuralGoogleSalaAula {
  obterDadosMuralGoogleSalaAula = aulaId => {
    return api.get(`${urlPadrao}/avisos?aulaId=${aulaId}`);
  };

  editarMensagem = (avisoId, mensagem) => {
    return api.put(`${urlPadrao}/${avisoId}`, { mensagem });
  };

  obterDadosAtividadesGoogleSalaAula = aulaId => {
    return api.get(`${urlPadrao}/atividades/infantil?aulaId=${aulaId}`);
  };
}

export default new ServicoMuralGoogleSalaAula();
