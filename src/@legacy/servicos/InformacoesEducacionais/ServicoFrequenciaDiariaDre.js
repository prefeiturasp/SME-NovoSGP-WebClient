import api from '../api';

class ServicoFrequenciaDiariaDre {
  ObterFrequenciaDiariaDre = ({
    anoLetivo,
    codigoDre,
    dataFrequencia,
    numeroPagina,
    numeroRegistros,
  }) => {
    if (
      !anoLetivo ||
      !codigoDre ||
      !dataFrequencia ||
      !numeroPagina ||
      !numeroRegistros
    ) {
      return Promise.resolve({
        data: { ues: [], totalPaginas: 0, totalRegistros: 0 },
      });
    }

    const params = new URLSearchParams();
    params.append('AnoLetivo', anoLetivo);
    params.append('CodigoDre', codigoDre);
    params.append('DataFrequencia', dataFrequencia);
    params.append('NumeroPagina', numeroPagina);
    params.append('NumeroRegistros', numeroRegistros);

    const url = `v1/painel-educacional/frequencia-diaria-dre?${params.toString()}`;
    return api.get(url, {
      headers: {
        Accept: 'text/plain',
      },
    });
  };
}

export default new ServicoFrequenciaDiariaDre();
