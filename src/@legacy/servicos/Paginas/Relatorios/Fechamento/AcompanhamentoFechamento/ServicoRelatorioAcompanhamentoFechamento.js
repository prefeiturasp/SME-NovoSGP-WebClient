import api from '~/servicos/api';

const OPCAO_TODAS = { valor: '-99', desc: 'Todas' };

class ServicoRelatorioAcompanhamentoFechamento {
  gerar = params => {
    return api.post('v1/relatorios/acompanhamento-fechamento', params);
  };

  obterSituacaoFechamento = situacaoFechamentoCodigo => {
    const dados = Object.keys(situacaoFechamentoCodigo).map(item => ({
      valor: situacaoFechamentoCodigo[item].id,
      desc: situacaoFechamentoCodigo[item].descricao,
    }));
    dados.unshift(OPCAO_TODAS);
    return Promise.resolve({ data: dados });
  };

  obterSituacaoConselhoClasse = situacaoConselhoClasseCodigo => {
    const dados = Object.keys(situacaoConselhoClasseCodigo).map(item => ({
      valor: situacaoConselhoClasseCodigo[item].id,
      desc: situacaoConselhoClasseCodigo[item].descricao,
    }));
    dados.unshift(OPCAO_TODAS);
    return Promise.resolve({ data: dados });
  };
}

export default new ServicoRelatorioAcompanhamentoFechamento();
