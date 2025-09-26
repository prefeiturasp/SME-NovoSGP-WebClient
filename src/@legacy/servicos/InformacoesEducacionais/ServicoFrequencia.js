import api from '../api';

class ServicoFrequencia {
  obterFrequenciaGlobal = (codigoDre, codigoUe) => {
    const params = new URLSearchParams();

    if (codigoDre && codigoDre !== '-99') params.append('codigoDre', codigoDre);
    if (codigoUe && codigoUe !== '-99') params.append('codigoUe', codigoUe);

    const queryString = params.toString();
    const url = queryString
      ? `v1/painel-educacional/frequencia-global?${queryString}`
      : 'v1/painel-educacional/frequencia-global';

    return api.get(url);
  };

  obterFrequenciaMensal = (codigoDre, codigoUe, anoLetivo) => {
    const params = new URLSearchParams();

    if (codigoDre && codigoDre !== '-99') params.append('codigoDre', codigoDre);
    if (codigoUe && codigoUe !== '-99') params.append('codigoUe', codigoUe);
    if (anoLetivo) params.append('anoLetivo', anoLetivo);

    const queryString = params.toString();
    const url = queryString
      ? `v1/painel-educacional/frequencia-mensal?${queryString}`
      : 'v1/painel-educacional/frequencia-mensal';

    return api.get(url);
  };

  obterFrequenciaRanking = (codigoDre, codigoUe, anoLetivo) => {
    const params = new URLSearchParams();

    if (codigoDre && codigoDre !== '-99') params.append('codigoDre', codigoDre);
    if (codigoUe && codigoUe !== '-99') params.append('codigoUe', codigoUe);
    if (anoLetivo) params.append('anoLetivo', anoLetivo);

    const queryString = params.toString();
    const url = queryString
      ? `v1/painel-educacional/frequencia-ranking?${queryString}`
      : 'v1/painel-educacional/frequencia-ranking';

    return api.get(url);
  };
}

export default new ServicoFrequencia();
