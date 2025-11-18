import api from '../api';

class ServicoDetalhesUe {
  obterDetalhesUe = async codigoUe => {
    const params = new URLSearchParams();

    if (codigoUe && String(codigoUe).trim() !== '-99')
      params.append('codigoUe', codigoUe);

    const queryString = params.toString();
    const url = queryString
      ? `v1/painel-educacional/proficiencia-escolas-dados?${queryString}`
      : 'v1/painel-educacional/proficiencia-escolas-dados';

    return api.get(url);
  };
}

export default new ServicoDetalhesUe();
