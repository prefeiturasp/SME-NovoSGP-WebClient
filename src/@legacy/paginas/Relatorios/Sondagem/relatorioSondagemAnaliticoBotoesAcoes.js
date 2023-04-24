import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import { MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO, URL_HOME } from '~/constantes';
import { erros, history, sucesso } from '~/servicos';
import ServicoRelatorioSondagem from '~/servicos/Paginas/Relatorios/Sondagem/ServicoRelatorioSondagem';

const RelatorioSondagemAnaliticoBotoesAcoes = props => {
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
      tipoSondagem: valuesClone?.tipoSondagem,
      periodo: valuesClone?.periodoSondagem,
    };

    const retorno = await ServicoRelatorioSondagem.gerarAnalitico(params).catch(
      e => erros(e)
    );

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

  const onClickVoltar = async () => history.push(URL_HOME);

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

RelatorioSondagemAnaliticoBotoesAcoes.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
  initialValues: PropTypes.oneOfType([PropTypes.any]),
  desabilitarGerar: PropTypes.bool,
  setGerandoRelatorio: PropTypes.oneOfType([PropTypes.any]),
  setDesabilitarGerar: PropTypes.oneOfType([PropTypes.any]),
};

RelatorioSondagemAnaliticoBotoesAcoes.defaultProps = {
  form: null,
  initialValues: {},
  desabilitarGerar: false,
  setGerandoRelatorio: () => false,
  setDesabilitarGerar: () => false,
};

export default RelatorioSondagemAnaliticoBotoesAcoes;
