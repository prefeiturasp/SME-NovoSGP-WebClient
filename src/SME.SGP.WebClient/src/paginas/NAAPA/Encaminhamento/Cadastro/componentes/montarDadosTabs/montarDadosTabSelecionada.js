/* eslint-disable react/prop-types */
import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Auditoria } from '~/componentes';
import QuestionarioDinamico from '~/componentes-sgp/QuestionarioDinamico/questionarioDinamico';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';

const MontarDadosTabSelecionada = props => {
  const { questionarioId, dadosTab } = props;

  const { aluno, turma, anoLetivo } = useSelector(
    state => state.encaminhamentoNAAPA.dadosEncaminhamentoNAAPA
  );

  const [dadosQuestionarioAtual, setDadosQuestionarioAtual] = useState();

  const obterDadosQuestionarioId = useCallback(async () => {
    const resposta = await ServicoNAAPA.obterDadosQuestionarioId(
      questionarioId,
      aluno?.codigoAluno,
      turma?.codigo
    );

    if (resposta?.data?.length) {
      setDadosQuestionarioAtual(resposta.data);
    } else {
      setDadosQuestionarioAtual([]);
    }
  }, [questionarioId, aluno, turma]);

  useEffect(() => {
    if (questionarioId) {
      obterDadosQuestionarioId();
    }
  }, [questionarioId, obterDadosQuestionarioId]);

  return (
    <>
      <QuestionarioDinamico
        codigoAluno={aluno?.codigoAluno}
        codigoTurma={turma?.codigo}
        anoLetivo={anoLetivo}
        dados={dadosTab}
        dadosQuestionarioAtual={dadosQuestionarioAtual}
        // desabilitarCampos={validaSeDesabilitarCampo()}
        // funcaoRemoverArquivoCampoUpload={
        //   ServicoEncaminhamentoAEE.removerArquivo
        // }
        // urlUpload="v1/encaminhamento-aee/upload"
        onChangeQuestionario={() => {
          ServicoNAAPA.guardarSecaoEmEdicao(dadosTab?.id);
        }}
      />

      {dadosTab?.auditoria?.criadoEm && <Auditoria {...dadosTab?.auditoria} />}
    </>
  );
};

export default MontarDadosTabSelecionada;
