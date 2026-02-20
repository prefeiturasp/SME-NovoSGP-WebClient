import api from '../api';

class ServicoTabelaEducacional {
  ObterDadosTabelaInformacoesEducacionaisDRE = (
    codigoDre,
    anoLetivo,
    pagina,
    numeroRegistros = 10
  ) => {
    if (!anoLetivo) return Promise.resolve({ data: [] });

    const params = new URLSearchParams();
    if (codigoDre && String(codigoDre) !== '-99') {
      params.append('codigoDre', codigoDre);
    }
    params.append('anoLetivo', anoLetivo);
    params.append('NumeroPagina', pagina);
    params.append('NumeroRegistros', numeroRegistros);

    const url = `v1/painel-educacional/informacoes-educacionais?${params.toString()}`;
    return api.get(url);
  };
}

export default new ServicoTabelaEducacional();
