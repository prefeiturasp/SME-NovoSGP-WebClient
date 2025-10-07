import api from '../api';

class ServicoAbandono {
  ObterDadosAbandano = (codigoDre, codigoUe, anoLetivo) => {
    const params = new URLSearchParams();

    if (codigoDre) params.append('codigoDre', codigoDre);
    if (codigoUe) params.append('codigoUe', codigoUe);
    if (anoLetivo) params.append('anoLetivo', anoLetivo);

    const queryString = params.toString();
    const url = queryString
      ? `v1/painel-educacional/abandono?${queryString}`
      : 'v1/painel-educacional/abandono';

    return api.get(url);
  };
}

export default new ServicoAbandono();
