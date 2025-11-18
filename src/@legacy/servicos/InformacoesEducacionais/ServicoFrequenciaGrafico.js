import api from '../api';

class ServicoFrequenciaGrafico {
  obterFrequenciaGrafico = (codigoUe, anoLetivo) => {
    const params = new URLSearchParams();

    if (codigoUe) params.append('CodigoUe', codigoUe);
    if (anoLetivo) params.append('AnoLetivo', anoLetivo);

    const queryString = params.toString();
    const url = queryString
      ? `v1/painel-educacional/frequencia-semanal-ue?${queryString}`
      : 'v1/painel-educacional/frequencia-semanal-ue';

    return api.get(url);
  };
}

export default new ServicoFrequenciaGrafico();
