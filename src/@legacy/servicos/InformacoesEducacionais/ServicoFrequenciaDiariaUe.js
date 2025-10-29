import api from '../api';

class ServicoFrequenciaDiariaUe {
  ObterFrequenciaDiariaUe = async ({
    anoLetivo,
    codigoUe,
    dataFrequencia,
    numeroPagina,
    numeroRegistros,
  }) => {
    if (
      !anoLetivo ||
      !codigoUe ||
      !dataFrequencia ||
      !numeroPagina ||
      !numeroRegistros
    ) {
      return Promise.resolve({
        data: { turmas: [], totalPaginas: 0, totalRegistros: 0 },
      });
    }

    const params = new URLSearchParams();
    params.append('AnoLetivo', anoLetivo);
    params.append('CodigoUe', codigoUe);
    params.append('DataFrequencia', dataFrequencia);
    params.append('NumeroPagina', numeroPagina);
    params.append('NumeroRegistros', numeroRegistros);

    const url = `v1/painel-educacional/frequencia-diaria-ue?${params.toString()}`;
    return api.get(url, {
      headers: {
        Accept: 'text/plain',
      },
    });
  };
}
export default new ServicoFrequenciaDiariaUe();
