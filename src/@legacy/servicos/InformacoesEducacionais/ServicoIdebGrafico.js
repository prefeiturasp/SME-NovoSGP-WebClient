import api from '../api';

class ServicoIdebGrafico {
  obterIdebGrafico = (anoLetivo, serie, codigoDre) => {
    const params = new URLSearchParams();

    if (anoLetivo) params.append('anoLetivo', anoLetivo);
    if (serie) params.append('serie', serie);
    if (codigoDre != null && codigoDre !== '') {
      if (String(codigoDre).trim() === '-99') {
        params.append('CodigoDre', '');
      } else {
        params.append('CodigoDre', codigoDre);
      }
    }
    const queryString = params.toString();
    const url = queryString
      ? `v1/painel-educacional/Ideb?${queryString}`
      : 'v1/painel-educacional/Ideb';

    return api.get(url);
  };
}

export default new ServicoIdebGrafico();
