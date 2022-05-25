import api from '~/servicos/api';

const URL_PADRAO = 'v1/supervisores';

class ServicoResponsaveis {
  obterTipoReponsavel = () => api.get(`${URL_PADRAO}/tipo-responsavel`);

  salvarAtribuicao = dados => api.post(`${URL_PADRAO}/atribuir-ue`, dados);

  obterResponsaveis = (dre, tipoResponsavelAtribuicao) =>
    api.get(
      `${URL_PADRAO}/dre/${dre}?tipoResponsavelAtribuicao=${tipoResponsavelAtribuicao}`
    );

  obterUesSemAtribuicao = dre => api.get(`v1/dres/${dre}/ues/sem-atribuicao`);

  obterUesAtribuidas = (responsavel, dre) =>
    api.get(`${URL_PADRAO}/${responsavel}/dre/${dre}`);
}

export default new ServicoResponsaveis();
