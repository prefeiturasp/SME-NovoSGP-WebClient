import api from '~/servicos/api';

const urlPadrao = 'v1/relatorios';

class ServicoRelatorioSondagem {
  gerarAnalitico = params =>
    api.post(`${urlPadrao}/sondagem/analitico`, params);

  obterTipoSondagem = params =>
    api.get(`${urlPadrao}/sondagem/analitico/tiposondagem`);
}

export default new ServicoRelatorioSondagem();
