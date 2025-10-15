import api from '../api';

class ServicoAbandono {
  ObterDadosAbandonoSmeDre = (codigoDre, codigoUe, anoLetivo) => {
    if (!codigoDre || !anoLetivo) return Promise.resolve({ data: [] });

    const params = new URLSearchParams();
    params.append('codigoDre', codigoDre);
    params.append('anoLetivo', anoLetivo);

    const url = `v1/painel-educacional/abandono?${params.toString()}`;
    return api.get(url);
  };

  ObterDadosAbandonoUe = ({
    anoLetivo,
    codigoDre,
    codigoUe,
    modalidade,
    numeroPagina,
    numeroRegistros,
  }) => {
    if (
      !anoLetivo ||
      !codigoUe ||
      !modalidade ||
      !numeroPagina ||
      !numeroRegistros
    ) {
      return Promise.resolve({ data: [] });
    }

    const params = new URLSearchParams();
    params.append('anoLetivo', anoLetivo);
    params.append('codigoUe', codigoUe);
    params.append('modalidade', modalidade);
    params.append('numeroPagina', numeroPagina);
    params.append('numeroRegistros', numeroRegistros);
    if (codigoDre) params.append('codigoDre', codigoDre);

    const url = `v1/painel-educacional/abandono-ue?${params.toString()}`;
    return api.get(url, {
      headers: {
        Accept: 'text/plain',
      },
    });
  };
}

export default new ServicoAbandono();
