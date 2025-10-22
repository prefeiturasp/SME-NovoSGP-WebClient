import api from '../api';

class ServicoNotas {
  ObterDadosNotasSmeDre = (codigoDre, codigoUe, anoLetivo, bimestre) => {
    if (!anoLetivo) return Promise.resolve({ data: [] });

    const params = new URLSearchParams();
    if (codigoDre && String(codigoDre) !== '-99') {
      params.append('codigoDre', codigoDre);
    }
    params.append('anoLetivo', anoLetivo);
    params.append('bimestre', bimestre);

    const url = `v1/painel-educacional/notas?${params.toString()}`;
    return api.get(url);
  };

  ObterDadosNotasUe = (codigoDre, codigoUe, anoLetivo, bimestre) => {
    if (!anoLetivo) return Promise.resolve({ data: [] });

    const params = new URLSearchParams();
    if (codigoDre && String(codigoDre) !== '-99') {
      params.append('codigoDre', codigoDre);
    }
    params.append('anoLetivo', anoLetivo);
    params.append('bimestre', bimestre);

    const url = `v1/painel-educacional/notas-ue?${params.toString()}`;
    return api.get(url);
  };
}

export default new ServicoNotas();
