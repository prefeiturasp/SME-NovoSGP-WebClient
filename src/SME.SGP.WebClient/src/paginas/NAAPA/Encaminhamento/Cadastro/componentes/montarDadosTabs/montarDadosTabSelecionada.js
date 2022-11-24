/* eslint-disable react/prop-types */
import { Row } from 'antd';
import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { Auditoria } from '~/componentes';
import QuestionarioDinamico from '~/componentes-sgp/QuestionarioDinamico/questionarioDinamico';
import { SGP_ENCAMINHAMENTO_NAAPA } from '~/constantes/ids/questionario-dinamico';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';

const MontarDadosTabSelecionada = props => {
  const { questionarioId, dadosTab } = props;

  const routeMatch = useRouteMatch();
  const encaminhamentoId = routeMatch?.params?.id || 0;

  const { aluno, turma, anoLetivo } = useSelector(
    state => state.encaminhamentoNAAPA.dadosEncaminhamentoNAAPA
  );

  const desabilitarCamposEncaminhamentoNAAPA = useSelector(
    store => store.encaminhamentoNAAPA.desabilitarCamposEncaminhamentoNAAPA
  );

  const [dadosQuestionarioAtual, setDadosQuestionarioAtual] = useState();

  const obterDadosQuestionarioId = useCallback(async () => {
    const resposta = await ServicoNAAPA.obterDadosQuestionarioId(
      questionarioId,
      aluno?.codigoAluno,
      turma?.codigo,
      encaminhamentoId
    );

    if (resposta?.data?.length) {
      setDadosQuestionarioAtual(resposta.data);
    } else {
      setDadosQuestionarioAtual([]);
    }
  }, [questionarioId, aluno, turma, encaminhamentoId]);

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
        codigoTurma={turma?.codigo}
        codigoAluno={aluno?.codigoAluno}
        urlUpload="v1/encaminhamento-naapa/upload"
        dadosQuestionarioAtual={dadosQuestionarioAtual}
        desabilitarCampos={desabilitarCamposEncaminhamentoNAAPA}
        funcaoRemoverArquivoCampoUpload={ServicoNAAPA.removerArquivo}
        prefixId={`${SGP_ENCAMINHAMENTO_NAAPA}_SECAO_${dadosTab?.id}`}
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
