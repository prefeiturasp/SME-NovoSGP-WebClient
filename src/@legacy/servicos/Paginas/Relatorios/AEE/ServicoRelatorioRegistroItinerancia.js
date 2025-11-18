import api from '~/servicos/api';

const urlPadrao = 'v1/relatorios';

class ServicoRelatorioRegistroItinerancia {
  gerar = params => api.post(`${urlPadrao}/listagem-itinerancias`, params);
}

export default new ServicoRelatorioRegistroItinerancia();
