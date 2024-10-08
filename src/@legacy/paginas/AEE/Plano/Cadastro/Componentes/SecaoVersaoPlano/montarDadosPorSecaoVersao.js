import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Auditoria } from '~/componentes';
import QuestionarioDinamico from '~/componentes-sgp/QuestionarioDinamico/questionarioDinamico';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';

const MontarDadosPorSecaoVersao = props => {
  const { versao, dados, auditoria, questionarioId, exibir, turmaCodigo } =
    props;
  const [dadosQuestionarioAtual, setDadosQuestionarioAtual] = useState([]);

  const dadosCollapseLocalizarEstudante = useSelector(
    store => store.collapseLocalizarEstudante.dadosCollapseLocalizarEstudante
  );

  const obterDadosPorVersaoId = useCallback(async () => {
    if (versao > 0) {
      const resposta = await ServicoPlanoAEE.obterVersaoPlanoPorId(
        versao,
        questionarioId,
        turmaCodigo
      );
      if (resposta?.data) {
        setDadosQuestionarioAtual(resposta?.data);
      }
    }
  }, [questionarioId, versao, turmaCodigo]);

  useEffect(() => {
    if (exibir && !dadosQuestionarioAtual?.length) {
      obterDadosPorVersaoId();
    }
  }, [exibir, dadosQuestionarioAtual, obterDadosPorVersaoId]);

  return (
    <>
      {dadosQuestionarioAtual?.length ? (
        <QuestionarioDinamico
          codigoAluno={dadosCollapseLocalizarEstudante?.codigoAluno}
          codigoTurma={dadosCollapseLocalizarEstudante?.codigoTurma}
          anoLetivo={dadosCollapseLocalizarEstudante?.anoLetivo}
          dados={dados}
          dadosQuestionarioAtual={dadosQuestionarioAtual}
          desabilitarCampos
          funcaoRemoverArquivoCampoUpload={ServicoPlanoAEE.removerArquivo}
          urlUpload="v1/plano-aee/upload"
          turmaId={dadosCollapseLocalizarEstudante?.turmaId}
        />
      ) : (
        ''
      )}
      {auditoria && (
        <Auditoria
          criadoEm={auditoria.criadoEm}
          criadoPor={auditoria.criadoPor}
          criadoRf={auditoria.criadoRf}
          alteradoPor={auditoria.alteradoPor}
          alteradoEm={auditoria.alteradoEm}
          alteradoRf={auditoria.alteradoRf}
        />
      )}
    </>
  );
};

MontarDadosPorSecaoVersao.propTypes = {
  dados: PropTypes.oneOfType([PropTypes.object]),
  auditoria: PropTypes.oneOfType([PropTypes.object]),
  versao: PropTypes.oneOfType([PropTypes.number]),
  questionarioId: PropTypes.oneOfType([PropTypes.any]),
  exibir: PropTypes.bool,
  turmaCodigo: PropTypes.oneOfType([PropTypes.any]),
};

MontarDadosPorSecaoVersao.defaultProps = {
  versao: 0,
  auditoria: {},
  dados: {},
  questionarioId: '',
  exibir: false,
  turmaCodigo: '',
};

export default MontarDadosPorSecaoVersao;
