import api from '~/servicos/api';

const urlPadrao = 'v1/pendencias/listar';

class ServicoPendencias {
  obterPendenciasListaPaginada = (
    turmaCodigo = '',
    tipoPendencia = 0,
    tituloPendencia = '',
    numeroPagina = 1,
    numeroRegistros = 10
  ) => {
    return api.get(urlPadrao, {
      params: {
        turmaCodigo,
        tipoPendencia,
        tituloPendencia,
        numeroPagina,
        numeroRegistros,
      },
    });
  };

  buscarTurmas = () => {
    return api.get(`v1/abrangencias/turmas/vigentes`);
  };
}

export default new ServicoPendencias();
