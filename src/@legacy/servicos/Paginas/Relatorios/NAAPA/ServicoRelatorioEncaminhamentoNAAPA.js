import api from '~/servicos/api';

const urlPadrao = 'v1/relatorios';

class ServicoRelatorioEncaminhamentoNAAPA {
  gerar = params => api.post(`${urlPadrao}/encaminhamento-naapa`, params);
}

export default new ServicoRelatorioEncaminhamentoNAAPA();
