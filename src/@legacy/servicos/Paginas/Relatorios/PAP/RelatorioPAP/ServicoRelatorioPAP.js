import QuestionarioDinamicoFuncoes from '@/@legacy/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import tipoQuestao from '@/@legacy/dtos/tipoQuestao';
import {
  setLimparDadosQuestionarioDinamico,
  setListaSecoesEmEdicao,
  setQuestionarioDinamicoEmEdicao,
} from '@/@legacy/redux/modulos/questionarioDinamico/actions';
import {
  limparDadosRelatorioPAP,
  setDadosSecoesRelatorioPAP,
  setEstudanteSelecionadoRelatorioPAP,
  setEstudantesRelatorioPAP,
  setExibirLoaderRelatorioPAP,
} from '@/@legacy/redux/modulos/relatorioPAP/actions';
import { erros, sucesso } from '@/@legacy/servicos/alertas';
import { store } from '@/core/redux';
import { HttpStatusCode } from 'axios';
import _ from 'lodash';
import api from '~/servicos/api';

const URL_PADRAO = 'v1/relatorios/pap';

class ServicoRelatorioPAP {
  obterPeriodos = turmaCodigo => {
    return api.get(`${URL_PADRAO}/periodos/${turmaCodigo}`);
  };

  obterDadosSecoes = (turmaCodigo, alunoCodigo, periodoRelatorioPAPId) => {
    const url = `${URL_PADRAO}/turma/${turmaCodigo}/aluno/${alunoCodigo}/periodo/${periodoRelatorioPAPId}/secoes`;
    return api.get(url);
  };

  obterQuestionario = param => {
    let url = `${URL_PADRAO}/turma/${param.turmaCodigo}/aluno/${param.alunoCodigo}/periodo/${param.periodoRelatorioPAPId}/questionario/${param.questionarioId}`;
    if (param?.papSecaoId) {
      url = `${url}?papSecaoId=${param?.papSecaoId}`;
    }
    return api.get(url);
  };

  removerArquivo = arquivoCodigo =>
    api.delete(`${URL_PADRAO}/arquivo?arquivoCodigo=${arquivoCodigo}`);

  obterListaAlunos = (turmaCodigo, periodoRelatorioPAPId) => {
    const url = `${URL_PADRAO}/turma/${turmaCodigo}/relatorio-periodo/${periodoRelatorioPAPId}/alunos`;
    return api.get(url);
  };

  salvar = async (limparDadosAoSalvar = false) => {
    const state = store.getState();

    const { questionarioDinamico } = state;

    const { questionarioDinamicoEmEdicao } = questionarioDinamico;

    if (!questionarioDinamicoEmEdicao) return true;

    const { dispatch } = store;

    const { relatorioPAP, usuario } = state;

    const { turmaSelecionada } = usuario;
    const { listaSecoesEmEdicao } = questionarioDinamico;

    const {
      dadosSecoesRelatorioPAP,
      estudanteSelecionadoRelatorioPAP,
      periodoSelecionadoPAP,
      estudantesRelatorioPAP,
    } = relatorioPAP;

    const secoesRelatorioPAP = _.cloneDeep(dadosSecoesRelatorioPAP?.secoes);

    const nomesSecoesComCamposObrigatorios = [];

    if (secoesRelatorioPAP?.length !== listaSecoesEmEdicao?.length) {
      secoesRelatorioPAP.forEach(secao => {
        const secaoEstaEmEdicao = listaSecoesEmEdicao.find(
          e => e.secaoId === secao.id
        );

        const secaoInvalida =
          !secaoEstaEmEdicao && !secao.concluido && secao?.questoesObrigatorias;

        if (secaoInvalida) {
          nomesSecoesComCamposObrigatorios.push(secao?.nome);
        }
      });
    }

    const validarCamposObrigatorios = true;
    const dadosMapeados = await QuestionarioDinamicoFuncoes.mapearQuestionarios(
      dadosSecoesRelatorioPAP?.secoes,
      validarCamposObrigatorios,
      nomesSecoesComCamposObrigatorios
    );

    const formsValidos = !!dadosMapeados?.formsValidos;

    if (formsValidos || dadosMapeados?.secoes?.length) {
      const paramsSalvar = {
        periodoRelatorioPAPId: periodoSelecionadoPAP?.periodoRelatorioPAPId,
        turmaId: turmaSelecionada?.id,
        alunoCodigo: estudanteSelecionadoRelatorioPAP?.codigoEOL,
        alunoNome: estudanteSelecionadoRelatorioPAP?.nome,
        papTurmaId: dadosSecoesRelatorioPAP?.papTurmaId,
        papAlunoId: dadosSecoesRelatorioPAP?.papAlunoId,
      };

      paramsSalvar.secoes = dadosMapeados.secoes.map(secao => {
        const dadosSecao = dadosSecoesRelatorioPAP?.secoes?.find(
          s => s?.id === secao?.secaoId
        );

        const respostasQuestoe = secao?.questoes?.filter(
          q => q?.tipoQuestao !== tipoQuestao.InformacoesFrequenciaTurmaPAP
        );

        const retorno = {
          id: dadosSecao?.papSecaoId,
          secaoId: secao?.secaoId,
          respostas: respostasQuestoe,
        };

        if (retorno?.respostas?.length) {
          retorno.respostas = retorno.respostas.map(item => ({
            relatorioRespostaId: item?.respostaEncaminhamentoId,
            questaoId: item?.questaoId,
            tipoQuestao: item?.tipoQuestao,
            resposta: item?.resposta,
          }));
        }

        return retorno;
      });

      paramsSalvar.secoes = paramsSalvar.secoes?.filter(
        item => item?.respostas?.length
      );

      dispatch(setExibirLoaderRelatorioPAP(true));

      const resposta = await api
        .post(`${URL_PADRAO}/salvar`, paramsSalvar)
        .catch(e => erros(e));

      if (!limparDadosAoSalvar && resposta?.status === HttpStatusCode.Ok) {
        const dadosParaAtualizar = _.cloneDeep(dadosSecoesRelatorioPAP);
        dadosParaAtualizar.papAlunoId = resposta.data.papAlunoId;
        dadosParaAtualizar.papTurmaId = resposta.data.papTurmaId;
        dadosParaAtualizar.secoes.forEach(secaoAlterar => {
          const secoesAtualizadas = resposta.data.secoes;

          const dadosAtualizados = secoesAtualizadas.find(
            secaoRetorno => secaoRetorno?.auditoria?.id === secaoAlterar?.id
          );
          if (dadosAtualizados) {
            secaoAlterar.auditoria = dadosAtualizados.auditoria;
            secaoAlterar.papSecaoId = dadosAtualizados.secaoId;
          }
        });

        dispatch(setDadosSecoesRelatorioPAP(_.cloneDeep(dadosParaAtualizar)));
      }

      if (limparDadosAoSalvar) {
        dispatch(setEstudanteSelecionadoRelatorioPAP());
        dispatch(limparDadosRelatorioPAP([]));
        dispatch(setLimparDadosQuestionarioDinamico());
        dispatch(setListaSecoesEmEdicao([]));
        dispatch(setQuestionarioDinamicoEmEdicao(false));
      }

      if (resposta?.status === HttpStatusCode.Ok) {
        sucesso('Suas informações foram salvas com sucesso.');

        const estudanteAtualIndex = estudantesRelatorioPAP.findIndex(
          item => item.codigoEOL === estudanteSelecionadoRelatorioPAP?.codigoEOL
        );
        const estudantesRelatorioPAPCloned = _.cloneDeep(
          estudantesRelatorioPAP
        );

        estudantesRelatorioPAPCloned[
          estudanteAtualIndex
        ].processoConcluido = true;

        if (!limparDadosAoSalvar) {
          dispatch(
            setEstudanteSelecionadoRelatorioPAP({
              ...estudanteSelecionadoRelatorioPAP,
              processoConcluido: true,
            })
          );
        }
        dispatch(setEstudantesRelatorioPAP([...estudantesRelatorioPAPCloned]));
      }

      setTimeout(() => {
        dispatch(setExibirLoaderRelatorioPAP(false));
      }, 1000);

      return resposta;
    }

    return false;
  };
}

export default new ServicoRelatorioPAP();
