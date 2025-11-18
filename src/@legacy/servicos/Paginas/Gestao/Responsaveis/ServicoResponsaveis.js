import api from '~/servicos/api';

const URL_PADRAO = 'v1/supervisores';

class ServicoResponsaveis {
  obterTipoReponsavel = () => api.get(`${URL_PADRAO}/tipo-responsavel`);

  salvarAtribuicao = dados => api.post(`${URL_PADRAO}/atribuir-ue`, dados);

  obterResponsaveis = async (dre, tipoResponsavelAtribuicao) => {
    if (tipoResponsavelAtribuicao) {
      return api.get(
        `${URL_PADRAO}/dre/${dre}?tipoResponsavelAtribuicao=${tipoResponsavelAtribuicao}`
      );
    }
    return api.get(`${URL_PADRAO}/dre/${dre}`);
  };

  obterUesSemAtribuicao = async (dre, responsavel) => {
    return api.get(`v1/dres/${dre}/ues/sem-atribuicao/${responsavel}`);
  };

  obterUesAtribuidas = (responsavel, dre, tipoResponsavel) =>
    api.get(`${URL_PADRAO}/${responsavel}/dre/${dre}/${tipoResponsavel}`);
}

export default new ServicoResponsaveis();
