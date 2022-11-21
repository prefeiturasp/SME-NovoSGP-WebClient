/* eslint-disable react/prop-types */
import React, { useEffect, useCallback } from 'react';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';

const MontarDadosTabSelecionada = props => {
  const { questionarioId, codigoAluno, codigoTurma } = props;

  const obterDadosQuestionarioId = useCallback(async () => {
    const resposta = await ServicoNAAPA.obterDadosQuestionarioId(
      questionarioId,
      codigoAluno,
      codigoTurma
    );

    if (resposta?.data?.length) {
      console.log(resposta.data);
    }
  }, [questionarioId]);

  useEffect(() => {
    if (questionarioId) obterDadosQuestionarioId();
  }, [questionarioId, obterDadosQuestionarioId]);

  return <div>montarDadosTabSelecionada</div>;
};

export default MontarDadosTabSelecionada;
