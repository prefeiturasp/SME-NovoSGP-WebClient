import api from '~/servicos/api';

const urlPadrao = `v1/fechamentos/reaberturas`;

class ServicoFechamentoReabertura {
  salvar = parametros => {
    if (parametros?.id) {
      return api.put(`${urlPadrao}/${parametros?.id}`, parametros);
    }
    return api.post(urlPadrao, parametros);
  };

  obterPorId = id => api.get(`${urlPadrao}/${id}`);

  deletar = async ids => {
    const parametros = { data: ids };
    return api.delete(urlPadrao, parametros);
  };
}

export default new ServicoFechamentoReabertura();
