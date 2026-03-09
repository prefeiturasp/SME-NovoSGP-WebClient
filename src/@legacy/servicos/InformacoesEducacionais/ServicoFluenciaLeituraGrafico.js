import api from '../api';

class ServicoFluenciaLeituraGrafico {
  obterFluenciaLeituraGrafico = (codigoDre, codigoUe, periodo, anoLetivo) => {
    const params = new URLSearchParams();

    if (codigoDre !== undefined && codigoDre !== null && codigoDre !== '-99')
      params.append('CodigoDre', codigoDre);
    if (codigoUe !== undefined && codigoUe !== null && codigoUe !== '-99')
      params.append('CodigoUe', codigoUe);
    if (periodo) params.append('Periodo', periodo);
    if (anoLetivo) params.append('anoLetivo', anoLetivo);

    const queryString = params.toString();
    const url = queryString
      ? `v1/painel-educacional/fluencia-leitora?${queryString}`
      : 'v1/painel-educacional/fluencia-leitora';

    return api.get(url);
  };

  obterFluenciaLeituraUe = (codigoUe, tipoAvaliacao, anoLetivo) => {
    const params = new URLSearchParams();

    if (codigoUe !== undefined && codigoUe !== null && codigoUe !== '-99')
      params.append('CodigoUe', codigoUe);
    if (tipoAvaliacao) params.append('tipoAvaliacao', tipoAvaliacao);
    if (anoLetivo) params.append('anoLetivo', anoLetivo);

    const queryString = params.toString();
    const url = queryString
      ? `v1/painel-educacional/fluencia-leitora-ue?${queryString}`
      : 'v1/painel-educacional/fluencia-leitora-ue';

    return api.get(url);
  };
}

export default new ServicoFluenciaLeituraGrafico();
