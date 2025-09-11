import api from '../api';

class ServicoIdepGrafico {
  obterIdepGrafico = (anoLetivo, etapa, codigoDre) => {
    const params = new URLSearchParams();

    if (anoLetivo) params.append('anoLetivo', anoLetivo);
    if (etapa) params.append('etapa', etapa);
    if (codigoDre != null && codigoDre !== '') {
      if (String(codigoDre).trim() === '-99') {
        params.append('CodigoDre', '');
      } else {
        params.append('CodigoDre', codigoDre);
      }
    }
    const queryString = params.toString();
    const url = queryString
      ? `v1/painel-educacional/Idep?${queryString}`
      : 'v1/painel-educacional/Idep';

    return api.get(url);
  };
}

export default new ServicoIdepGrafico();