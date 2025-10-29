import api from '../api';

class ServicoIdebTabela {
  obterIdebTabela = (anoLetivo, codigoUe) => {
    const params = new URLSearchParams();

    if (anoLetivo) params.append('anoLetivo', anoLetivo);

    if (codigoUe && String(codigoUe).trim() !== '-99')
      params.append('codigoUe', codigoUe);

    const queryString = params.toString();
    const url = queryString
      ? `/v1/painel-educacional/proficiencia-ideb?${queryString}`
      : '/v1/painel-educacional/proficiencia-ideb';

    return api.get(url);
  };
}

export default new ServicoIdebTabela();
