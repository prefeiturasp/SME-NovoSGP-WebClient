import api from '~/servicos/api';

const urlPadrao = '/v1/mural/avisos';

class ServicoMuralGoogleSalaAula {
  obterDadosMuralGoogleSalaAula = aulaId => {
    return api.get(`${urlPadrao}?aulaId=${aulaId}`);
  };
}

export default new ServicoMuralGoogleSalaAula();
