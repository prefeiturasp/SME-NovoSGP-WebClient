/* eslint-disable react/prop-types */
import { Row } from 'antd';
import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { Auditoria } from '~/componentes';
import QuestionarioDinamico from '~/componentes-sgp/QuestionarioDinamico/questionarioDinamico';
import { SGP_SECAO } from '~/constantes/ids/questionario-dinamico';
import { setExibirLoaderEncaminhamentoNAAPA } from '~/redux/modulos/encaminhamentoNAAPA/actions';
import { erros } from '~/servicos';
import ServicoEstudante from '~/servicos/Paginas/Estudante/ServicoEstudante';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';

const MontarDadosTabSelecionada = props => {
  const { questionarioId, dadosTab } = props;

  const routeMatch = useRouteMatch();
  const dispatch = useDispatch();

  const encaminhamentoId = routeMatch?.params?.id || 0;

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

  const buscarValoresSimNao = (array, value) => {
    if (value) {
      return Number(buscarValoresOpcaoResposta(array, 'S'));
    }

    return Number(buscarValoresOpcaoResposta(array, 'N'));
  };

  const dadosIniciaisAtividadesContraturno = async () => {
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

  const mapearDados = (
    dadosQuestinario,
    informacoesEstudante,
    dadosAtividadesContraturno
  ) => {
    dadosQuestinario.forEach(questao => {
      switch (questao.nomeComponente) {
        case 'NOME_MAE':
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
            const opcaoRespostaId = buscarValoresOpcaoResposta(
              questao.opcaoResposta,
              informacoesEstudante?.grupoEtnico.substring(0, 1)
            );
            questao.resposta = [{ opcaoRespostaId }];
          }
          break;
        case 'ESTUDANTE_IMIGRANTE':
          questao.resposta = [
            {
              opcaoRespostaId: buscarValoresSimNao(
                questao.opcaoResposta,
                !!informacoesEstudante?.ehImigrante
              ),
            },
          ];
          break;
        case 'ATIVIDADES_CONTRATURNO':
          if (dadosAtividadesContraturno?.length) {
            questao.resposta = [
              { texto: JSON.stringify(dadosAtividadesContraturno) },
            ];
          }
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
        informacoesAdicionaisEstudante = await obterinformacoesAdicionaisEstudante(
          aluno?.codigoAluno
        );
      }

      let dadosContraturno = [];
      if (!encaminhamentoId) {
        const temCampoContraturno = dadosMapeados.find(
          questao => questao.nomeComponente === 'ATIVIDADES_CONTRATURNO'
        );
        if (temCampoContraturno) {
          dadosContraturno = await dadosIniciaisAtividadesContraturno();
        }
      }

      if (
        !encaminhamentoId &&
        (informacoesAdicionaisEstudante || dadosContraturno?.length)
      ) {
        dadosMapeados = mapearDados(
          resposta.data,
          informacoesAdicionaisEstudante
        );
      }

      setDadosQuestionarioAtual(dadosMapeados);
    } else {
      setDadosQuestionarioAtual([]);
    }
    dispatch(setExibirLoaderEncaminhamentoNAAPA(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, questionarioId, aluno, turma, encaminhamentoId]);

  useEffect(() => {
    if (questionarioId) {
      obterDadosQuestionarioId();
    }
  }, [questionarioId, obterDadosQuestionarioId]);

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
