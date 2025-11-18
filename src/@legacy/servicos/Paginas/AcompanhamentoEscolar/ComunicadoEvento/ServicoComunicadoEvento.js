import api from '../../../api';

class ServicoComunicadoEvento {
  listarPor = async parametros => {
    return api.post('v1/comunicados/eventos', parametros);
  };
}

export default new ServicoComunicadoEvento();
