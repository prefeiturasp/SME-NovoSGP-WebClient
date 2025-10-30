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

  ObterDadosNotasUe = (
    codigoDre,
    codigoUe,
    anoLetivo,
    bimestre,
    modalidade,
    pagina,
    numeroRegistros = 10
  ) => {
    if (!anoLetivo) return Promise.resolve({ data: [] });

    const params = new URLSearchParams();
    if (codigoDre && String(codigoDre) !== '-99') {
      params.append('codigoDre', codigoDre);
    }
    params.append('anoLetivo', anoLetivo);
    params.append('bimestre', bimestre);
    params.append('codigoUe', codigoUe);
    params.append('modalidade', modalidade);
    params.append('NumeroPagina', pagina);
    params.append('NumeroRegistros', numeroRegistros); // 👈 novo parâmetro

    const url = `v1/painel-educacional/notas-ue?${params.toString()}`;
    return api.get(url);
  };

  ObterModalidadesUe = (codigoUe, anoLetivo, bimestre) => {
    if (!anoLetivo || !codigoUe) return Promise.resolve({ data: [] });

    const params = new URLSearchParams();
    params.append('codigoUe', codigoUe);
    params.append('anoLetivo', anoLetivo);
    params.append('bimestre', bimestre);

    const url = `v1/painel-educacional/notas-ue/modalidades?${params.toString()}`;
    return api.get(url);
  };
}

export default new ServicoNotas();
