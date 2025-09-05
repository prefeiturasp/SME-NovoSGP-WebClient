import api from '../api';

class ServicoAlfabetizacaoGrafico {
  obterAlfabetizacaoGrafico = (codigoDre, codigoUe, periodo, anoLetivo) => {
    const params = new URLSearchParams();

    if (codigoDre) params.append('CodigoDre', codigoDre);
    if (codigoUe) params.append('CodigoUe', codigoUe);
    if (periodo) params.append('Periodo', periodo);
    if (anoLetivo) params.append('anoLetivo', anoLetivo);

    const queryString = params.toString();
    const url = queryString
      ? `v1/painel-educacional/nivel-alfabetizacao?${queryString}`
      : 'v1/painel-educacional/nivel-alfabetizacao';

    return api.get(url);
  };
}

export default new ServicoAlfabetizacaoGrafico();
