import api from '~/servicos/api';

const urlPadrao = '/v1/relatorios/pendencias';
class ServicoRelatorioPendencias {
  gerar = async params => {
    return api.post(urlPadrao, params);
  };

  obterTipoPendenciasGrupos = ({ opcaoTodos }) => {
    return api.get(`${urlPadrao}/tipos?opcaoTodos=${opcaoTodos}`);
  };
}

export default new ServicoRelatorioPendencias();
