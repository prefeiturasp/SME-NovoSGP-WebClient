/* eslint-disable react/prop-types */
import QuestionarioDinamicoFuncoes from '@/@legacy/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import { Row } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Auditoria } from '~/componentes';
import { erros } from '~/servicos';
import { setExibirLoaderEncaminhamentoInstitucional } from '~/redux/modulos/encaminhamentoInstitucional/actions';
import QuestionarioDinamico from '~/componentes-sgp/QuestionarioDinamico/questionarioDinamico';
import { SGP_SECAO } from '~/constantes/ids/questionario-dinamico';
//import { setExibirLoaderEncaminhamentoNAAPA } from '~/redux/modulos/encaminhamentoNAAPA/actions';
//import { erros } from '~/servicos';
//import ServicoEstudante from '~/servicos/Paginas/Estudante/ServicoEstudante';
import ServicoEncaInstitucionalNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoEncaInstitucionalNAAPA';

const MontarDadosTabSelecionadaInstitucional = props => {
  const { questionarioId, dadosTab } = props;
  const { id } = useParams();
  const dispatch = useDispatch();

  const encaminhamentoId = id || 0;

  const desabilitarCampos = useSelector(
    store =>
      store.encaminhamentoInstitucional
        .desabilitarCamposEncaminhamentoInstitucional
  );

  const [dadosQuestionarioAtual, setDadosQuestionarioAtual] = useState();

  const obterDadosQuestionarioId = useCallback(async () => {
    try {
      dispatch(setExibirLoaderEncaminhamentoInstitucional(true));

      const resposta =
        await ServicoEncaInstitucionalNAAPA.obterDadosQuestionarioIdInstitucional(
          questionarioId,
          encaminhamentoId
        ).catch(e => {
          erros(e);
          return null;
        });

      const data = resposta?.data || resposta || [];

      if (Array.isArray(data) && data.length) {
        setDadosQuestionarioAtual(data);
      } else {
        setDadosQuestionarioAtual([]);
      }
    } finally {
      dispatch(setExibirLoaderEncaminhamentoInstitucional(false));
    }
  }, [dispatch, questionarioId, encaminhamentoId]);

  useEffect(() => {
    if (questionarioId) {
      obterDadosQuestionarioId();
    }
  }, [questionarioId, obterDadosQuestionarioId]);

  return (
    <>
      <QuestionarioDinamico
        dados={dadosTab}
        exibirOrdemLabel={false}
        // 👇 MUDOU: URL específica para institucional
        urlUpload="v1/encaminhamento-naapa-institucional/upload"
        dadosQuestionarioAtual={dadosQuestionarioAtual}
        prefixId={`${SGP_SECAO}_${dadosTab?.nomeComponente}`}
        desabilitarCampos={desabilitarCampos}
        // 👇 MUDOU: Função de remover específica
        funcaoRemoverArquivoCampoUpload={
          ServicoEncaInstitucionalNAAPA.removerArquivoInstitucional
        }
        onChangeQuestionario={() => {
          QuestionarioDinamicoFuncoes.guardarSecaoEmEdicao(dadosTab?.id);
        }}
        // ✅ REMOVIDO: validarCampoObrigatorioCustomizado (a menos que precise)
      />

      <Row style={{ padding: '0 10px 10px' }}>
        {dadosTab?.auditoria?.criadoEm && (
          <Auditoria {...dadosTab?.auditoria} ignorarMarginTop />
        )}
      </Row>
    </>
  );
};

export default MontarDadosTabSelecionadaInstitucional;
