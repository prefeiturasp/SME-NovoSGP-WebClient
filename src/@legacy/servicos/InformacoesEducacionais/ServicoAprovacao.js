import api from '../api';

class ServicoAprovacao {
  ObterDadosAprovacaoSmeDre = (codigoDre, codigoUe, anoLetivo) => {
    if (!anoLetivo) return Promise.resolve({ data: [] });

    const params = new URLSearchParams();
    if (codigoDre && String(codigoDre) !== '-99') {
      params.append('codigoDre', codigoDre);
    }
    params.append('anoLetivo', anoLetivo);

    const url = `v1/painel-educacional/aprovacao?${params.toString()}`;
    return api.get(url);
  };

  ObterDadosAprovacaoUe = (
    codigoUe,
    anoLetivo,
    modalidade,
    pagina,
    numeroRegistros = 10
  ) => {
    if (!anoLetivo) return Promise.resolve({ data: [] });

    const params = new URLSearchParams();

    params.append('anoLetivo', anoLetivo);
    params.append('codigoUe', codigoUe);
    params.append('modalidadeId', modalidade);
    params.append('NumeroPagina', pagina);
    params.append('NumeroRegistros', numeroRegistros);

    const url = `v1/painel-educacional/aprovacao-ue?${params.toString()}`;
    return api.get(url);
  };
}

export default new ServicoAprovacao();
