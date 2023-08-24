import api from '~/servicos/api';

class ServicoRelatorioOcorrencias {
  gerar = params => {
    return api.post('v1/relatorios/listagem-ocorrencias', params);
  };
}

export default new ServicoRelatorioOcorrencias();
