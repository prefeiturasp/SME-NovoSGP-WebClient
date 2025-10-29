import api from '../api';

class ServicoAbandono {
  ObterDadosReclassificados = (codigoDre, codigoUe, anoLetivo) => {
    if (!anoLetivo) return Promise.resolve({ data: [] });

    const params = new URLSearchParams();
    if (codigoDre && String(codigoDre) !== '-99') {
      params.append('codigoDre', codigoDre);
    }
    if (codigoUe && String(codigoUe) !== '-99') {
      params.append('codigoDre', codigoUe);
    }
    params.append('anoLetivo', anoLetivo);

    const url = `v1/painel-educacional/reclassificacao?${params.toString()}`;
    return api.get(url);
  };
}

export default new ServicoAbandono();
