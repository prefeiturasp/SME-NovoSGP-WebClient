import api from '~/servicos/api';

class ServicoAcompanhamentoRegistros {
  gerar = params => {
    return api.post(
      'v1/relatorios/acompanhamento-registros-pedagogicos',
      params
    );
  };
}

export default new ServicoAcompanhamentoRegistros();
