import api from '../api';

class ServicoDistorcaoIdadeSerie {
  ObterDadosDistorcaoSmeDreUe = (codigoDre, codigoUe, anoLetivo) => {
    if (!anoLetivo) return Promise.resolve({ data: [] });

    const params = new URLSearchParams();

    if (codigoDre !== undefined && codigoDre !== null && codigoDre !== '-99')
      params.append('CodigoDre', codigoDre);
    if (codigoUe !== undefined && codigoUe !== null && codigoUe !== '-99')
      params.append('CodigoUe', codigoUe);
    if (anoLetivo) params.append('anoLetivo', anoLetivo);

    const url = `v1/painel-educacional/distorcao-serie-idade?${params.toString()}`;
    return api.get(url);
  };
}

export default new ServicoDistorcaoIdadeSerie();
