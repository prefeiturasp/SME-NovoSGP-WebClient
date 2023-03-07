import _ from 'lodash';
import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import situacaoNAAPA from '~/dtos/situacaoNAAPA';
import { store } from '~/redux';
import {
  setLimparDadosEncaminhamentoNAAPA,
  setExibirLoaderEncaminhamentoNAAPA,
  setListaSecoesEmEdicao,
  setTabAtivaEncaminhamentoNAAPA,
  setDadosSecoesEncaminhamentoNAAPA,
  setDadosSituacaoEncaminhamentoNAAPA,
} from '~/redux/modulos/encaminhamentoNAAPA/actions';
import { limparDadosLocalizarEstudante } from '~/redux/modulos/localizarEstudante/actions';
import {
  setLimparDadosQuestionarioDinamico,
  setQuestionarioDinamicoEmEdicao,
} from '~/redux/modulos/questionarioDinamico/actions';
import { confirmar, erros, sucesso } from '~/servicos/alertas';
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

  imprimir = idsSelecionados =>
      api.post(`${URL_PADRAO}/imprimir-detalhado`, { encaminhamentoNaapaIds: idsSelecionados });
  

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
    ehRascunho,
    limparDadosAoSalvar = true
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

    const secoesEncaminhamentoNAAPA = _.cloneDeep(
      dadosSecoesEncaminhamentoNAAPA
    );

    const nomesSecoesComCamposObrigatorios = [];

    if (
      !ehRascunho &&
      secoesEncaminhamentoNAAPA?.length !== listaSecoesEmEdicao?.length
    ) {
      secoesEncaminhamentoNAAPA.forEach(secao => {
        const secaoEstaEmEdicao = listaSecoesEmEdicao.find(
          e => e.secaoId === secao.id
        );

        const secaoInvalida = !secaoEstaEmEdicao && !secao.concluido;
        const ehSecaoItinerancia =
          secao.nomeComponente === 'QUESTOES_ITINERACIA';
        if (secaoInvalida && !ehSecaoItinerancia) {
          nomesSecoesComCamposObrigatorios.push(secao.nome);
        }
      });
    }

    const dadosMapeados = await QuestionarioDinamicoFuncoes.mapearQuestionarios(
      dadosSecoesEncaminhamentoNAAPA,
      validarCamposObrigatorios,
      nomesSecoesComCamposObrigatorios
    );

    const formsValidos = !!dadosMapeados?.formsValidos;

    if (formsValidos || dadosMapeados?.secoes?.length) {
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

      if (resposta?.data?.id && limparDadosAoSalvar) {
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

  salvarPadrao = async (
    encaminhamentoId,
    limparDadosAoSalvar = true,
    novaSituacao
  ) => {
    const state = store.getState();

    const { encaminhamentoNAAPA } = state;
    const { dadosSituacaoEncaminhamentoNAAPA } = encaminhamentoNAAPA;

    const situacaoAtual =
      dadosSituacaoEncaminhamentoNAAPA?.situacao || situacaoNAAPA.Rascunho;

    const situacaoSalvar = novaSituacao || situacaoAtual;

    const ehRascunho = situacaoSalvar === situacaoNAAPA.Rascunho;

    const validarCamposObrigatorios = !ehRascunho;

    const resposta = await this.salvarEncaminhamento(
      encaminhamentoId,
      situacaoSalvar,
      validarCamposObrigatorios,
      ehRascunho,
      limparDadosAoSalvar
    );

    if (resposta?.status === 200) {
      let mensagem = ehRascunho
        ? 'Rascunho salvo com sucesso'
        : 'Registro cadastrado com sucesso';

      if (encaminhamentoId && situacaoAtual !== situacaoNAAPA.Rascunho) {
        mensagem = 'Registro alterado com sucesso';
      }
      sucesso(mensagem);
    }
    return resposta;
  };

  obterDadosAtendimento = (questionarioId, atendimentoId) => {
    const encaminhamentoSecaoId = atendimentoId
      ? `&encaminhamentoSecaoId=${atendimentoId}`
      : ``;

    return api.get(
      `${URL_PADRAO}/questionarioItinerario?questionarioId=${questionarioId}${encaminhamentoSecaoId}`
    );
  };

  salvarAtendimento = async (encaminhamentoId, atendimentoId) => {
    const state = store.getState();

    const { dispatch } = store;
    const { encaminhamentoNAAPA } = state;

    const { dadosSecoesEncaminhamentoNAAPA } = encaminhamentoNAAPA;

    const dadosMapeados = await QuestionarioDinamicoFuncoes.mapearQuestionarios(
      dadosSecoesEncaminhamentoNAAPA,
      true,
      [],
      false,
      [],
      false
    );

    const formsValidos = !!dadosMapeados?.formsValidos;

    if (formsValidos || dadosMapeados?.secoes?.length) {
      const tabItineranciaIndex = dadosMapeados?.secoes?.findIndex(
        item => item.secaoNome === 'QUESTOES_ITINERACIA'
      );

      const paramsSalvar = {
        encaminhamentoId: Number(encaminhamentoId),
        encaminhamentoNAAPASecao:
          tabItineranciaIndex > -1
            ? dadosMapeados.secoes[tabItineranciaIndex]
            : [],
      };

      if (atendimentoId) {
        paramsSalvar.encaminhamentoNAAPASecaoId = atendimentoId;
      }

      const resposta = await api
        .post(`${URL_PADRAO}/salvarItinerario`, paramsSalvar)
        .catch(e => erros(e));

      if (resposta?.data?.id) {
        dispatch(setQuestionarioDinamicoEmEdicao(false));
        dispatch(setListaSecoesEmEdicao([]));
        dispatch(setLimparDadosQuestionarioDinamico());
      }

      return resposta;
    }
    return false;
  };

  excluirAtendimento = (encaminhamentoNAAPAId, atendimentoId) =>
    api.delete(
      `${URL_PADRAO}/${encaminhamentoNAAPAId}/secoes-itinerancia/${atendimentoId}`
    );

  limparDadosAoEntrarItinerancia = (
    tabIndex,
    dadosSecoesEncaminhamentoNAAPA
  ) => {
    const { dispatch } = store;

    dispatch(setLimparDadosQuestionarioDinamico());
    dispatch(setListaSecoesEmEdicao([]));

    dispatch(setDadosSecoesEncaminhamentoNAAPA([]));

    const dadosSecoesClonado = _.cloneDeep(dadosSecoesEncaminhamentoNAAPA);

    setTimeout(() => {
      dispatch(setDadosSecoesEncaminhamentoNAAPA(dadosSecoesClonado));
    }, 300);

    dispatch(setQuestionarioDinamicoEmEdicao(false));
    dispatch(setTabAtivaEncaminhamentoNAAPA(tabIndex));
  };

  validarTrocaDeAbas = async (tabIndex, encaminhamentoId) => {
    const state = store.getState();

    const { dispatch } = store;

    const { encaminhamentoNAAPA, questionarioDinamico } = state;

    const {
      dadosSecoesEncaminhamentoNAAPA,
      listaSecoesEmEdicao,
    } = encaminhamentoNAAPA;
    const { questionarioDinamicoEmEdicao } = questionarioDinamico;

    const secaoDestino = dadosSecoesEncaminhamentoNAAPA?.find(
      secao => secao?.questionarioId?.toString() === tabIndex
    );

    const secaoItinerancia =
      secaoDestino?.nomeComponente === 'QUESTOES_ITINERACIA';

    if (
      secaoItinerancia &&
      questionarioDinamicoEmEdicao &&
      listaSecoesEmEdicao.length
    ) {
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );

      if (confirmou) {
        const resposta = await this.salvarPadrao(encaminhamentoId, false);
        if (resposta?.status === 200) {
          this.limparDadosAoEntrarItinerancia(
            tabIndex,
            dadosSecoesEncaminhamentoNAAPA
          );
        }
      } else {
        QuestionarioDinamicoFuncoes.limparDadosOriginaisQuestionarioDinamico(
          ServicoNAAPA.removerArquivo
        );

        dispatch(setListaSecoesEmEdicao([]));

        dispatch(setTabAtivaEncaminhamentoNAAPA(tabIndex));
      }
    } else if (secaoItinerancia) {
      this.limparDadosAoEntrarItinerancia(
        tabIndex,
        dadosSecoesEncaminhamentoNAAPA
      );
    } else {
      dispatch(setTabAtivaEncaminhamentoNAAPA(tabIndex));
    }
  };

  obterSituacaoEncaminhamento = async encaminhamentoNAAPAId => {
    const resposta = await api.get(
      `${URL_PADRAO}/${encaminhamentoNAAPAId}/situacao`
    );
    if (resposta?.status === 200) {
      const { dispatch } = store;
      const dadosSituacao = {
        situacao: resposta?.data?.codigo,
        descricaoSituacao: resposta?.data?.descricao,
      };
      dispatch(setDadosSituacaoEncaminhamentoNAAPA({ ...dadosSituacao }));
    }
  };

  encerrarEncaminhamentoNAAPA = (encaminhamentoId, motivoEncerramento) => {
    const params = { encaminhamentoId, motivoEncerramento };
    return api.post(`${URL_PADRAO}/encerrar`, params);
  };
}

export default new ServicoNAAPA();
