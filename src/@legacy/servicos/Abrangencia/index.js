import api from '~/servicos/api';

const AbrangenciaServico = {
  buscarDres(url = '', consideraHistorico = false) {
    if (url) return api.get(url, consideraHistorico);
    return api.get(`/v1/abrangencias/${consideraHistorico}/dres`);
  },
  buscarUes(
    dreId,
    url = '',
    temParametros = false,
    modalidade,
    consideraHistorico = true,
    anoLetivo
  ) {
    if (url && !temParametros)
      return api.get(`${url}/${dreId}/ues/atribuicoes`);

    if (temParametros) return api.get(url);

    const params = {
      ...(modalidade && { modalidade }),
      ...(anoLetivo && { anoLetivo }),
    };

    return api.get(`/v1/abrangencias/${consideraHistorico}/dres/${dreId}/ues`, {
      params,
    });
  },
  buscarModalidades() {
    return api.get(`v1/abrangencias/modalidades`);
  },
  /**
   * @param {String} ue Ue selecionada
   * @param {String} modalidade Modalidade Selecionada
   * @param {String} periodo Periodo (opcional)
   */
  buscarTurmas(
    ue,
    modalidade = 0,
    periodo = '',
    anoLetivo = '',
    consideraHistorico = false,
    turmasRegulares = false,
    tipos = undefined,
    consideraNovosAnosInfantil = true
  ) {
    let params = {};
    if (modalidade) {
      params = { modalidade };
    }
    const action = turmasRegulares ? 'turmas-regulares' : 'turmas';
    const adicionaTipos = tipos
      ? `&${tipos.map(item => `tipos=${item}`).join('&')}`
      : '';

    if (periodo) {
      params = { ...params, periodo };
    }

    return api.get(
      `v1/abrangencias/${consideraHistorico}/dres/ues/${ue}/${action}?consideraNovosAnosInfantil=${consideraNovosAnosInfantil}${
        anoLetivo ? `&anoLetivo=${anoLetivo}${adicionaTipos}` : ''
      }`,
      {
        params,
      }
    );
  },
  /**
   * @param {String} ue Ue selecionada
   * @param {String} modalidade Modalidade Selecionada
   * @param {String} periodo Periodo (opcional)
   * @param {String} componenteCurricular Componente selecionado
   */
  buscarTurmasMesmoComponenteCurricular(
    ue,
    modalidade = 0,
    periodo = '',
    anoLetivo = '',
    consideraHistorico = false,
    consideraNovosAnosInfantil = true,
    componente
  ) {
    let params = {};
    if (modalidade) {
      params = { modalidade };
    }

    if (periodo) {
      params = { ...params, periodo };
    }

    return api.get(
      `v1/abrangencias/${consideraHistorico}/dres/ues/${ue}/turmas/disciplina/${componente}?consideraNovosAnosInfantil=${consideraNovosAnosInfantil}${
        anoLetivo ? `&anoLetivo=${anoLetivo}` : ''
      }`,
      {
        params,
      }
    );
  },
  buscarDisciplinas(codigoTurma, params) {
    return api.get(`v1/professores/turmas/${codigoTurma}/disciplinas`, {
      params,
    });
  },
  buscarDisciplinasPlanejamento(codigoTurma, params) {
    return api.get(
      `v1/professores/turmas/${codigoTurma}/disciplinas/planejamento`,
      {
        params,
      }
    );
  },
  buscarTodosAnosLetivos(consideraHistorico = false) {
    return api.get(`v1/abrangencias/${consideraHistorico}/anos-letivos-todos`);
  },
  usuarioTemAbrangenciaTodasTurmas(consideraHistorico = false) {
    return api.get(`v1/abrangencias/${consideraHistorico}/adm`);
  },
  buscarAnosEscolares(
    codigoUe,
    modalidade,
    consideraHistorico = false,
    anoLetivo = null
  ) {
    return api.get(
      `v1/abrangencias/${consideraHistorico}/ues/${codigoUe}/modalidades/${modalidade}/turmas/anos/${anoLetivo}`
    );
  },
  obterSemestres(
    consideraHistorico,
    anoLetivo,
    modalidade,
    dreCodigo,
    ueCodigo
  ) {
    const url = `v1/abrangencias/${consideraHistorico}/semestres`;
    return api.get(url, {
      params: { anoLetivo, modalidade, dreCodigo, ueCodigo },
    });
  },
};

export default AbrangenciaServico;
