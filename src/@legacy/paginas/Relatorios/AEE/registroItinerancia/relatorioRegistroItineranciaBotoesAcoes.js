import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import { MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO, URL_HOME } from '~/constantes';
import { erros, sucesso } from '~/servicos';
import { useNavigate } from 'react-router-dom';
import ServicoRelatorioRegistroItinerancia from '@/@legacy/servicos/Paginas/Relatorios/AEE/ServicoRelatorioRegistroItinerancia';

const RelatorioRegistroItineranciaBotoesAcoes = props => {
  const navigate = useNavigate();

  const {
    form,
    initialValues,
    desabilitarGerar,
    setGerandoRelatorio,
    setDesabilitarGerar,
  } = props;

  const onClickGerar = values => {
    setGerandoRelatorio(true);
    const valuesClone = _.cloneDeep(values);

    const params = {
      anoLetivo: valuesClone?.anoLetivo,
      dreCodigo: valuesClone?.dreCodigo,
      ueCodigo: valuesClone?.ueCodigo,
    };

    if (valuesClone?.situacaoIds?.length) {
      params.situacaoIds = valuesClone.situacaoIds;
    }

    if (valuesClone?.codigosPAAIResponsavel?.length) {
      params.codigosPAAIResponsavel = valuesClone.codigosPAAIResponsavel;
    }

    ServicoRelatorioRegistroItinerancia.gerar(params)
      .then(retorno => {
        if (retorno?.status === 200) {
          sucesso(MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO);
          setDesabilitarGerar(true);
        }
      })
      .catch(e => erros(e))
      .finally(() => setGerandoRelatorio(false));
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

RelatorioRegistroItineranciaBotoesAcoes.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
  initialValues: PropTypes.oneOfType([PropTypes.any]),
  desabilitarGerar: PropTypes.bool,
  setGerandoRelatorio: PropTypes.oneOfType([PropTypes.any]),
  setDesabilitarGerar: PropTypes.oneOfType([PropTypes.any]),
};

RelatorioRegistroItineranciaBotoesAcoes.defaultProps = {
  form: null,
  initialValues: {},
  desabilitarGerar: false,
  setGerandoRelatorio: () => false,
  setDesabilitarGerar: () => false,
};

export default RelatorioRegistroItineranciaBotoesAcoes;
