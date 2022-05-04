import api from '~/servicos/api';

class ServicoRelatorioFrequencia {
  gerar = (dados, ehMensal = false) => {
    let url = 'v1/relatorios/faltas-frequencia';
    if (ehMensal) {
      url += '-mensal';
    }
    return api.post(url, dados);
  };
}

export default new ServicoRelatorioFrequencia();
