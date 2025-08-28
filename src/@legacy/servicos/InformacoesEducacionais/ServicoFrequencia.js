import api from '../api';

class ServicoFrequencia {
  obterFrequenciaGlobal = (codigoDre, codigoUe) => {
    const params = new URLSearchParams();

    if (codigoDre) params.append('codigoDre', codigoDre);
    if (codigoUe) params.append('codigoUe', codigoUe);

    const queryString = params.toString();
    const url = queryString
      ? `v1/painel-educacional/frequencia-global?${queryString}`
      : 'v1/painel-educacional/frequencia-global';

    return api.get(url);
  };

  obterFrequenciaMensal = (codigoDre, codigoUe) => {
    const params = new URLSearchParams();

    if (codigoDre) params.append('codigoDre', codigoDre);
    if (codigoUe) params.append('codigoUe', codigoUe);

    const queryString = params.toString();
    const url = queryString
      ? `v1/painel-educacional/frequencia-mensal?${queryString}`
      : 'v1/painel-educacional/frequencia-mensal';

    return api.get(url);
  };

  obterFrequenciaRanking = (codigoDre, codigoUe) => {
    const params = new URLSearchParams();

    if (codigoDre) params.append('codigoDre', codigoDre);
    if (codigoUe) params.append('codigoUe', codigoUe);

    const queryString = params.toString();
    const url = queryString
      ? `v1/painel-educacional/frequencia-ranking?${queryString}`
      : 'v1/painel-educacional/frequencia-ranking';

    return api.get(url);
  };
}

export default new ServicoFrequencia();
