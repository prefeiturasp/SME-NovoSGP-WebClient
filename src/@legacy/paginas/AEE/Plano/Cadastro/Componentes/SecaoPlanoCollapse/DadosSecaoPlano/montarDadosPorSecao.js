import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Auditoria } from '~/componentes';
import QuestionarioDinamico from '~/componentes-sgp/QuestionarioDinamico/questionarioDinamico';
import situacaoPlanoAEE from '~/dtos/situacaoPlanoAEE';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';

const MontarDadosPorSecao = props => {
  const { dados, dadosQuestionarioAtual, auditoria } = props;

  const paramsRoute = useParams();

  const planoId = paramsRoute?.id || 0;

  const dadosCollapseLocalizarEstudante = useSelector(
    store => store.collapseLocalizarEstudante.dadosCollapseLocalizarEstudante
  );

  const planoAEEDados = useSelector(store => store.planoAEE.planoAEEDados);

  const desabilitarCamposPlanoAEE = useSelector(
    store => store.planoAEE.desabilitarCamposPlanoAEE
  );

  const validaSeDesabilitarCampo = () => {
    return (
      desabilitarCamposPlanoAEE ||
      (planoId &&
        (planoAEEDados?.situacao === situacaoPlanoAEE.Encerrado ||
          planoAEEDados?.situacao ===
            situacaoPlanoAEE.EncerradoAutomaticamente))
    );
  };

  return (
    <>
      {dadosQuestionarioAtual?.length ? (
        <QuestionarioDinamico
          codigoAluno={dadosCollapseLocalizarEstudante?.codigoAluno}
          codigoTurma={dadosCollapseLocalizarEstudante?.codigoTurma}
          anoLetivo={dadosCollapseLocalizarEstudante?.anoLetivo}
          dados={dados}
          dadosQuestionarioAtual={dadosQuestionarioAtual}
          desabilitarCampos={validaSeDesabilitarCampo()}
          funcaoRemoverArquivoCampoUpload={ServicoPlanoAEE.removerArquivo}
          urlUpload="v1/plano-aee/upload"
          turmaId={dadosCollapseLocalizarEstudante?.turmaId}
          versaoPlano={planoAEEDados?.ultimaVersao}
        />
      ) : (
        <></>
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

MontarDadosPorSecao.propTypes = {
  dados: PropTypes.oneOfType([PropTypes.object]),
  auditoria: PropTypes.oneOfType([PropTypes.object]),
  dadosQuestionarioAtual: PropTypes.oneOfType([PropTypes.any]),
};

MontarDadosPorSecao.defaultProps = {
  dados: {},
  auditoria: {},
  dadosQuestionarioAtual: [],
};

export default MontarDadosPorSecao;
