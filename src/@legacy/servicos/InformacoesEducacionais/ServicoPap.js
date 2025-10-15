import api from '../api';

class ServicoPap {
  obterIndicadoresPap = (codigoDre, codigoUe) => {
    const params = new URLSearchParams();

    if (codigoDre && String(codigoDre).trim() !== '-99')
      params.append('codigoDre', codigoDre);

    if (codigoUe && String(codigoUe).trim() !== '-99')
      params.append('codigoUe', codigoUe);

    const queryString = params.toString();
    const url = queryString
      ? `v1/painel-educacional/indicadores-pap?${queryString}`
      : 'v1/painel-educacional/indicadores-pap';

    return api.get(url);
  };
}

export default new ServicoPap();
