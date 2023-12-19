import React, { useContext } from 'react';
import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import QuestionarioDinamico from '~/componentes-sgp/QuestionarioDinamico/questionarioDinamico';
import { SGP_SECAO } from '~/constantes/ids/questionario-dinamico';
import RelatorioDinamicoNAAPAContext from '../relatorioDinamicoNAAPAContext';

const RelatorioDinamicoQuestionarioDinamico = props => {
  const { listaSecoesParaDesabilitar, setListaSecoesParaDesabilitar } =
    useContext(RelatorioDinamicoNAAPAContext);

  const { secao, questoes, dadosSecoes } = props;

  const desabilitarCampos = listaSecoesParaDesabilitar?.find(
    item => item?.id === secao?.id
  );

  const validarSeDesabilita = async secaoIdAlterada => {
    const dadosMapeados = await QuestionarioDinamicoFuncoes.mapearQuestionarios(
      dadosSecoes,
      true
    );

    if (dadosMapeados?.secoes?.length && secao?.modalidadesCodigo?.length) {
      let secaoAtualTemResposta = false;

      dadosMapeados.secoes.forEach(item => {
        const questoesComResposta = item.questoes.filter(
          questao => questao?.resposta
        );
        item.questoes = questoesComResposta;

        if (item.questoes?.length && item?.secaoId === secaoIdAlterada) {
          secaoAtualTemResposta = true;
        }
      });

      const secoesParaDesabilitar = dadosSecoes.filter(
        item =>
          secaoAtualTemResposta &&
          item?.modalidadesCodigo?.length &&
          item?.ordem === secao?.ordem &&
          item?.id !== secaoIdAlterada
      );

      setListaSecoesParaDesabilitar([...secoesParaDesabilitar]);
    }
  };

  return (
    <QuestionarioDinamico
      desabilitarCampos={desabilitarCampos}
      dados={secao}
      exibirOrdemLabel={false}
      urlUpload="v1/encaminhamento-naapa/upload"
      dadosQuestionarioAtual={questoes}
      prefixId={`${SGP_SECAO}_RELATORIO_DINAMICO_NAAPA`}
      onChangeQuestionario={() => {
        QuestionarioDinamicoFuncoes.guardarSecaoEmEdicao(secao?.id);
        validarSeDesabilita(secao?.id);
      }}
    />
  );
};

export default React.memo(RelatorioDinamicoQuestionarioDinamico);
