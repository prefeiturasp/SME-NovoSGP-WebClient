import queryString from 'query-string';

import api from '../../../api';

const urlPadrao = 'v1/comunicados';

class ServicoComunicados {
  consultarPorId = id => api.get(`${urlPadrao}/${id}`);

  salvar = dados => {
    if (dados?.id) {
      return api.put(`${urlPadrao}/${dados.id}`, dados);
    }

    return api.post(urlPadrao, dados);
  };

  excluir = async ids => api.delete(`${urlPadrao}`, { data: ids });

  buscarAnosPorModalidade = async (modalidades, codigoUe) => {
    return api.get(`${urlPadrao}/anos/modalidades`, {
      params: {
        modalidades,
        codigoUe,
      },
      paramsSerializer(params) {
        return queryString.stringify(params, {
          arrayFormat: 'repeat',
          skipEmptyString: true,
          skipNull: true,
        });
      },
    });
  };

  obterGruposPorModalidade = async modalidade => {
    try {
      const requisicao = await api.get(
        `v1/comunicacao/grupos/listar/modalidade/${modalidade}`
      );

      if (requisicao && requisicao.status === 204) return [];

      return requisicao.data;
    } catch (error) {
      throw error;
    }
  };

  obterAlunos = (codigoTurma, anoLetivo) => {
    return api.get(`${urlPadrao}/${codigoTurma}/alunos/${anoLetivo}`);
  };

  obterAnosLetivos = anoMinimo => {
    return api.get(`${urlPadrao}/anos-letivos`, {
      params: {
        anoMinimo,
      },
    });
  };

  obterTipoEscola = (dreCodigo, ueCodigo, modalidades) => {
    let url = `/v1/ues/dres/${dreCodigo}/ues/${ueCodigo}/tipos-escolas`;
    if (modalidades?.length) {
      url += `?modalidades=${modalidades.join('&modalidades=', modalidades)}`;
    }
    return api.get(url);
  };

  obterTurmas = (
    anoLetivo,
    ueCodigo,
    semestre,
    modalidades,
    anos,
    consideraHistorico
  ) => {
    return api.get(
      `${urlPadrao}/ues/${ueCodigo}/anoletivo/${anoLetivo}/turmas`,
      {
        params: {
          semestre,
          modalidades,
          anos,
          consideraHistorico,
        },
        paramsSerializer(params) {
          return queryString.stringify(params, {
            arrayFormat: 'repeat',
            skipEmptyString: true,
            skipNull: true,
          });
        },
      }
    );
  };

  obterSemestres = (consideraHistorico, modalidade, anoLetivo, ueCodigo) => {
    return api.get(
      `${urlPadrao}/semestres/consideraHistorico/${consideraHistorico}`,
      {
        params: {
          modalidade,
          anoLetivo,
          ueCodigo,
        },
      }
    );
  };

  obterTiposCalendario = (anoLetivo, descricao, modalidades) => {
    return api.get(`v1/calendarios/tipos/ano-letivo/${anoLetivo}/modalidades`, {
      params: {
        descricao,
        modalidades,
      },
      paramsSerializer(params) {
        return queryString.stringify(params, {
          arrayFormat: 'repeat',
          skipEmptyString: true,
          skipNull: true,
        });
      },
    });
  };

  obterQuantidadeCrianca = (
    anoLetivo, 
    codigoDre,
    codigoUe,
    turmas,
    modalidades,
    anosEscolares
  ) => {
    let url = `${urlPadrao}/filtro/anos-letivos/${anoLetivo}/dres/${codigoDre}/ues/${codigoUe}/quantidade-alunos`;
    url += `?turmas=${turmas.join('&turmas=', turmas)}`;
    url += `&modalidades=${modalidades.join('&modalidades=', modalidades)}`;
    url += `&anoTurma=${anosEscolares.join('&anoTurma=', anosEscolares)}`;

    return api.get(url);
  };
}

export default new ServicoComunicados();
