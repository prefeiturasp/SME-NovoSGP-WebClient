import api from '~/servicos/api';

const URL_PADRAO = 'v1/relatorios';
class ServicoRelatorioFrequencia {
  gerar = (dados, ehMensal = false) => {
    let url = `${URL_PADRAO}/faltas-frequencia`;
    if (ehMensal) {
      url += '-mensal';
    }
    return api.post(url, dados);
  };

  gerarControleFrequenciaMensal = params =>
    api.post(`${URL_PADRAO}/controle-frequencia-mensal`, params);
}

export default new ServicoRelatorioFrequencia();
