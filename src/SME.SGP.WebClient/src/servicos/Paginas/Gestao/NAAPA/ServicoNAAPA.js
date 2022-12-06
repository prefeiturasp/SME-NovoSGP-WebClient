import _ from 'lodash';
import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import { store } from '~/redux';
import {
  setLimparDadosEncaminhamentoNAAPA,
  setExibirLoaderEncaminhamentoNAAPA,
  setListaSecoesEmEdicao,
} from '~/redux/modulos/encaminhamentoNAAPA/actions';
import { limparDadosLocalizarEstudante } from '~/redux/modulos/localizarEstudante/actions';
import {
  setLimparDadosQuestionarioDinamico,
  setQuestionarioDinamicoEmEdicao,
} from '~/redux/modulos/questionarioDinamico/actions';
import { erros } from '~/servicos/alertas';
import api from '~/servicos/api';

const URL_PADRAO = 'v1/encaminhamento-naapa';

class ServicoNAAPA {
  buscarSituacoes = () => api.get(`${URL_PADRAO}/situacoes`);

  buscarPrioridades = () => api.get(`${URL_PADRAO}/prioridades`);

  obterDadosEncaminhamentoNAAPA = encaminhamentoId =>
    api.get(`${URL_PADRAO}/${encaminhamentoId}`);

  obterSecoes = (encaminhamentoId, modalidade) =>
    api.get(
      `${URL_PADRAO}/secoes?encaminhamentoNAAPAId=${encaminhamentoId}&modalidade=${modalidade}`
    );

  obterDadosQuestionarioId = (
    questionarioId,
    codigoAluno,
    codigoTurma,
    encaminhamentoId
  ) =>
    api.get(
      `${URL_PADRAO}/questionario?questionarioId=${questionarioId}&codigoAluno=${codigoAluno}&codigoTurma=${codigoTurma}&encaminhamentoId=${encaminhamentoId ||
        0}`
    );

  guardarSecaoEmEdicao = secaoId => {
    const { dispatch } = store;

    const state = store.getState();
    const { encaminhamentoNAAPA } = state;
    const { listaSecoesEmEdicao } = encaminhamentoNAAPA;

    if (listaSecoesEmEdicao?.length) {
      const listaNova = [...listaSecoesEmEdicao];
      const jaTemNaLista = listaNova.find(item => item?.secaoId === secaoId);

      if (jaTemNaLista) return;

      listaNova.push({ secaoId });
      dispatch(setListaSecoesEmEdicao(listaNova));
    } else {
      dispatch(setListaSecoesEmEdicao([{ secaoId }]));
    }
  };

  removerArquivo = arquivoCodigo =>
    api.delete(`${URL_PADRAO}/arquivo?arquivoCodigo=${arquivoCodigo}`);

  excluirEncaminhamento = id => api.delete(`${URL_PADRAO}/${id}`);

  salvarEncaminhamento = async (
    encaminhamentoId,
    situacao,
    validarCamposObrigatorios,
    ehRascunho
  ) => {
    const state = store.getState();

    const { dispatch } = store;

    const { encaminhamentoNAAPA } = state;
    const {
      listaSecoesEmEdicao,
      dadosSecoesEncaminhamentoNAAPA,
      dadosEncaminhamentoNAAPA,
    } = encaminhamentoNAAPA;

    const { aluno, turma } = dadosEncaminhamentoNAAPA;

    const secoesEmEdicao = _.cloneDeep(listaSecoesEmEdicao);
    const secoesEncaminhamentoNAAPA = _.cloneDeep(
      dadosSecoesEncaminhamentoNAAPA
    );

    const nomesSecoesComCamposObrigatorios = [];

    if (
      !ehRascunho &&
      secoesEncaminhamentoNAAPA?.length !== secoesEmEdicao?.length
    ) {
      secoesEncaminhamentoNAAPA.forEach(secao => {
        const secaoEstaEmEdicao = secoesEmEdicao.find(
          e => e.secaoId === secao.id
        );

        const secaoInvalida = !secaoEstaEmEdicao && !secao.concluido;
        if (secaoInvalida) {
          nomesSecoesComCamposObrigatorios.push(secao.nome);
        }
      });
    }

    const dadosMapeados = await QuestionarioDinamicoFuncoes.mapearQuestionarios(
      listaSecoesEmEdicao,
      dadosSecoesEncaminhamentoNAAPA,
      validarCamposObrigatorios,
      nomesSecoesComCamposObrigatorios
    );

    const formsInvalidos = !!dadosMapeados?.formsInvalidos;

    if (formsInvalidos || dadosMapeados?.secoes?.length) {
      const paramsSalvar = {
        turmaId: turma?.id,
        alunoCodigo: aluno?.codigoAluno,
        situacao,
        secoes: dadosMapeados?.secoes?.length ? dadosMapeados.secoes : [],
      };

      if (encaminhamentoId) {
        paramsSalvar.id = encaminhamentoId;
      }

      dispatch(setExibirLoaderEncaminhamentoNAAPA(true));

      const resposta = await api
        .post(`${URL_PADRAO}/salvar`, paramsSalvar)
        .catch(e => erros(e));

      if (resposta?.data?.id) {
        dispatch(setQuestionarioDinamicoEmEdicao(false));
        dispatch(setListaSecoesEmEdicao([]));
        dispatch(setLimparDadosEncaminhamentoNAAPA());
        dispatch(setLimparDadosQuestionarioDinamico());
        dispatch(limparDadosLocalizarEstudante());
      }

      setTimeout(() => {
        dispatch(setExibirLoaderEncaminhamentoNAAPA(false));
      }, 1000);

      return resposta;
    }

    return false;
  };
}

export default new ServicoNAAPA();
