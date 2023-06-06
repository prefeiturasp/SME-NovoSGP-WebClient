/* eslint-disable react/prop-types */
import { Row } from 'antd';
import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Auditoria } from '~/componentes';
import QuestionarioDinamico from '~/componentes-sgp/QuestionarioDinamico/questionarioDinamico';
import { SGP_SECAO } from '~/constantes/ids/questionario-dinamico';
import { setExibirLoaderEncaminhamentoNAAPA } from '~/redux/modulos/encaminhamentoNAAPA/actions';
import { erros } from '~/servicos';
import ServicoEstudante from '~/servicos/Paginas/Estudante/ServicoEstudante';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';

const MontarDadosTabSelecionada = props => {
  const { questionarioId, dadosTab } = props;

  const { id } = useParams();
  const dispatch = useDispatch();

  const encaminhamentoId = id || 0;

  const { aluno, turma, anoLetivo } = useSelector(
    state => state.encaminhamentoNAAPA.dadosEncaminhamentoNAAPA
  );

  const desabilitarCamposEncaminhamentoNAAPA = useSelector(
    store => store.encaminhamentoNAAPA.desabilitarCamposEncaminhamentoNAAPA
  );

  const [dadosQuestionarioAtual, setDadosQuestionarioAtual] = useState();

  const obterinformacoesAdicionaisEstudante = async codigoAluno => {
    const resposta = await ServicoEstudante.obterInformacoesAlunoPorCodigo(
      codigoAluno
    ).catch(e => erros(e));

    if (resposta?.data) return resposta.data;

    return null;
  };

  const buscarValoresOpcaoResposta = (array, value) => {
    const opcaoResposta = array.find(x =>
      x.nome.startsWith(value.toString().toUpperCase())
    );

    return opcaoResposta?.id?.toString() || null;
  };

  const buscarValoresOpcaoRespostaPorNome = (array, value) => {
    const opcaoResposta = array.find(x => x.nome === value);
    return opcaoResposta?.id?.toString() || null;
  };

  const converterRacaCorEolToOpcaoRespostaGrupoEtnico = nomeRaca => {
    switch (nomeRaca) {
      case 'BRANCA':
        return 'Branco';
      case 'PRETA':
        return 'Preta';
      case 'PARDA':
        return 'Pardo';
      case 'AMARELA':
        return 'Amarelo';
      case 'INDIGENA':
        return 'Indígena';
      case 'NAO INFORMADA':
        return 'Não declarado';
      case 'RECUSOU INFORMAR':
        return 'Não declarado';
      default:
        return '';
    }
  };

  const buscarValoresSimNao = (array, value) => {
    if (value) {
      return Number(buscarValoresOpcaoResposta(array, 'S'));
    }

    return Number(buscarValoresOpcaoResposta(array, 'N'));
  };

  const dadosIniciaisTurmasPrograma = async () => {
    const resposta = await ServicoEstudante.obterLocalAtividadeAluno(
      aluno?.codigoAluno,
      anoLetivo
    ).catch(e => erros(e));
    if (resposta?.data?.length) {
      const dados = resposta.data.map((item, index) => {
        return { ...item, id: index + 1 };
      });
      return dados;
    }
    return [];
  };

  const mapearDadosNovoEncaminhamento = (
    dadosQuestinario,
    informacoesEstudante
  ) => {
    dadosQuestinario.forEach(questao => {
      switch (questao.nomeComponente) {
        case 'FILIACAO_1':
          if (informacoesEstudante?.nomeMae) {
            questao.resposta = [
              { texto: informacoesEstudante?.nomeMae, id: 0 },
            ];
          }
          break;
        case 'ENDERECO_RESIDENCIAL':
          if (informacoesEstudante?.endereco) {
            const { endereco } = informacoesEstudante;
            const listaEndereco = [
              {
                numero: endereco?.nro,
                bairro: endereco?.bairro,
                complemento: endereco?.complemento,
                logradouro: endereco?.logradouro,
                tipoLogradouro: endereco?.tipologradouro,
              },
            ];
            questao.resposta = [{ texto: JSON.stringify(listaEndereco) }];
          }
          break;
        case 'GENERO':
          if (informacoesEstudante?.sexo) {
            const opcaoRespostaId = buscarValoresOpcaoResposta(
              questao.opcaoResposta,
              informacoesEstudante?.sexo
            );
            questao.resposta = [{ opcaoRespostaId }];
          }
          break;
        case 'GRUPO_ETNICO':
          if (informacoesEstudante?.grupoEtnico) {
            const opcaoRespostaId = buscarValoresOpcaoRespostaPorNome(
              questao.opcaoResposta,
              converterRacaCorEolToOpcaoRespostaGrupoEtnico(
                informacoesEstudante?.grupoEtnico
              )
            );
            questao.resposta = [{ opcaoRespostaId }];
          }
          break;
        case 'ESTUDANTE_MIGRANTE':
          questao.resposta = [
            {
              opcaoRespostaId: buscarValoresSimNao(
                questao.opcaoResposta,
                !!informacoesEstudante?.ehImigrante
              ),
            },
          ];
          break;
        case 'CNS':
          if (informacoesEstudante?.cns) {
            questao.resposta = [{ texto: informacoesEstudante?.cns, id: 0 }];
          }
          break;
        case 'NIS':
          if (informacoesEstudante?.nis) {
            questao.resposta = [{ texto: informacoesEstudante?.nis, id: 0 }];
          }
          break;
        default:
          break;
      }
    });

    return dadosQuestinario;
  };

  const mapearDados = (dadosQuestinario, dadosTurmasPrograma) => {
    dadosQuestinario.forEach(questao => {
      switch (questao.nomeComponente) {
        case 'TURMAS_PROGRAMA':
          questao.resposta = [{ texto: JSON.stringify(dadosTurmasPrograma) }];
          break;
        default:
          break;
      }
    });

    return dadosQuestinario;
  };

  const obterDadosQuestionarioId = useCallback(async () => {
    dispatch(setExibirLoaderEncaminhamentoNAAPA(true));

    const resposta = await ServicoNAAPA.obterDadosQuestionarioId(
      questionarioId,
      aluno?.codigoAluno,
      turma?.codigo,
      encaminhamentoId
    );

    if (resposta?.data?.length) {
      let dadosMapeados = resposta.data;

      let informacoesAdicionaisEstudante = null;
      if (!encaminhamentoId) {
        informacoesAdicionaisEstudante =
          await obterinformacoesAdicionaisEstudante(aluno?.codigoAluno);
      }

      if (!encaminhamentoId && informacoesAdicionaisEstudante) {
        dadosMapeados = mapearDadosNovoEncaminhamento(
          resposta.data,
          informacoesAdicionaisEstudante
        );
      }

      let dadosTurmasPrograma = [];

      const temTurmasPrograma = dadosMapeados.find(
        questao => questao.nomeComponente === 'TURMAS_PROGRAMA'
      );

      if (temTurmasPrograma) {
        dadosTurmasPrograma = await dadosIniciaisTurmasPrograma();
      }

      dadosMapeados = mapearDados(resposta.data, dadosTurmasPrograma);

      setDadosQuestionarioAtual(dadosMapeados);
    } else {
      setDadosQuestionarioAtual([]);
    }
    dispatch(setExibirLoaderEncaminhamentoNAAPA(false));
  }, [dispatch, questionarioId, aluno, turma, encaminhamentoId]);

  useEffect(() => {
    if (questionarioId) {
      obterDadosQuestionarioId();
    }
  }, [questionarioId, obterDadosQuestionarioId]);

  const validarCampoObrigatorioCustomizado = (questaoAtual, formValues) => {
    if (
      formValues &&
      questaoAtual?.nomeComponente === 'OBS_AGRUPAMENTO_PROMOCAO_CUIDADOS'
    ) {
      const campoAgrupamento = dadosQuestionarioAtual.find(
        d => d.nomeComponente === 'AGRUPAMENTO_PROMOCAO_CUIDADOS'
      );

      const idCampoAgrupamento = campoAgrupamento?.id;

      const respostasCampoAgrupamento = formValues[idCampoAgrupamento];

      const labelCampoAdoece =
        'Adoece com frequência sem receber cuidados médicos';

      const labelDoencaCronica =
        'Doença crônica ou em tratamento de longa duração';

      if (!respostasCampoAgrupamento?.length) return questaoAtual.obrigatorio;

      const camposValidarObrigatoriedade =
        campoAgrupamento.opcaoResposta.filter(opcao => {
          const opcaoEhSelecionada = respostasCampoAgrupamento.find(
            opcaoRespostaId => opcao.id === Number(opcaoRespostaId)
          );

          return (
            opcaoEhSelecionada &&
            (opcao?.nome === labelCampoAdoece ||
              opcao?.nome === labelDoencaCronica)
          );
        });

      const ehObrigatorio = camposValidarObrigatoriedade.find(campo => {
        if (campo?.questoesComplementares?.length) {
          const campoValidarObrigatoriedade = campo.questoesComplementares.find(
            q =>
              q.nomeComponente ===
                'TIPO_ADOECE_COM_FREQUENCIA_SEM_CUIDADOS_MEDICOS' ||
              q.nomeComponente ===
                'TIPO_DOENCA_CRONICA_TRATAMENTO_LONGA_DURACAO'
          );

          if (campoValidarObrigatoriedade) {
            const idTipoAdoece = campoValidarObrigatoriedade.id;
            const respostaTipoAdoece = formValues[idTipoAdoece];

            if (!respostaTipoAdoece?.length) return questaoAtual.obrigatorio;

            const labelOutras = 'Outras';

            const tipoOutrasSelecionada =
              campoValidarObrigatoriedade.opcaoResposta.find(opcao => {
                const opcaoEhSelecionada = respostaTipoAdoece.find(
                  opcaoRespostaId => opcao.id === Number(opcaoRespostaId)
                );

                return opcaoEhSelecionada && opcao?.nome === labelOutras;
              });

            return !!tipoOutrasSelecionada;
          }
        }
        return false;
      });

      return !!ehObrigatorio;
    }

    return questaoAtual.obrigatorio;
  };

  return (
    <>
      <QuestionarioDinamico
        dados={dadosTab}
        anoLetivo={anoLetivo}
        exibirOrdemLabel={false}
        codigoTurma={turma?.codigo}
        codigoAluno={aluno?.codigoAluno}
        urlUpload="v1/encaminhamento-naapa/upload"
        dadosQuestionarioAtual={dadosQuestionarioAtual}
        prefixId={`${SGP_SECAO}_${dadosTab?.nomeComponente}`}
        desabilitarCampos={desabilitarCamposEncaminhamentoNAAPA}
        funcaoRemoverArquivoCampoUpload={ServicoNAAPA.removerArquivo}
        onChangeQuestionario={() => {
          ServicoNAAPA.guardarSecaoEmEdicao(dadosTab?.id);
        }}
        validarCampoObrigatorioCustomizado={validarCampoObrigatorioCustomizado}
        montarComboMultiplaEscolhaComplementarComResposta={false}
      />

      <Row style={{ padding: '0 10px 10px' }}>
        {dadosTab?.auditoria?.criadoEm && (
          <Auditoria {...dadosTab?.auditoria} ignorarMarginTop />
        )}
      </Row>
    </>
  );
};

export default MontarDadosTabSelecionada;
