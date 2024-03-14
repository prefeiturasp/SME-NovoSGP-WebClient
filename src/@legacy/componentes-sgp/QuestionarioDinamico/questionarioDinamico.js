import { Form, Formik } from 'formik';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Label } from '~/componentes';
import tipoQuestao from '~/dtos/tipoQuestao';
import AtendimentoClinicoTabela from './Componentes/AtendimentoClinico/atendimentoClinicoTabela';
import { setQuestionarioDinamicoEmEdicao } from '~/redux/modulos/questionarioDinamico/actions';
import CampoDinamicoFrase from './Componentes/campoDinamicoFrase';
import CampoDinamicoTexto from './Componentes/campoDinamicoTexto';
import CampoDinamicoRadio from './Componentes/campoDinamicoRadio';
import CampoDinamicoCombo from './Componentes/campoDinamicoCombo';
import CampoDinamicoComboMultiplaEscolha from './Componentes/campoDinamicoComboMultiplaEscolha';
import CampoDinamicoCheckbox from './Componentes/campoDinamicoCheckbox';
import CampoDinamicoUploadArquivos from './Componentes/campoDinamicoUploadArquivos';
import InformacoesEscolares from './Componentes/InformacoesEscolares/informacoesEscolares';
import QuestionarioDinamicoFuncoes from './Funcoes/QuestionarioDinamicoFuncoes';
import QuestionarioDinamicoValidacoes from './Validacoes/QuestionarioDinamicoValidacoes';
import DiasHorariosTabela from './Componentes/DiasHorariosTabela/diasHorariosTabela';
import CampoDinamicoPeriodo from './Componentes/campoDinamicoPeriodo';
import CampoDinamicoPeriodoEscolar from './Componentes/campoDinamicoPeriodoEscolar';
import CampoDinamicoNumerico from './Componentes/campoDinamicoNumerico';
import CampoDinamicoData from './Componentes/campoDinamicoData';
import EnderecoResidencialTabela from './Componentes/EnderecoResidencial/enderecoResidencialTabela';
import ContatoResponsaveisTabela from './Componentes/ContatoResponsaveis/contatoResponsaveisTabela';
import AtividadeContraturnoTabela from './Componentes/AtividadeContraturno/atividadeContraturnoTabela';
import CampoDinamicoEditor from './Componentes/campoDinamicoEditor';
import InformacoesSrmTabela from './Componentes/InformacoesSrm/InformacoesSrmTabela';
import TurmasProgramaTabela from './Componentes/TurmasPrograma/turmasProgramaTabela';
import TabelaFrequenciaTurmaPAP from './Componentes/TabelaFrequenciaTurmaPAP/TabelaFrequenciaTurmaPAP';
import CampoDinamicoProfissionaisEnvolvidos from './Componentes/campoDinamicoProfissionaisEnvolvidos';

const QuestionarioDinamico = props => {
  const dispatch = useDispatch();

  const {
    dados,
    dadosQuestionarioAtual,
    desabilitarCampos,
    codigoAluno,
    codigoTurma,
    anoLetivo,
    urlUpload,
    funcaoRemoverArquivoCampoUpload,
    onChangeQuestionario,
    turmaId,
    versaoPlano,
    prefixId,
    exibirOrdemLabel,
    validarCampoObrigatorioCustomizado,
    montarComboMultiplaEscolhaComplementarComResposta, // Na base vai ter somente 2 campos com mesmo nome para essa rotina 1 obrigatório e outro não!
    exibirLabel,
    exibirCampoSemValor,
    codigoDre,
  } = props;

  const [valoresIniciais, setValoresIniciais] = useState();

  const [refForm, setRefForm] = useState({});

  const obterForm = () => refForm;

  useEffect(() => {
    if (refForm) {
      QuestionarioDinamicoFuncoes.adicionarFormsQuestionarioDinamico(
        () => obterForm(),
        dados.questionarioId,
        dadosQuestionarioAtual,
        dados?.id
      );
    }
  }, [refForm]);

  const montarValoresIniciais = useCallback(() => {
    const valores = {};
    const montarDados = questaoAtual => {
      const resposta = questaoAtual?.resposta;

      let valorRespostaAtual = '';

      if (resposta?.length) {
        switch (questaoAtual?.tipoQuestao) {
          case tipoQuestao.Radio:
            valorRespostaAtual = resposta[0].opcaoRespostaId;
            break;
          case tipoQuestao.Combo:
            valorRespostaAtual = String(resposta[0].opcaoRespostaId || '');
            break;
          case tipoQuestao.ComboMultiplaEscolha:
          case tipoQuestao.ComboMultiplaEscolhaMes:
            valorRespostaAtual = resposta.map(r => String(r.opcaoRespostaId));
            break;
          case tipoQuestao.Checkbox:
            valorRespostaAtual = resposta.map(r => Number(r.opcaoRespostaId));
            break;
          case tipoQuestao.Texto:
          case tipoQuestao.Frase:
          case tipoQuestao.Numerico:
          case tipoQuestao.PeriodoEscolar:
          case tipoQuestao.EditorTexto:
            valorRespostaAtual = resposta[0].texto;
            break;
          case tipoQuestao.Data:
            valorRespostaAtual = resposta[0].texto
              ? moment(resposta[0].texto)
              : '';
            break;
          case tipoQuestao.Periodo:
            valorRespostaAtual = {
              periodoInicio: moment(resposta[0].periodoInicio),
              periodoFim: moment(resposta[0].periodoFim),
            };
            break;
          case tipoQuestao.FrequenciaEstudanteAEE:
          case tipoQuestao.AtendimentoClinico:
          case tipoQuestao.AtividadesContraturno:
          case tipoQuestao.Endereco:
          case tipoQuestao.ContatoResponsaveis:
          case tipoQuestao.TurmasPrograma:
          case tipoQuestao.InformacoesSrm:
          case tipoQuestao.InformacoesFrequenciaTurmaPAP:
          case tipoQuestao.ProfissionaisEnvolvidos:
            valorRespostaAtual = resposta[0].texto
              ? JSON.parse(resposta[0].texto)
              : '';
            break;
          case tipoQuestao.Upload:
            if (resposta?.length) {
              valorRespostaAtual = resposta
                ?.map(item => {
                  const { arquivo } = item;
                  if (arquivo) {
                    return {
                      uid: arquivo.codigo,
                      xhr: arquivo.codigo,
                      name: arquivo.nome,
                      status: 'done',
                      arquivoId: arquivo.id,
                    };
                  }
                  return '';
                })
                .filter(a => !!a);
            } else {
              valorRespostaAtual = [];
            }
            break;
          default:
            break;
        }
      }

      if (
        valorRespostaAtual?.length &&
        (questaoAtual?.tipoQuestao === tipoQuestao.ComboMultiplaEscolha ||
          questaoAtual?.tipoQuestao === tipoQuestao.ComboMultiplaEscolhaMes ||
          questaoAtual?.tipoQuestao === tipoQuestao.Checkbox)
      ) {
        const idsQuestoesComplementares = valorRespostaAtual.filter(
          valorSalvo => {
            const opcaoResposta = questaoAtual?.opcaoResposta.find(
              q => String(q.id) === String(valorSalvo)
            );

            const montarCampo =
              montarComboMultiplaEscolhaComplementarComResposta
                ? opcaoResposta?.questoesComplementares?.find(
                    q => q.resposta?.length
                  )
                : opcaoResposta?.questoesComplementares?.length;

            return !!montarCampo;
          }
        );

        if (idsQuestoesComplementares?.length) {
          idsQuestoesComplementares.forEach(idQuestao => {
            const questaoComplmentarComResposta =
              questaoAtual?.opcaoResposta.find(
                q => String(q.id) === String(idQuestao)
              );

            if (questaoComplmentarComResposta?.questoesComplementares?.length) {
              questaoComplmentarComResposta.questoesComplementares.forEach(
                questao => {
                  montarDados(questao);
                }
              );
            }
          });
        }
      } else if (
        valorRespostaAtual &&
        questaoAtual?.tipoQuestao !== tipoQuestao.Upload &&
        questaoAtual?.tipoQuestao !== tipoQuestao.Texto
      ) {
        const opcaoAtual = questaoAtual?.opcaoResposta.find(
          item => String(item.id) === String(valorRespostaAtual)
        );

        if (opcaoAtual?.questoesComplementares?.length) {
          opcaoAtual.questoesComplementares.forEach(q => {
            montarDados(q);
          });
        }
      }

      if (
        !valorRespostaAtual &&
        questaoAtual?.tipoQuestao === tipoQuestao.Periodo
      ) {
        valores[questaoAtual.id] = {};
      } else {
        valores[questaoAtual.id] = valorRespostaAtual;
      }
    };

    dadosQuestionarioAtual.forEach(questaoAtual => {
      montarDados(questaoAtual);
    });

    setValoresIniciais({ ...valores });
  }, [
    dadosQuestionarioAtual,
    montarComboMultiplaEscolhaComplementarComResposta,
  ]);

  useEffect(() => {
    if (dadosQuestionarioAtual?.length) {
      montarValoresIniciais();
    }
  }, [dadosQuestionarioAtual, montarValoresIniciais]);

  const campoAtendimentoClinico = params => {
    const { questaoAtual, label, form } = params;

    return (
      <div className="col-md-12 mb-3">
        <AtendimentoClinicoTabela
          desabilitado={desabilitarCampos}
          label={label}
          form={form}
          questaoAtual={questaoAtual}
          onChange={() => {
            dispatch(setQuestionarioDinamicoEmEdicao(true));
            onChangeQuestionario();
          }}
        />
      </div>
    );
  };

  const labelPersonalizado = (textolabel, observacaoText, obrigatorio) => (
    <Label
      text={textolabel}
      observacaoText={observacaoText}
      isRequired={obrigatorio}
    />
  );

  const montarCampos = (questaoAtual, form, ordemAnterior, ordemSequencial) => {
    const valorAtualSelecionado = form.values[questaoAtual.id];

    if (!exibirCampoSemValor) {
      if (
        (questaoAtual?.tipoQuestao === tipoQuestao.Texto ||
          questaoAtual?.tipoQuestao === tipoQuestao.EditorTexto) &&
        !valorAtualSelecionado
      )
        return <></>;
    }

    const campoQuestaoComplementar = [];

    const montarCampoComplementarPadrao = (vAtual, label, ordemSeq) => {
      const opcaoResposta = QuestionarioDinamicoFuncoes.obterOpcaoRespostaPorId(
        questaoAtual?.opcaoResposta,
        vAtual
      );

      if (opcaoResposta?.questoesComplementares?.length) {
        opcaoResposta.questoesComplementares.forEach(q => {
          campoQuestaoComplementar.push(montarCampos(q, form, label, ordemSeq));
        });
      }
    };

    const ordemLabel = ordemAnterior
      ? `${ordemAnterior}.${ordemSequencial || questaoAtual.ordem}`
      : questaoAtual.ordem;

    let textoLabel = '';
    let label = '';

    if (exibirLabel) {
      if (exibirOrdemLabel) {
        textoLabel = questaoAtual?.nome
          ? `${ordemLabel} - ${questaoAtual.nome}`
          : '';
      } else {
        textoLabel = questaoAtual.nome;
      }

      label = labelPersonalizado(
        textoLabel,
        questaoAtual?.observacao,
        validarCampoObrigatorioCustomizado
          ? validarCampoObrigatorioCustomizado(questaoAtual, form.values)
          : questaoAtual?.obrigatorio
      );
    }

    if (
      questaoAtual?.tipoQuestao === tipoQuestao.ComboMultiplaEscolha ||
      questaoAtual?.tipoQuestao === tipoQuestao.Checkbox
    ) {
      if (valorAtualSelecionado?.length) {
        const listaCamposRenderizar = [];

        const todosCamposComplementares =
          QuestionarioDinamicoFuncoes.obterTodosCamposComplementares(
            valorAtualSelecionado,
            questaoAtual
          );

        const camposSemEspaco = todosCamposComplementares.map(m => {
          return { ...m, nome: m.nome.trim() };
        });

        const camposDuplicados =
          QuestionarioDinamicoFuncoes.agruparCamposDuplicados(
            camposSemEspaco,
            'nome'
          );

        if (camposDuplicados?.length) {
          camposDuplicados.forEach(c => {
            // Na base vai ter somente 2 campos com mesmo nome para essa rotina 1 obrigatório e outro não!
            const campoRenderizar = c.questoesDuplicadas?.find(
              co => co.obrigatorio
            );

            if (campoRenderizar) {
              listaCamposRenderizar.push(campoRenderizar);
            }
          });
        }

        if (camposSemEspaco?.length && camposDuplicados?.length) {
          const camposNaoDuplicados =
            QuestionarioDinamicoFuncoes.obterCamposNaoDuplicados(
              camposSemEspaco,
              camposDuplicados
            );
          if (camposNaoDuplicados?.length) {
            camposNaoDuplicados.forEach(c => {
              listaCamposRenderizar.push(c);
            });
          }
        } else {
          camposSemEspaco.forEach(c => {
            listaCamposRenderizar.push(c);
          });
        }

        listaCamposRenderizar.forEach(q => {
          campoQuestaoComplementar.push(montarCampos(q, form, ordemLabel));
        });
      }
    } else if (valorAtualSelecionado) {
      montarCampoComplementarPadrao(valorAtualSelecionado, ordemLabel);
    }

    const params = {
      form,
      label,
      prefixId,
      questaoAtual,
    };

    let campoAtual = null;
    switch (questaoAtual?.tipoQuestao) {
      case tipoQuestao.Frase:
        campoAtual = (
          <CampoDinamicoFrase
            {...params}
            disabled={desabilitarCampos}
            onChange={() => {
              dispatch(setQuestionarioDinamicoEmEdicao(true));
              onChangeQuestionario();
            }}
          />
        );
        break;
      case tipoQuestao.Texto:
        campoAtual = (
          <CampoDinamicoTexto
            {...params}
            desabilitado={desabilitarCampos}
            onChange={() => {
              dispatch(setQuestionarioDinamicoEmEdicao(true));
              onChangeQuestionario();
            }}
          />
        );
        break;
      case tipoQuestao.Radio:
        campoAtual = (
          <CampoDinamicoRadio
            {...params}
            desabilitado={desabilitarCampos}
            onChange={valorAtual => {
              QuestionarioDinamicoFuncoes.onChangeCamposComOpcaoResposta(
                questaoAtual,
                form,
                valorAtual
              );
              dispatch(setQuestionarioDinamicoEmEdicao(true));
              onChangeQuestionario();
            }}
          />
        );
        break;
      case tipoQuestao.Combo:
        campoAtual = (
          <CampoDinamicoCombo
            {...params}
            desabilitado={desabilitarCampos}
            onChange={valorAtual => {
              QuestionarioDinamicoFuncoes.onChangeCamposComOpcaoResposta(
                questaoAtual,
                form,
                valorAtual
              );
              dispatch(setQuestionarioDinamicoEmEdicao(true));
              onChangeQuestionario();
            }}
          />
        );
        break;
      case tipoQuestao.Checkbox:
        campoAtual = (
          <CampoDinamicoCheckbox
            {...params}
            desabilitado={desabilitarCampos}
            onChange={valorAtual => {
              QuestionarioDinamicoFuncoes.onChangeCampoCheckboxOuComboMultiplaEscolha(
                questaoAtual,
                form,
                valorAtual
              );
              dispatch(setQuestionarioDinamicoEmEdicao(true));
              onChangeQuestionario();
            }}
          />
        );
        break;
      case tipoQuestao.Upload:
        campoAtual = (
          <CampoDinamicoUploadArquivos
            dados={params}
            desabilitado={desabilitarCampos}
            urlUpload={urlUpload}
            funcaoRemoverArquivoCampoUpload={funcaoRemoverArquivoCampoUpload}
            onChange={() => {
              dispatch(setQuestionarioDinamicoEmEdicao(true));
              onChangeQuestionario();
            }}
          />
        );
        break;
      case tipoQuestao.InformacoesEscolares:
        campoAtual = (
          <InformacoesEscolares
            {...params}
            codigoAluno={codigoAluno}
            codigoTurma={codigoTurma}
            anoLetivo={anoLetivo}
          />
        );
        break;
      case tipoQuestao.AtendimentoClinico:
        campoAtual = campoAtendimentoClinico(params);
        break;
      case tipoQuestao.ComboMultiplaEscolha:
      case tipoQuestao.ComboMultiplaEscolhaMes:
        campoAtual = (
          <CampoDinamicoComboMultiplaEscolha
            {...params}
            desabilitado={desabilitarCampos}
            onChange={valoresSelecionados => {
              QuestionarioDinamicoFuncoes.onChangeCampoCheckboxOuComboMultiplaEscolha(
                questaoAtual,
                form,
                valoresSelecionados
              );
              dispatch(setQuestionarioDinamicoEmEdicao(true));
              onChangeQuestionario();
            }}
          />
        );
        break;
      case tipoQuestao.Periodo:
        campoAtual = (
          <CampoDinamicoPeriodo
            {...params}
            desabilitado={desabilitarCampos}
            onChange={() => {
              dispatch(setQuestionarioDinamicoEmEdicao(true));
              onChangeQuestionario();
            }}
          />
        );
        break;
      case tipoQuestao.FrequenciaEstudanteAEE:
        campoAtual = (
          <DiasHorariosTabela
            desabilitado={desabilitarCampos}
            {...params}
            onChange={() => {
              dispatch(setQuestionarioDinamicoEmEdicao(true));
              onChangeQuestionario();
            }}
          />
        );
        break;
      case tipoQuestao.PeriodoEscolar:
        campoAtual = (
          <CampoDinamicoPeriodoEscolar
            {...params}
            desabilitado={desabilitarCampos}
            onChange={() => {
              dispatch(setQuestionarioDinamicoEmEdicao(true));
              onChangeQuestionario();
            }}
            turmaId={turmaId}
            questionarioId={dados?.questionarioId}
            versaoPlano={versaoPlano}
          />
        );
        break;
      case tipoQuestao.Numerico:
        campoAtual = (
          <CampoDinamicoNumerico
            {...params}
            disabled={desabilitarCampos}
            onChange={() => {
              dispatch(setQuestionarioDinamicoEmEdicao(true));
              onChangeQuestionario();
            }}
          />
        );
        break;
      case tipoQuestao.Data:
        campoAtual = (
          <CampoDinamicoData
            {...params}
            disabled={desabilitarCampos}
            onChange={() => {
              dispatch(setQuestionarioDinamicoEmEdicao(true));
              onChangeQuestionario();
            }}
          />
        );
        break;
      case tipoQuestao.Endereco:
        campoAtual = (
          <EnderecoResidencialTabela
            {...params}
            label={label?.props?.text}
            disabled={desabilitarCampos}
            onChange={() => {
              dispatch(setQuestionarioDinamicoEmEdicao(true));
              onChangeQuestionario();
            }}
          />
        );
        break;
      case tipoQuestao.ContatoResponsaveis:
        campoAtual = (
          <ContatoResponsaveisTabela
            {...params}
            label={label?.props?.text}
            disabled={desabilitarCampos}
            onChange={() => {
              dispatch(setQuestionarioDinamicoEmEdicao(true));
              onChangeQuestionario();
            }}
          />
        );
        break;
      case tipoQuestao.AtividadesContraturno:
        campoAtual = (
          <AtividadeContraturnoTabela
            {...params}
            label={label?.props?.text}
            disabled={desabilitarCampos}
            onChange={() => {
              dispatch(setQuestionarioDinamicoEmEdicao(true));
              onChangeQuestionario();
            }}
          />
        );
        break;
      case tipoQuestao.EditorTexto:
        campoAtual = (
          <CampoDinamicoEditor
            {...params}
            desabilitado={desabilitarCampos}
            onChange={() => {
              dispatch(setQuestionarioDinamicoEmEdicao(true));
              onChangeQuestionario();
            }}
          />
        );
        break;
      case tipoQuestao.TurmasPrograma:
        campoAtual = (
          <TurmasProgramaTabela
            {...params}
            label={label?.props?.text}
            desabilitado={desabilitarCampos}
            onChange={() => {
              dispatch(setQuestionarioDinamicoEmEdicao(true));
              onChangeQuestionario();
            }}
          />
        );
        break;
      case tipoQuestao.InformacoesSrm:
        campoAtual = (
          <InformacoesSrmTabela
            {...params}
            label={label?.props?.text}
            disabled={desabilitarCampos}
            onChange={() => {
              dispatch(setQuestionarioDinamicoEmEdicao(true));
              onChangeQuestionario();
            }}
          />
        );
        break;
      case tipoQuestao.InformacoesFrequenciaTurmaPAP:
        campoAtual = (
          <TabelaFrequenciaTurmaPAP {...params} label={label?.props?.text} />
        );
        break;
      case tipoQuestao.ProfissionaisEnvolvidos:
        campoAtual = (
          <CampoDinamicoProfissionaisEnvolvidos
            {...params}
            codigoDre={codigoDre}
            desabilitado={desabilitarCampos}
            onChange={valoresSelecionados => {
              QuestionarioDinamicoFuncoes.onChangeCampoCheckboxOuComboMultiplaEscolha(
                questaoAtual,
                form,
                valoresSelecionados
              );
              dispatch(setQuestionarioDinamicoEmEdicao(true));
              onChangeQuestionario();
            }}
          />
        );
        break;
      default:
        break;
    }

    return (
      <React.Fragment key={`campo-${questaoAtual?.id}`}>
        {campoAtual || ''}
        {campoQuestaoComplementar?.length ? campoQuestaoComplementar : ''}
      </React.Fragment>
    );
  };

  const montarQuestionarioAtual = (data, form) => {
    const campos = data.map(questaoAtual => {
      return (
        <React.Fragment key={questaoAtual.id}>
          {montarCampos(questaoAtual, form, '')}
        </React.Fragment>
      );
    });

    return campos;
  };

  return dados?.questionarioId > -1 &&
    dadosQuestionarioAtual?.length &&
    valoresIniciais ? (
    <Formik
      enableReinitialize
      initialValues={valoresIniciais}
      validationSchema={() =>
        QuestionarioDinamicoValidacoes.obterValidationSchema(
          dadosQuestionarioAtual,
          refForm,
          validarCampoObrigatorioCustomizado
        )
      }
      validateOnChange
      validateOnBlur
      ref={refFormik => setRefForm(refFormik)}
    >
      {form => (
        <Form>
          <div className="row">
            {montarQuestionarioAtual(dadosQuestionarioAtual, form)}
          </div>
        </Form>
      )}
    </Formik>
  ) : (
    ''
  );
};

QuestionarioDinamico.propTypes = {
  dados: PropTypes.oneOfType([PropTypes.object]),
  dadosQuestionarioAtual: PropTypes.oneOfType([PropTypes.any]),
  desabilitarCampos: PropTypes.bool,
  codigoAluno: PropTypes.oneOfType([PropTypes.any]),
  codigoTurma: PropTypes.oneOfType([PropTypes.any]),
  anoLetivo: PropTypes.oneOfType([PropTypes.any]),
  urlUpload: PropTypes.string,
  funcaoRemoverArquivoCampoUpload: PropTypes.func,
  onChangeQuestionario: PropTypes.func,
  turmaId: PropTypes.oneOfType([PropTypes.any]),
  prefixId: PropTypes.string,
  exibirOrdemLabel: PropTypes.bool,
  validarCampoObrigatorioCustomizado: PropTypes.oneOfType([PropTypes.any]),
  montarComboMultiplaEscolhaComplementarComResposta: PropTypes.bool,
  exibirLabel: PropTypes.bool,
  exibirCampoSemValor: PropTypes.bool,
  codigoDre: PropTypes.oneOfType([PropTypes.any]),
};

QuestionarioDinamico.defaultProps = {
  dados: {},
  dadosQuestionarioAtual: {},
  desabilitarCampos: false,
  codigoAluno: '',
  codigoTurma: '',
  anoLetivo: null,
  urlUpload: '',
  funcaoRemoverArquivoCampoUpload: () => {},
  onChangeQuestionario: () => {},
  turmaId: null,
  prefixId: '',
  validarCampoObrigatorioCustomizado: null,
  montarComboMultiplaEscolhaComplementarComResposta: true,
  exibirLabel: true,
  exibirCampoSemValor: true,
  codigoDre: '',
};

export default QuestionarioDinamico;
