import api from '../api';

class ServicoPap {
  obterIndicadoresPap = (anoLetivo, codigoDre, codigoUe) => {
    const params = new URLSearchParams();

    params.append('anoLetivo', anoLetivo);

    if (codigoDre && String(codigoDre).trim() !== '-99')
      params.append('codigoDre', codigoDre);

    if (codigoUe && String(codigoUe).trim() !== '-99')
      params.append('codigoUe', codigoUe);

    const queryString = params.toString();
    const url = `v1/painel-educacional/indicadores-pap?${queryString}`;

    return api.get(url);
  };
}

export default new ServicoPap();
