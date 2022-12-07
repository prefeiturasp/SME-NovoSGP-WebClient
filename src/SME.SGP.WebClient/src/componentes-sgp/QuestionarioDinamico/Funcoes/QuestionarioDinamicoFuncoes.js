import _, { groupBy } from 'lodash';
import tipoQuestao from '~/dtos/tipoQuestao';
import { store } from '~/redux';
import {
  setExibirModalErrosQuestionarioDinamico,
  setFormsQuestionarioDinamico,
  setQuestionarioDinamicoEmEdicao,
  setResetarTabela,
  setNomesSecoesComCamposObrigatorios,
} from '~/redux/modulos/questionarioDinamico/actions';
import { confirmar, erros } from '~/servicos';

class QuestionarioDinamicoFuncoes {
  agruparCamposDuplicados = (data, campo) => {
    if (data?.length) {
      const groups = groupBy(data, campo);
      const results = Object.entries(groups).map(([key, values]) => {
        return { questaoNome: key, questoesDuplicadas: values };
      });

      return results.filter(r => r.questoesDuplicadas.length > 1);
    }
    return [];
  };

  adicionarCampoNovo = (form, idCampoNovo, valor) => {
    const camposEmTela = Object.keys(form.values);

    const campoEstaEmTela = camposEmTela.find(c => c === String(idCampoNovo));

    if (!campoEstaEmTela) {
      form.setFieldValue(idCampoNovo, valor);
      form.values[idCampoNovo] = valor;
    }
  };

  removerCampo = (form, idCampoNovo) => {
    const camposEmTela = Object.keys(form.values);

    const campoEstaEmTela = camposEmTela.find(c => c === String(idCampoNovo));

    if (campoEstaEmTela) {
      delete form.values[idCampoNovo];
      form.unregisterField(idCampoNovo);
    }
  };

  obterTodosCamposComplementares = (valorAtualSelecionado, questaoAtual) => {
    const campos = [];
    valorAtualSelecionado.forEach(a => {
      const opcaoAtual = questaoAtual?.opcaoResposta.find(
        c => String(c.id) === String(a || '')
      );

      if (opcaoAtual?.questoesComplementares?.length) {
        opcaoAtual.questoesComplementares.forEach(questao => {
          const temCampo = campos.find(q => q.id === questao.id);

          if (!temCampo) {
            campos.push(questao);
          }
        });
      }
    });

    return campos;
  };

  adicionarRemoverCamposDuplicados = (
    form,
    camposDuplicados,
    valoresCamposComplemetares
  ) => {
    camposDuplicados.forEach(c => {
      // Na base vai ter somente 2 campos com mesmo nome para essa rotina 1 obrigatório e outro não!
      const campoRemover = c.questoesDuplicadas?.find(co => !co.obrigatorio);
      const campoRenderizar = c.questoesDuplicadas?.find(co => co.obrigatorio);

      const valorCampoRemovido = valoresCamposComplemetares.find(
        valorCampo =>
          valorCampo?.id === campoRemover?.id ||
          valorCampo?.nome === campoRemover?.nome
      );

      if (campoRemover) {
        this.removerCampo(form, campoRemover.id);
      }

      if (campoRenderizar) {
        this.adicionarCampoNovo(
          form,
          campoRenderizar?.id,
          valorCampoRemovido?.valor
        );
      }
    });
  };

  deletarArquivosAoCancelar = (values, funcaoDeletarArquivos) => {
    if (values) {
      const camposEmTela = Object.keys(values);

      camposEmTela.forEach(campo => {
        const valorCampo = values[campo];
        if (valorCampo?.length && Array.isArray(valorCampo)) {
          const arquivosDeletar = valorCampo?.filter(
            c => c?.xhr && !c?.arquivoId
          );
          if (arquivosDeletar?.length) {
            arquivosDeletar.forEach(arquivo => {
              const codigoArquivo = arquivo.xhr;
              if (codigoArquivo) {
                funcaoDeletarArquivos(codigoArquivo).catch(e => erros(e));
              }
            });
          }
        }
      });
    }
  };

  limparDadosOriginaisQuestionarioDinamico = funcaoDeletarArquivos => {
    const { dispatch } = store;
    const state = store.getState();
    const { questionarioDinamico } = state;
    const { formsQuestionarioDinamico } = questionarioDinamico;
    if (formsQuestionarioDinamico?.length) {
      formsQuestionarioDinamico.forEach(item => {
        const form = item.form();
        if (funcaoDeletarArquivos) {
          this.deletarArquivosAoCancelar(
            form?.state?.values,
            funcaoDeletarArquivos
          );
        }
        form.resetForm();
      });
      dispatch(setQuestionarioDinamicoEmEdicao(false));
      dispatch(setResetarTabela(true));
    }
  };

  obterCamposNaoDuplicados = (campos, camposDuplicados) => {
    return campos.filter(ca => {
      const estaDuplicado = camposDuplicados.find(cd =>
        cd.questoesDuplicadas.find(v => v.id === ca.id)
      );

      if (!estaDuplicado) {
        return true;
      }
      return false;
    });
  };

  adicionarCamposNaoDuplicados = (
    form,
    campos,
    camposDuplicados,
    valoresCamposComplemetares
  ) => {
    const camposNaoDuplicados = this.obterCamposNaoDuplicados(
      campos,
      camposDuplicados
    );

    if (camposNaoDuplicados?.length && valoresCamposComplemetares?.length) {
      camposNaoDuplicados.forEach(a => {
        const valorCampoRemovido = valoresCamposComplemetares.find(
          valorCampo => valorCampo?.id === a?.id
        );
        this.adicionarCampoNovo(form, a.id, valorCampoRemovido?.valor);
      });
    }
  };

  obterValoresCamposComplemetares = (
    form,
    questaoAtual,
    valoreAnteriorSelecionado
  ) => {
    const valores = [];
    const camposEmTela = Object.keys(form.values);

    valoreAnteriorSelecionado.forEach(v => {
      const opcaoAtual = questaoAtual?.opcaoResposta.find(
        c => String(c.id) === String(v || '')
      );

      if (opcaoAtual?.questoesComplementares?.length) {
        opcaoAtual.questoesComplementares.forEach(questao => {
          const temCampoEmTela = camposEmTela.find(
            idCampo => idCampo === String(questao.id)
          );

          if (temCampoEmTela) {
            const jaEstaNaLista = valores.find(l => l.id === questao.id);
            if (!jaEstaNaLista) {
              valores.push({
                id: questao.id,
                valor: form.values[questao.id],
                nome: questao.nome.trim(),
              });
            }
          }
        });
      }
    });

    return valores;
  };

  removerTodosCamposComplementares = (
    valoreAnteriorSelecionado,
    questaoAtual,
    form
  ) => {
    valoreAnteriorSelecionado.forEach(id => {
      const opcaoAtual = questaoAtual?.opcaoResposta.find(
        c => String(c.id) === String(id || '')
      );

      if (opcaoAtual?.questoesComplementares?.length) {
        opcaoAtual.questoesComplementares.forEach(questao => {
          this.removerCampo(form, questao.id);
        });
      }
    });
  };

  onChangeCampoCheckboxOuComboMultiplaEscolha = (
    questaoAtual,
    form,
    valorAtualSelecionado
  ) => {
    const valoreAnteriorSelecionado = form.values[questaoAtual.id] || [];

    const valoresCamposComplemetares = this.obterValoresCamposComplemetares(
      form,
      questaoAtual,
      valoreAnteriorSelecionado
    );

    if (valoreAnteriorSelecionado?.length) {
      this.removerTodosCamposComplementares(
        valoreAnteriorSelecionado,
        questaoAtual,
        form
      );
    }

    const todosCamposComplementares = this.obterTodosCamposComplementares(
      valorAtualSelecionado,
      questaoAtual
    );

    const camposSemEspaco = todosCamposComplementares.map(m => {
      return { ...m, nome: m.nome.trim() };
    });

    const camposDuplicados = this.agruparCamposDuplicados(
      camposSemEspaco,
      'id'
    );

    if (camposDuplicados?.length) {
      this.adicionarRemoverCamposDuplicados(
        form,
        camposDuplicados,
        valoresCamposComplemetares
      );
    }

    if (camposSemEspaco?.length && camposDuplicados?.length) {
      this.adicionarCamposNaoDuplicados(
        form,
        camposSemEspaco,
        camposDuplicados
      );
    } else {
      camposSemEspaco.forEach(a => {
        const valorCampoRemovido = valoresCamposComplemetares.find(
          valorCampo => valorCampo?.id === a?.id || valorCampo?.nome === a?.nome
        );

        this.adicionarCampoNovo(form, a.id, valorCampoRemovido?.valor);
      });
    }
  };

  onChangeCamposComOpcaoResposta = (
    questaoAtual,
    form,
    valorAtualSelecionado
  ) => {
    const valorAnteriorSelecionado = form.values[questaoAtual.id] || '';

    const valoresCamposComplemetares = this.obterValoresCamposComplemetares(
      form,
      questaoAtual,
      [valorAnteriorSelecionado]
    );

    const opcaoAtual = questaoAtual?.opcaoResposta.find(
      c => String(c.id) === String(valorAtualSelecionado || '')
    );

    const opcaoAnterior = questaoAtual?.opcaoResposta.find(
      c => String(c.id) === String(valorAnteriorSelecionado || '')
    );

    const idsQuestoesComplementaresAnterior = opcaoAnterior?.questoesComplementares.map(
      q => q.id
    );

    const idsQuestoesComplementaresAtual = opcaoAtual?.questoesComplementares.map(
      q => q.id
    );

    const idsQuestoesExclusao = idsQuestoesComplementaresAnterior?.filter(
      idComplentar => {
        if (!idsQuestoesComplementaresAtual?.includes(idComplentar)) {
          return true;
        }
        return false;
      }
    );

    if (idsQuestoesExclusao?.length) {
      idsQuestoesExclusao.forEach(id => {
        delete form.values[id];
        form.unregisterField(id);
      });
    }

    const idsQuestoesAdicionar = idsQuestoesComplementaresAtual?.filter(
      idComplentar => {
        if (!idsQuestoesComplementaresAnterior?.includes(idComplentar)) {
          return true;
        }
        return false;
      }
    );

    if (idsQuestoesAdicionar?.length) {
      idsQuestoesAdicionar.forEach(id => {
        const qAtual = opcaoAtual.questoesComplementares.find(q => q.id === id);

        const valorCampoRemovido = valoresCamposComplemetares.find(
          valorCampo =>
            valorCampo?.id === id || valorCampo?.nome === qAtual?.nome
        );

        form.setFieldValue(id, valorCampoRemovido?.valor || '');
        form.values[id] = valorCampoRemovido?.valor || '';
      });
    }
  };

  obterOpcaoRespostaPorId = (opcoesResposta, idComparacao) => {
    if (opcoesResposta?.length) {
      const opcaoResposta = opcoesResposta.find(
        item => String(item.id) === String(idComparacao)
      );
      return opcaoResposta;
    }
    return null;
  };

  obterQuestaoPorId = (dados, idPesquisa) => {
    let questaoAtual = '';

    const obterQuestao = item => {
      if (!questaoAtual) {
        if (String(item.id) === String(idPesquisa)) {
          questaoAtual = item;
        } else if (item?.opcaoResposta?.length) {
          item.opcaoResposta.forEach(opcaoResposta => {
            if (opcaoResposta?.questoesComplementares?.length) {
              opcaoResposta.questoesComplementares.forEach(questao => {
                obterQuestao(questao);
              });
            }
          });
        }
      }
    };

    dados.forEach(item => {
      obterQuestao(item);
    });

    return questaoAtual;
  };

  adicionarFormsQuestionarioDinamico = (
    obterForm,
    questionarioId,
    dadosQuestionarioAtual,
    secaoId
  ) => {
    const { dispatch } = store;
    const state = store.getState();
    const { questionarioDinamico } = state;
    const { formsQuestionarioDinamico } = questionarioDinamico;
    // TODO Usado o questionarioId para setar o indice do arra.
    // Caso trocar para push no array de form, validar se vai duplicar os forms!
    if (!formsQuestionarioDinamico) {
      const param = [];
      param[questionarioId] = {
        form: obterForm,
        dadosQuestionarioAtual,
        secaoId,
      };
      dispatch(setFormsQuestionarioDinamico(param));
    } else if (formsQuestionarioDinamico?.length) {
      const param = formsQuestionarioDinamico;
      param[questionarioId] = {
        form: obterForm,
        dadosQuestionarioAtual,
        secaoId,
      };
      dispatch(setFormsQuestionarioDinamico(param));
    }
  };

  obterListaDiasSemana = () => {
    return [
      {
        valor: 'Domingo',
        desc: 'Domingo',
        ordem: 1,
      },
      {
        valor: 'Segunda',
        desc: 'Segunda',
        ordem: 2,
      },
      {
        valor: 'Terça',
        desc: 'Terça',
        ordem: 3,
      },
      {
        valor: 'Quarta',
        desc: 'Quarta',
        ordem: 4,
      },
      {
        valor: 'Quinta',
        desc: 'Quinta',
        ordem: 5,
      },
      {
        valor: 'Sexta',
        desc: 'Sexta',
        ordem: 6,
      },
      {
        valor: 'Sábado',
        desc: 'Sábado',
        ordem: 7,
      },
    ];
  };

  ordenarDiasDaSemana = diasDaSemanaAtual => {
    const listaOrdenada = [];

    const diasDaSemana = this.obterListaDiasSemana();

    diasDaSemana.forEach(dia => {
      const temEssesDias = diasDaSemanaAtual.filter(
        item => item.diaSemana === dia.valor
      );
      if (temEssesDias?.length) {
        temEssesDias.forEach(d => {
          listaOrdenada.push(d);
        });
      }
    });
    return listaOrdenada;
  };

  exibirModalCamposInvalidos = secoesInvalidas => {
    if (secoesInvalidas?.length) {
      const { dispatch } = store;
      dispatch(setNomesSecoesComCamposObrigatorios(secoesInvalidas));
      dispatch(setExibirModalErrosQuestionarioDinamico(true));
    }
  };

  mapearQuestionarios = async (
    listaSecoesEmEdicao,
    dadosSecoes,
    validarCamposObrigatorios,
    secoesComCamposObrigatorios
  ) => {
    const state = store.getState();
    const { questionarioDinamico } = state;
    const { formsQuestionarioDinamico, arquivoRemovido } = questionarioDinamico;

    let contadorFormsValidos = 0;
    const nomesSecoesComCamposObrigatorios = secoesComCamposObrigatorios?.length
      ? secoesComCamposObrigatorios
      : [];

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
          const dadosSecao = dadosSecoes.find(secao => secao.id === secaoId);

          if (dadosSecao) {
            const naoEstaNaLista = nomesSecoesComCamposObrigatorios.find(
              nome => nome !== dadosSecao.nome
            );
            if (naoEstaNaLista) {
              nomesSecoesComCamposObrigatorios.push(dadosSecao.nome);
            }
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

      if (todosOsFormsEstaoValidos) {
        let formsParaSalvar = [];

        formsParaSalvar = formsQuestionarioDinamico.filter(f =>
          listaSecoesEmEdicao.find(
            secaoEdicao => secaoEdicao.secaoId === f.secaoId
          )
        );

        const valoresParaSalvar = {};

        valoresParaSalvar.secoes = formsParaSalvar.map(item => {
          const form = item.form();
          const campos = form.state.values;
          const questoes = [];

          Object.keys(campos).forEach(key => {
            const questaoAtual = this.obterQuestaoPorId(
              item.dadosQuestionarioAtual,
              key
            );

            let questao = {
              questaoId: key,
              tipoQuestao: questaoAtual.tipoQuestao,
            };

            switch (questao.tipoQuestao) {
              case tipoQuestao.AtendimentoClinico:
              case tipoQuestao.AtividadesContraturno:
              case tipoQuestao.Endereco:
              case tipoQuestao.ContatoResponsaveis:
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
                  questao.tipoQuestao === tipoQuestao.ComboMultiplaEscolha) &&
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

        return valoresParaSalvar;
      }
    }

    this.exibirModalCamposInvalidos(nomesSecoesComCamposObrigatorios);
    return { formsInvalidos: !nomesSecoesComCamposObrigatorios?.length };
  };

  pegarTipoQuestao = tipoQuestaoValor => {
    switch (tipoQuestaoValor) {
      case tipoQuestao.Frase:
      case tipoQuestao.Numerico:
        return 'INPUT';
      case tipoQuestao.Texto:
        return 'TEXT_AREA';
      case tipoQuestao.Radio:
        return 'RADIO';
      case tipoQuestao.Combo:
      case tipoQuestao.ComboMultiplaEscolha:
      case tipoQuestao.PeriodoEscolar:
        return 'SELECT';
      case tipoQuestao.Checkbox:
        return 'CHECKBOX';
      case tipoQuestao.Upload:
        return 'UPLOAD';
      case tipoQuestao.InformacoesEscolares:
      case tipoQuestao.AtendimentoClinico:
      case tipoQuestao.FrequenciaEstudanteAEE:
      case tipoQuestao.Endereco:
      case tipoQuestao.ContatoResponsaveis:
      case tipoQuestao.AtividadesContraturno:
        return 'TABLE';
      case tipoQuestao.Periodo:
      case tipoQuestao.Data:
        return 'DATE';
      case tipoQuestao.EditorTexto:
        return 'JODIT_EDITOR';
      default:
        return '';
    }
  };

  gerarId = (prefixId, dadosQuestao) => {
    const temPrefixIdENomeComponente = prefixId && dadosQuestao?.nomeComponente;
    const tipoQuestaoNome = this.pegarTipoQuestao(dadosQuestao?.tipoQuestao);

    return temPrefixIdENomeComponente
      ? `${prefixId}_${tipoQuestaoNome}_${dadosQuestao?.nomeComponente}`
      : dadosQuestao?.id;
  };

  removerLinhaTabela = async (
    e,
    form,
    questaoAtual,
    linha,
    onChange,
    disabled
  ) => {
    e.stopPropagation();

    if (!disabled) {
      const confirmado = await confirmar(
        'Excluir',
        '',
        'Você tem certeza que deseja excluir este registro?'
      );

      if (confirmado) {
        const dadosAtuais = form?.values?.[questaoAtual.id]?.length
          ? form?.values?.[questaoAtual.id]
          : [];

        const novoMap = _.cloneDeep(dadosAtuais);

        const indice = novoMap.findIndex(item => item.id === linha.id);
        if (indice !== -1) {
          novoMap.splice(indice, 1);
          form.setFieldValue(questaoAtual.id, novoMap);
          onChange();
        }
      }
    }
  };

  adicionarLinhaTabela = (form, questaoAtual, novosDados, onChange) => {
    const dadosAtuais = form?.values?.[questaoAtual.id]?.length
      ? form?.values?.[questaoAtual.id]
      : [];
    const novoMap = _.cloneDeep(dadosAtuais);

    if (novosDados?.id) {
      const indexItemAnterior = novoMap.findIndex(x => x.id === novosDados.id);
      novoMap[indexItemAnterior] = novosDados;
    } else {
      novosDados.id = novoMap.length + 1;
      novoMap.push(novosDados);
    }
    if (form) {
      form.setFieldValue(questaoAtual.id, novoMap);
      onChange();
    }
  };
}

export default new QuestionarioDinamicoFuncoes();
