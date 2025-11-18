import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import { MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO, URL_HOME } from '~/constantes';
import { erros, sucesso } from '~/servicos';
import ServicoRelatorioEncaminhamentoNAAPA from '~/servicos/Paginas/Relatorios/NAAPA/ServicoRelatorioEncaminhamentoNAAPA';
import { useNavigate } from 'react-router-dom';

const RelatorioEncaminhamentoNAAPABotoesAcoes = props => {
  const navigate = useNavigate();

  const {
    form,
    initialValues,
    desabilitarGerar,
    setGerandoRelatorio,
    setDesabilitarGerar,
  } = props;

  const onClickGerar = async values => {
    setGerandoRelatorio(true);
    const valuesClone = _.cloneDeep(values);

    const params = {
      anoLetivo: valuesClone?.anoLetivo,
      dreCodigo: valuesClone?.dreCodigo,
      ueCodigo: valuesClone?.ueCodigo,
      exibirEncerrados: valuesClone?.exibirEncerrados,
    };

    if (valuesClone?.situacaoIds?.length) {
      params.situacaoIds = valuesClone.situacaoIds;
    }

    if (valuesClone?.portaEntradaIds?.length) {
      params.portaEntradaIds = valuesClone.portaEntradaIds;
    }

    if (valuesClone?.fluxoAlertaIds?.length) {
      params.fluxoAlertaIds = valuesClone.fluxoAlertaIds;
    }

    const retorno = await ServicoRelatorioEncaminhamentoNAAPA.gerar(
      params
    ).catch(e => erros(e));

    if (retorno?.status === 200) {
      sucesso(MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO);
      setDesabilitarGerar(true);
    }

    setGerandoRelatorio(false);
  };

  const validaAntesDoSubmit = () => {
    const arrayCampos = Object.keys(initialValues);
    arrayCampos.forEach(campo => {
      form.setFieldTouched(campo, true, true);
    });

    form.validateForm().then(() => {
      if (form.isValid || Object.keys(form.errors).length === 0) {
        onClickGerar(form?.values);
      }
    });
  };

  const onClickVoltar = () => navigate(URL_HOME);

  const onClickCancelar = () => {
    setDesabilitarGerar(false);
    form.setFieldValue('modoEdicao', false);
    form.resetForm();
  };

  return (
    <BotoesAcaoRelatorio
      modoEdicao={!!form?.values?.modoEdicao}
      onClickCancelar={onClickCancelar}
      onClickVoltar={() => onClickVoltar()}
      desabilitarBtnGerar={desabilitarGerar}
      onClickGerar={() => validaAntesDoSubmit(form)}
    />
  );
};

RelatorioEncaminhamentoNAAPABotoesAcoes.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
  initialValues: PropTypes.oneOfType([PropTypes.any]),
  desabilitarGerar: PropTypes.bool,
  setGerandoRelatorio: PropTypes.oneOfType([PropTypes.any]),
  setDesabilitarGerar: PropTypes.oneOfType([PropTypes.any]),
};

RelatorioEncaminhamentoNAAPABotoesAcoes.defaultProps = {
  form: null,
  initialValues: {},
  desabilitarGerar: false,
  setGerandoRelatorio: () => false,
  setDesabilitarGerar: () => false,
};

export default RelatorioEncaminhamentoNAAPABotoesAcoes;
