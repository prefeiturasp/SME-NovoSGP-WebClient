import api from '~/servicos/api';

const urlPadrao = '/v1/mural/avisos';

class ServicoMuralGoogleSalaAula {
  obterDadosMuralGoogleSalaAula = async aulaId => {
    return api.get(`${urlPadrao}?aulaId=${aulaId}`);
  };
}

export default new ServicoMuralGoogleSalaAula();
