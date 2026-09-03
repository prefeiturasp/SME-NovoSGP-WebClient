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

const obterDataAuditoria = secao =>
  secao?.auditoria?.alteradoEm || secao?.auditoria?.criadoEm;

const devePriorizarSecao = (secaoAtual, candidata) => {
  if (!secaoAtual) return true;
  if (!secaoAtual?.papSecaoId && candidata?.papSecaoId) return true;
  if (secaoAtual?.papSecaoId && !candidata?.papSecaoId) return false;

  const dataAtual = new Date(obterDataAuditoria(secaoAtual)).getTime();
  const dataCandidata = new Date(obterDataAuditoria(candidata)).getTime();

  if (!Number.isNaN(dataAtual) && !Number.isNaN(dataCandidata)) {
    return dataCandidata >= dataAtual;
  }

  return (
    Number(candidata?.papSecaoId || 0) >= Number(secaoAtual?.papSecaoId || 0)
  );
};

export const normalizarSecoesRelatorioPAP = secoes => {
  const secoesPorId = new Map();

  secoes?.forEach(secao => {
    const secaoAtual = secoesPorId.get(secao?.id);
    if (devePriorizarSecao(secaoAtual, secao)) {
      secoesPorId.set(secao?.id, secao);
    }
  });

  return Array.from(secoesPorId.values());
};

class ServicoRelatorioPAP {
  obterPeriodos = turmaCodigo => {
    return api.get(`${URL_PADRAO}/periodos/${turmaCodigo}`);
  };

  obterDadosSecoes = async (
    turmaCodigo,
    alunoCodigo,
    periodoRelatorioPAPId
  ) => {
    const url = `${URL_PADRAO}/turma/${turmaCodigo}/aluno/${alunoCodigo}/periodo/${periodoRelatorioPAPId}/secoes`;
    const retorno = await api.get(url);

    if (retorno?.data?.secoes) {
      retorno.data.secoes = normalizarSecoesRelatorioPAP(retorno.data.secoes);
    }

    return retorno;
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

      const secoesPorId = new Map(
        dadosSecoesRelatorioPAP?.secoes?.map(secao => [secao?.id, secao])
      );

      paramsSalvar.secoes = dadosMapeados.secoes.map(secao => {
        const dadosSecao = secoesPorId.get(secao?.secaoId);

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
        const dadosAtualizados = await this.obterDadosSecoes(
          turmaSelecionada?.turma,
          estudanteSelecionadoRelatorioPAP?.codigoEOL,
          periodoSelecionadoPAP?.periodoRelatorioPAPId
        ).catch(e => erros(e));

        if (dadosAtualizados?.data?.secoes?.length) {
          dispatch(setDadosSecoesRelatorioPAP(dadosAtualizados.data));
        } else {
          const dadosParaAtualizar = _.cloneDeep(dadosSecoesRelatorioPAP);
          dadosParaAtualizar.papAlunoId = resposta.data.papAlunoId;
          dadosParaAtualizar.papTurmaId = resposta.data.papTurmaId;
          dadosParaAtualizar.secoes.forEach(secaoAlterar => {
            const secaoAtualizada = resposta.data.secoes.find(
              secaoRetorno => secaoRetorno?.auditoria?.id === secaoAlterar?.id
            );

            if (secaoAtualizada) {
              secaoAlterar.auditoria = secaoAtualizada.auditoria;
              secaoAlterar.papSecaoId = secaoAtualizada.secaoId;
            }
          });

          dispatch(setDadosSecoesRelatorioPAP(dadosParaAtualizar));
        }
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
