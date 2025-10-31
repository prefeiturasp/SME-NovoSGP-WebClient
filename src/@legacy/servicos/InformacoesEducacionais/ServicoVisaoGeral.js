import api from '../api';

class ServicoVisaoGeral {
  obterVisaoGeral = (anoLetivo, codigoDre) => {
    const params = new URLSearchParams();
    params.append('anoLetivo', anoLetivo);
    params.append('codigoDre', codigoDre);

    return api.get('v1/painel-educacional/visao-geral', { params });
  };

  obterVisaoGeralTaxaAlfabetizacao = (anoLetivo, codigoDre) => {
    const params = new URLSearchParams();
    params.append('anoLetivo', anoLetivo);
    if (codigoDre) params.append('codigoDre', codigoDre);

    return api.get('v1/painel-educacional/taxa-alfabetizacao', { params });
  };
}

export default new ServicoVisaoGeral();
