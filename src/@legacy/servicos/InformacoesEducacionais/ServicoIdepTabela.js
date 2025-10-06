import api from '../api';

class ServicoIdepTabela {
  obterIdepTabela = (anoLetivo, codigoUe) => {
    const params = new URLSearchParams();

    if (anoLetivo) params.append('anoLetivo', anoLetivo);

    if (codigoUe && String(codigoUe).trim() !== '-99')
      params.append('codigoUe', codigoUe);

    const queryString = params.toString();
    const url = queryString
      ? `/v1/painel-educacional/proficiencia-idep?${queryString}`
      : '/v1/painel-educacional/proficiencia-idep';

    return api.get(url);
  };
}

export default new ServicoIdepTabela();
