import { OPCAO_TODOS } from '~/constantes/constantes';
import api from '../../../api';

class ServicoComunicados {
  obterIdGrupoComunicadoPorModalidade = async modalidade => {
    try {
      const retorno = await api.get(`listar/modalidade/${modalidade}`);

      return {
        sucesso: true,
        data: retorno.data,
      };
    } catch (error) {
      return {
        sucesso: false,
        erro: error,
      };
    }
  };

  consultarPorId = async id => {
    let comunicado = {};

    try {
      const requisicao = await api.get(`v1/comunicado/${id}`);
      if (requisicao.data) comunicado = requisicao.data;
    } catch {
      return comunicado;
    }

    return comunicado;
  };

  salvar = async dados => {
    let salvou = {};

    let metodo = 'post';
    let url = 'v1/comunicado';

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
      const requisicao = await api.delete('v1/comunicado', parametros);
      if (requisicao && requisicao.status === 200) exclusao = requisicao;
    } catch (erro) {
      exclusao = [...erro.response.data.mensagens];
    }

    return exclusao;
  };

  buscarAnosPorModalidade = async (modalidade, codigoUe, params) => {
    return api.get(
      codigoUe != null && codigoUe !== OPCAO_TODOS
        ? `v1/comunicado/anos/modalidade/${modalidade}?codigoUe=${codigoUe}`
        : `v1/comunicado/anos/modalidade/${modalidade}`,
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
        `v1/comunicado/${codigoTurma}/alunos/${anoLetivo}`
      );

      if (requisicao && requisicao.status === 204) return [];

      return requisicao.data;
    } catch (error) {
      throw error;
    }
  };

  obterTipoEscola = () => {
    return Promise.resolve({
      data: [
        {
          valor: '1',
          desc: 1,
        },
        {
          valor: '2',
          desc: 2,
        },
      ],
    });
  };
}

export default new ServicoComunicados();
