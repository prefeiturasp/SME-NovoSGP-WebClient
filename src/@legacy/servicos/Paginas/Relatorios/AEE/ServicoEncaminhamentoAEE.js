import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import { ROUTES } from '@/core/enum/routes';
import tipoQuestao from '~/dtos/tipoQuestao';
import { store } from '@/core/redux';
import {
  setDadosCollapseAtribuicaoResponsavel,
  setLimparDadosAtribuicaoResponsavel,
} from '~/redux/modulos/collapseAtribuicaoResponsavel/actions';
import {
  setDadosCollapseLocalizarEstudante,
  setLimparDadosLocalizarEstudante,
} from '~/redux/modulos/collapseLocalizarEstudante/actions';
import {
  setDadosEncaminhamento,
  setDadosModalAviso,
  setExibirLoaderEncaminhamentoAEE,
  setExibirModalAviso,
  setExibirModalErrosEncaminhamento,
  setLimparDadosEncaminhamento,
  setListaSecoesEmEdicao,
  setNomesSecoesComCamposObrigatorios,
} from '~/redux/modulos/encaminhamentoAEE/actions';
import { setDadosObjectCardEstudante } from '~/redux/modulos/objectCardEstudante/actions';
import {
  setLimparDadosQuestionarioDinamico,
  setQuestionarioDinamicoEmEdicao,
} from '~/redux/modulos/questionarioDinamico/actions';
import { erros } from '~/servicos/alertas';
import api from '~/servicos/api';
import { ServicoCalendarios } from '../../Calendario';

const urlPadrao = 'v1/encaminhamento-aee';

class ServicoEncaminhamentoAEE {
  obterSituacoes = () => {
    return api.get(`${urlPadrao}/situacoes`);
  };

  obterAlunoSituacaoEncaminhamentoAEE = ({ estudanteCodigo, ueCodigo }) => {
    return api.get(`${urlPadrao}/estudante/situacao`, {
      params: {
        estudanteCodigo,
        ueCodigo,
      },
    });
  };

  obterAvisoModal = async () => {
    const { dispatch } = store;

    const state = store.getState();
    const { encaminhamentoAEE } = state;

    const { dadosModalAviso } = encaminhamentoAEE;

    if (!dadosModalAviso) {
      const retorno = await api.get(`${urlPadrao}/instrucoes-modal`);
      if (retorno?.data) {
        dispatch(setDadosModalAviso(retorno.data));
        dispatch(setExibirModalAviso(true));
      } else {
        dispatch(setDadosModalAviso());
        dispatch(setExibirModalAviso(false));
      }
    } else {
      dispatch(setExibirModalAviso(true));
    }
  };

  obterSecoesPorEtapaDeEncaminhamentoAEE = encaminhamentoAeeId => {
    let url = `${urlPadrao}/secoes`;
    if (encaminhamentoAeeId) {
      url += `?encaminhamentoAeeId=${encaminhamentoAeeId}`;
    }
    return api.get(url);
  };

  obterQuestionario = (
    questionarioId,
    encaminhamentoId,
    codigoAluno,
    codigoTurma
  ) => {
    let url = `${urlPadrao}/questionario?questionarioId=${questionarioId}&codigoAluno=${codigoAluno}&codigoTurma=${codigoTurma}`;
    if (encaminhamentoId) {
      url = `${url}&encaminhamentoId=${encaminhamentoId}`;
    }
    return api.get(url);
  };

  obterEncaminhamentoPorId = async encaminhamentoId => {
    const { dispatch } = store;

    dispatch(setExibirLoaderEncaminhamentoAEE(true));

    const resultado = await api
      .get(`${urlPadrao}/${encaminhamentoId}`)
      .catch(e => erros(e));

    if (resultado?.data) {
      const { aluno, turma, responsavelEncaminhamentoAEE } = resultado?.data;

      const dadosObjectCard = {
        ...aluno,
        codigoEOL: aluno.codigoAluno,
        numeroChamada: aluno.numeroAlunoChamada,
        turma: aluno.turmaEscola,
      };

      const retornoFrequencia = await ServicoCalendarios.obterFrequenciaAluno(
        aluno.codigoAluno,
        turma.codigo
      ).catch(e => erros(e));

      dadosObjectCard.frequencia = retornoFrequencia?.data || '';

      dispatch(setDadosObjectCardEstudante(dadosObjectCard));

      const dadosCollapseLocalizarEstudante = {
        anoLetivo: turma.anoLetivo,
        codigoAluno: aluno.codigoAluno,
        codigoTurma: turma.codigo,
        turmaId: turma.id,
      };
      dispatch(
        setDadosCollapseLocalizarEstudante(dadosCollapseLocalizarEstudante)
      );

      const dadosResponsavel = {
        codigoRF: responsavelEncaminhamentoAEE?.rf,
        nomeServidor: responsavelEncaminhamentoAEE?.nome,
        id: responsavelEncaminhamentoAEE?.id,
      };
      dispatch(setDadosCollapseAtribuicaoResponsavel(dadosResponsavel));

      dispatch(setDadosEncaminhamento(resultado?.data));
    } else {
      dispatch(setLimparDadosAtribuicaoResponsavel());
      dispatch(setLimparDadosLocalizarEstudante());
      dispatch(setLimparDadosEncaminhamento());
    }

    dispatch(setExibirLoaderEncaminhamentoAEE(false));
  };

  salvarEncaminhamento = async (
    encaminhamentoId,
    situacao,
    validarCamposObrigatorios,
    enviarEncaminhamento,
    salvarRascunho,
    navigate
  ) => {
    const { dispatch } = store;

    const state = store.getState();
    const {
      questionarioDinamico,
      collapseLocalizarEstudante,
      encaminhamentoAEE,
    } = state;
    const { formsQuestionarioDinamico, arquivoRemovido } = questionarioDinamico;
    const { listaSecoesEmEdicao, dadosSecoesPorEtapaDeEncaminhamentoAEE } =
      encaminhamentoAEE;

    const { dadosCollapseLocalizarEstudante } = collapseLocalizarEstudante;

    let contadorFormsValidos = 0;

    const nomesSecoesComCamposObrigatorios = [];

    const validaAntesDoSubmit = (refForm, secaoId) => {
      let arrayCampos = [];

      const camposValidar = refForm?.state?.values;
      if (camposValidar && Object.keys(camposValidar)?.length) {
        arrayCampos = Object.keys(camposValidar);
      }

      arrayCampos.forEach(campo => {
        refForm.setFieldTouched(campo, true, true);
      });
      return refForm.validateForm().then(() => {
        if (
          refForm.getFormikContext().isValid ||
          Object.keys(refForm.getFormikContext().errors).length === 0
        ) {
          contadorFormsValidos += 1;
        } else {
          const dadosSecao = dadosSecoesPorEtapaDeEncaminhamentoAEE.find(
            secao => secao.id === secaoId
          );
          if (dadosSecao) {
            nomesSecoesComCamposObrigatorios.push(dadosSecao.nome);
          }
        }
      });
    };

    if (formsQuestionarioDinamico?.length) {
      let todosOsFormsEstaoValidos = !validarCamposObrigatorios;

      if (validarCamposObrigatorios) {
        const promises = formsQuestionarioDinamico.map(async item =>
          validaAntesDoSubmit(item.form(), item?.secaoId || 0)
        );

        await Promise.all(promises);

        todosOsFormsEstaoValidos =
          contadorFormsValidos ===
          formsQuestionarioDinamico?.filter(a => a)?.length;
      }

      if (
        listaSecoesEmEdicao?.length === 0 &&
        todosOsFormsEstaoValidos &&
        !enviarEncaminhamento
      ) {
        return true;
      }

      if (todosOsFormsEstaoValidos) {
        let formsParaSalvar = [];
        const enviarSemEditarForms =
          enviarEncaminhamento && listaSecoesEmEdicao?.length === 0;

        if (enviarSemEditarForms) {
          formsParaSalvar = formsQuestionarioDinamico?.filter(
            item => !!item?.secaoId
          );
        } else {
          formsParaSalvar = formsQuestionarioDinamico.filter(f =>
            listaSecoesEmEdicao.find(
              secaoEdicao => secaoEdicao.secaoId === f.secaoId
            )
          );
        }

        const valoresParaSalvar = {
          id: encaminhamentoId || 0,
          turmaId: dadosCollapseLocalizarEstudante.turmaId,
          alunoCodigo: dadosCollapseLocalizarEstudante.codigoAluno.toString(),
          situacao,
        };
        valoresParaSalvar.secoes = formsParaSalvar.map(item => {
          const form = item.form();
          const campos = form.state.values;
          const questoes = [];

          Object.keys(campos).forEach(key => {
            const questaoAtual = QuestionarioDinamicoFuncoes.obterQuestaoPorId(
              item.dadosQuestionarioAtual,
              key
            );

            let questao = {
              questaoId: key,
              tipoQuestao: questaoAtual.tipoQuestao,
            };

            switch (questao.tipoQuestao) {
              case tipoQuestao.AtendimentoClinico:
                questao.resposta = JSON.stringify(campos[key] || '');
                break;
              case tipoQuestao.Upload:
                if (campos[key]?.length) {
                  const arquivosId = campos[key].map(a => a.xhr);
                  questao.resposta = arquivosId;
                } else {
                  questao.resposta = '';
                }
                break;
              case tipoQuestao.ComboMultiplaEscolha:
              case tipoQuestao.ComboMultiplaEscolhaMes:
                if (campos[key]?.length) {
                  questao.resposta = campos[key];
                } else {
                  questao.resposta = '';
                }
                break;
              default:
                questao.resposta = JSON.parse(
                  JSON.stringify(campos[key] || '')
                );
                break;
            }

            if (
              questao.tipoQuestao === tipoQuestao.Upload &&
              questao?.resposta?.length
            ) {
              questao.resposta.forEach(codigo => {
                if (codigo) {
                  if (questaoAtual?.resposta?.length) {
                    const arquivoResposta = questaoAtual.resposta.find(
                      a => a?.arquivo?.codigo === codigo
                    );

                    if (arquivoResposta) {
                      questoes.push({
                        ...questao,
                        resposta: codigo,
                        respostaEncaminhamentoId: arquivoResposta.id,
                      });
                    } else {
                      questoes.push({
                        ...questao,
                        resposta: codigo,
                      });
                    }
                  } else {
                    questoes.push({
                      ...questao,
                      resposta: codigo,
                    });
                  }
                }
              });
            } else if (
              (questao.tipoQuestao === tipoQuestao.ComboMultiplaEscolha ||
                questao.tipoQuestao === tipoQuestao.ComboMultiplaEscolhaMes ||
                questao.tipoQuestao === tipoQuestao.Checkbox) &&
              questao?.resposta?.length
            ) {
              if (!Array.isArray(questao?.resposta))
                questao.resposta = questao.resposta
                  .replace('[', '')
                  .replace(']', '')
                  .split(',')
                  .map(Number);
              questao.resposta.forEach(valorSelecionado => {
                if (valorSelecionado) {
                  if (questaoAtual?.resposta?.length) {
                    const temResposta = questaoAtual.resposta.find(
                      a =>
                        String(a?.opcaoRespostaId) === String(valorSelecionado)
                    );

                    if (temResposta) {
                      questoes.push({
                        ...questao,
                        resposta: valorSelecionado,
                        respostaEncaminhamentoId: temResposta.id,
                      });
                    } else {
                      questoes.push({
                        ...questao,
                        resposta: valorSelecionado,
                      });
                    }
                  } else {
                    questoes.push({
                      ...questao,
                      resposta: valorSelecionado,
                    });
                  }
                }
              });
            } else {
              if (questaoAtual?.resposta[0]?.id) {
                questao.respostaEncaminhamentoId = questaoAtual.resposta[0].id;
              }

              if (
                ((!arquivoRemovido &&
                  questao.tipoQuestao === tipoQuestao.Upload) ||
                  questao.tipoQuestao === tipoQuestao.ComboMultiplaEscolha ||
                  questao.tipoQuestao ===
                    tipoQuestao.ComboMultiplaEscolhaMes) &&
                !questao.resposta
              ) {
                questao = null;
              }

              if (questao) {
                questoes.push(questao);
              }
            }
          });
          return {
            questoes,
            secaoId: item?.secaoId || 0,
            concluido:
              Object.keys(form.getFormikContext().errors)?.length === 0,
          };
        });

        valoresParaSalvar.secoes = valoresParaSalvar.secoes
          .filter(a => a)
          .filter(b => b.questoes?.length);

        if (valoresParaSalvar?.secoes?.length) {
          dispatch(setExibirLoaderEncaminhamentoAEE(true));

          const resposta = await api
            .post(`${urlPadrao}/salvar`, valoresParaSalvar)
            .catch(e => erros(e))
            .finally(() => dispatch(setExibirLoaderEncaminhamentoAEE(false)));

          if (salvarRascunho && resposta?.data?.id) {
            dispatch(setQuestionarioDinamicoEmEdicao(false));
            dispatch(setListaSecoesEmEdicao([]));
            dispatch(setLimparDadosEncaminhamento());
            dispatch(setLimparDadosQuestionarioDinamico());
            dispatch(setLimparDadosLocalizarEstudante());
            dispatch(setLimparDadosAtribuicaoResponsavel());
            navigate(
              `${ROUTES.RELATORIO_AEE_ENCAMINHAMENTO}/editar/${resposta?.data?.id}`
            );
          }

          if (resposta?.status === 200) {
            return true;
          }
        }
      } else {
        if (nomesSecoesComCamposObrigatorios?.length) {
          dispatch(
            setNomesSecoesComCamposObrigatorios(
              nomesSecoesComCamposObrigatorios
            )
          );
        }
        dispatch(setExibirModalErrosEncaminhamento(true));
      }
    }
    return false;
  };

  excluirEncaminhamento = encaminhamentoId => {
    const url = `${urlPadrao}/${encaminhamentoId}`;
    return api.delete(url);
  };

  podeCadastrarEncaminhamentoEstudante = async ({
    estudanteCodigo,
    ueCodigo,
  }) => {
    const resultado = await api
      .get(`${urlPadrao}/estudante/pode-cadastrar`, {
        params: { estudanteCodigo, ueCodigo },
      })
      .catch(e => erros(e));

    if (resultado?.data) {
      return true;
    }
    return false;
  };

  removerArquivo = arquivoCodigo => {
    return api.delete(`${urlPadrao}/arquivo?arquivoCodigo=${arquivoCodigo}`);
  };

  encerramentoEncaminhamentoAEE = (encaminhamentoId, motivoEncerramento) => {
    const parametro = { encaminhamentoId, motivoEncerramento };
    return api.post(`${urlPadrao}/encerrar`, parametro);
  };

  enviarParaAnaliseEncaminhamento = encaminhamentoId => {
    return api.post(`${urlPadrao}/enviar-analise/${encaminhamentoId}`);
  };

  obterResponsaveis = (
    dreId,
    ueId,
    turmaId,
    alunoCodigo,
    situacao,
    anoLetivo,
    exibirEncerrados = false
  ) => {
    let url = `${urlPadrao}/responsaveis?dreId=${dreId}&ueId=${ueId}&anoLetivo=${anoLetivo}&exibirEncerrados=${exibirEncerrados}`;

    if (turmaId) {
      url += `&turmaId=${turmaId}`;
    }
    if (alunoCodigo) {
      url += `&alunoCodigo=${alunoCodigo}`;
    }
    if (situacao) {
      url += `&situacao=${situacao}`;
    }

    return api.get(url);
  };

  atribuirResponsavelEncaminhamento = (rfResponsavel, encaminhamentoId) => {
    const params = {
      rfResponsavel,
      encaminhamentoId,
    };
    return api.post(`${urlPadrao}/atribuir-responsavel`, params);
  };

  concluirEncaminhamento = encaminhamentoId => {
    return api.post(`${urlPadrao}/concluir/${encaminhamentoId}`);
  };

  removerResponsavel = encaminhamentoId => {
    return api.post(`${urlPadrao}/remover-responsavel/${encaminhamentoId}`);
  };

  guardarSecaoEmEdicao = secaoId => {
    const { dispatch } = store;

    const state = store.getState();
    const { encaminhamentoAEE } = state;
    const { listaSecoesEmEdicao } = encaminhamentoAEE;

    if (listaSecoesEmEdicao?.length) {
      const listaNova = [...listaSecoesEmEdicao];
      listaNova.push({ secaoId });
      dispatch(setListaSecoesEmEdicao(listaNova));
    } else {
      dispatch(setListaSecoesEmEdicao([{ secaoId }]));
    }
  };

  devolverEncaminhamentoAEE = params => {
    return api.post(`${urlPadrao}/devolver`, params);
  };

  obterResponsaveisPAAIPesquisa = (codigoTurma, dreCodigo, ehRelatorio) => {
    const params = { limite: 999 };

    if (codigoTurma) {
      params.codigoTurma = codigoTurma;
    }
    if (dreCodigo) {
      params.codigoDRE = dreCodigo;
    }
    if (ehRelatorio) {
      params.ehRelatorio = ehRelatorio;
    }
    return api.post(`${urlPadrao}/responsavel/pesquisa`, params);
  };

  obterResponsaveisPesquisa = (codigoTurma, dreCodigo, ueCodigo) => {
    const params = { limite: 999 };

    if (codigoTurma) {
      params.codigoTurma = codigoTurma;
    }
    if (dreCodigo) {
      params.codigoDRE = dreCodigo;
    }
    if (dreCodigo) {
      params.codigoUE = ueCodigo;
    }
    return api.post(`${urlPadrao}/responsavel-plano/pesquisa`, params);
  };

  gerarRelatorioEncaminhamentoAEE = params =>
    api.post('v1/relatorios/encaminhamento-aee', params);

  gerarRelatorio = params =>
    api.post(`${urlPadrao}/imprimir-detalhado`, params);
}

export default new ServicoEncaminhamentoAEE();
