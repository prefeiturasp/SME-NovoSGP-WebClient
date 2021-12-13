import api from '~/servicos/api';

const urlPadrao = 'v1/pendencias';

class ServicoPendencias {
  obterPendenciasListaPaginada = (codigoTurma, tipoPendenciaGrupo, titulo, numeroPagina, numeroRegistros) => {
    return api.get(
      `${urlPadrao}/turma/${codigoTurma || "%20"}/tipo/${tipoPendenciaGrupo || 0}/titulo/${titulo || "%20"}`
    );
  };
  buscarTurmas() {
    return api.get(`v1/abrangencias/turmas/vigentes`);
  };
}

export default new ServicoPendencias();
