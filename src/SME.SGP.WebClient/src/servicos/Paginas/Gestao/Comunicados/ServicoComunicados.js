import queryString from 'query-string';

import { OPCAO_TODOS } from '~/constantes/constantes';
import api from '../../../api';

const urlPadrão = 'v1/comunicado';

class ServicoComunicados {
  consultarPorId = async id => {
    let comunicado = {};

    try {
      const requisicao = await api.get(`${urlPadrão}/${id}`);
      if (requisicao.data) comunicado = requisicao.data;
    } catch {
      return comunicado;
    }

    return comunicado;
  };

  salvar = async dados => {
    let salvou = {};

    let metodo = 'post';
    let url = `${urlPadrão}`;

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

  excluir = async ids => {
    let exclusao = {};
    const parametros = { data: ids };

    try {
      const requisicao = await api.delete(`${urlPadrão}`, parametros);
      if (requisicao && requisicao.status === 200) exclusao = requisicao;
    } catch (erro) {
      exclusao = [...erro.response.data.mensagens];
    }

    return exclusao;
  };

  buscarAnosPorModalidade = async (modalidade, codigoUe, params) => {
    return api.get(
      codigoUe != null && codigoUe !== OPCAO_TODOS
        ? `${urlPadrão}/anos/modalidade/${modalidade}?codigoUe=${codigoUe}`
        : `${urlPadrão}/anos/modalidade/${modalidade}`,
      {
        params,
      }
    );
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

  obterAlunos = async (codigoTurma, anoLetivo) => {
    try {
      const requisicao = await api.get(
        `${urlPadrão}/${codigoTurma}/alunos/${anoLetivo}`
      );

      if (requisicao && requisicao.status === 204) return [];

      return requisicao.data;
    } catch (error) {
      throw error;
    }
  };

  obterAnosLetivos = anoMinimo => {
    return api.get(`${urlPadrão}/anos-letivos`, {
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
      `${urlPadrão}/ues/${ueCodigo}/anoletivo/${anoLetivo}/turmas`,
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
}

export default new ServicoComunicados();
