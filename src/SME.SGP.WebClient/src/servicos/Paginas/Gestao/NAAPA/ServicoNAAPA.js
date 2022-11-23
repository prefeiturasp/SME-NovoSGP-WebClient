import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import { RotasDto } from '~/dtos';
import situacaoNAAPA from '~/dtos/situacaoNAAPA';
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
import history from '~/servicos/history';

const URL_PADRAO = 'v1/encaminhamento-naapa';

class ServicoNAAPA {
  buscarSituacoes = () => api.get(`${URL_PADRAO}/situacoes`);

  buscarPrioridades = () => api.get(`${URL_PADRAO}/prioridades`);

  obterDadosEncaminhamentoNAAPA = encaminhamentoId =>
    api.get(`${URL_PADRAO}/${encaminhamentoId}`);

  obterSecoes = encaminhamentoId =>
    api.get(`${URL_PADRAO}/secoes?encaminhamentoNAAPAId=${encaminhamentoId}`);

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
    validarCamposObrigatorios
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

    const dadosMapeados = await QuestionarioDinamicoFuncoes.mapearQuestionarios(
      listaSecoesEmEdicao,
      dadosSecoesEncaminhamentoNAAPA,
      validarCamposObrigatorios
    );

    if (dadosMapeados?.secoes?.length) {
      const paramsSalvar = {
        id: encaminhamentoId || 0,
        turmaId: turma?.id,
        alunoCodigo: aluno?.codigoAluno,
        situacao,
        secoes: dadosMapeados?.secoes,
      };

      dispatch(setExibirLoaderEncaminhamentoNAAPA(true));

      const resposta = await api
        .post(`${URL_PADRAO}/salvar`, paramsSalvar)
        .catch(e => erros(e))
        .finally(() => dispatch(setExibirLoaderEncaminhamentoNAAPA(false)));

      if (resposta?.data?.id) {
        dispatch(setQuestionarioDinamicoEmEdicao(false));
        dispatch(setListaSecoesEmEdicao([]));
        dispatch(setLimparDadosEncaminhamentoNAAPA());
        dispatch(setLimparDadosQuestionarioDinamico());
        dispatch(limparDadosLocalizarEstudante());

        if (situacaoNAAPA.Rascunho === situacao) {
          history.push(
            `${RotasDto.ENCAMINHAMENTO_NAAPA}/${resposta?.data?.id}`
          );
        } else {
          history.push(`${RotasDto.ENCAMINHAMENTO_NAAPA}`);
        }
      }

      return resposta?.status === 200;
    }

    return false;
  };
}

export default new ServicoNAAPA();
