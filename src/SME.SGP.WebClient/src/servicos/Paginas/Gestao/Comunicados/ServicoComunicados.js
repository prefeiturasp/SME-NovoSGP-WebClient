import queryString from 'query-string';

import api from '../../../api';

const urlPadrao = 'v1/comunicados';

class ServicoComunicados {
  consultarPorId = async id => {
    let comunicado = {};

    try {
      const requisicao = await api.get(`${urlPadrao}/${id}`);
      if (requisicao.data) comunicado = requisicao.data;
    } catch {
      return comunicado;
    }

    return comunicado;
  };

  salvar = async dados => {
    console.log('dados', dados);

    let salvou = {};

    let metodo = 'post';
    let url = `${urlPadrao}`;

    if (dados.id && dados.id > 0) {
      metodo = 'put';
      url = `${url}/${dados.id}`;
    }

    try {
      const requisicao = await api[metodo](url, dados);
      if (requisicao.data) salvou = requisicao;
    } catch (erro) {
      salvou = [...erro.response.data.mensagens];
    }

    return salvou;
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

  obterTipoEscola = (dreCodigo, ueCodigo) => {
    return api.get(`/v1/ues/dres/${dreCodigo}/ues/${ueCodigo}/tipos-escolas`);
  };

  obterTurmas = (anoLetivo, ueCodigo, semestre, modalidades, anos) => {
    return api.get(
      `${urlPadrao}/ues/${ueCodigo}/anoletivo/${anoLetivo}/turmas`,
      {
        params: {
          semestre,
          modalidades,
          anos,
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
}

export default new ServicoComunicados();
