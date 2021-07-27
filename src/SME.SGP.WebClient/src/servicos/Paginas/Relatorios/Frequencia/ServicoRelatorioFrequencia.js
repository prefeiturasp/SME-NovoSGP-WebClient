import api from '~/servicos/api';

class ServicoRelatorioFrequencia {
  gerar = dados => {
    return api.post(`v1/relatorios/faltas-frequencia`, dados);
  };
}

export default new ServicoRelatorioFrequencia();
