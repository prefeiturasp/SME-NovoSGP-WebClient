import api from '~/servicos/api';

const urlPadrao = `v1/calendarios/eventos/tipos`;

class ServicoTipoEvento {
  salvar = async (id, evento) => {
    let url = urlPadrao;
    if (id) {
      url = `${url}/${id}`;
    }

    const metodo = id ? 'put' : 'post';
    return api[metodo](url, evento);
  };
}

export default new ServicoTipoEvento();
