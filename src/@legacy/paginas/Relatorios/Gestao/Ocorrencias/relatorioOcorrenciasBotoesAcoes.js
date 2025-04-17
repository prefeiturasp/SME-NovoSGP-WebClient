import React from 'react';
import ServicoRelatorioOcorrencias from '@/@legacy/servicos/Paginas/Relatorios/Gestao/Ocorrencias/ServicoRelatorioOcorrencias';
import { HttpStatusCode } from 'axios';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import { MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO, URL_HOME } from '~/constantes';
import { erros, sucesso } from '~/servicos';

const RelatorioOcorrenciasBotoesAcoes = props => {
  const {
    form,
    initialValues,
    desabilitarGerar,
    setGerandoRelatorio,
    setDesabilitarGerar,
  } = props;

  const navigate = useNavigate();

  const onClickGerar = async values => {
    setGerandoRelatorio(true);
    const valuesClone = _.cloneDeep(values);

    const params = {
      exibirHistorico: !!valuesClone?.consideraHistorico,
      anoLetivo: valuesClone?.anoLetivo,
      codigoDre: valuesClone?.dreCodigo,
      codigoUe: valuesClone?.ueCodigo,
      modalidade: valuesClone?.modalidade,
      codigosTurma: valuesClone?.codigosTurma,
      imprimirDescricaoOcorrencia: !!valuesClone?.imprimirDescricaoOcorrencia,
    };

    if (valuesClone?.semestre) {
      params.semestre = valuesClone.semestre;
    }

    if (valuesClone?.dataInicio) {
      params.dataInicio = valuesClone.dataInicio;
    }

    if (valuesClone?.dataFim) {
      params.dataFim = valuesClone.dataFim;
    }

    if (valuesClone?.ocorrenciaTipoIds?.length) {
      params.ocorrenciaTipoIds = valuesClone.ocorrenciaTipoIds;
    }

    const retorno = await ServicoRelatorioOcorrencias.gerar(params).catch(e =>
      erros(e)
    );

    if (retorno?.status === HttpStatusCode.Ok) {
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

  const onClickVoltar = async () => navigate(URL_HOME);

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

RelatorioOcorrenciasBotoesAcoes.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
  initialValues: PropTypes.oneOfType([PropTypes.any]),
  desabilitarGerar: PropTypes.bool,
  setGerandoRelatorio: PropTypes.oneOfType([PropTypes.any]),
  setDesabilitarGerar: PropTypes.oneOfType([PropTypes.any]),
};

RelatorioOcorrenciasBotoesAcoes.defaultProps = {
  form: null,
  initialValues: {},
  desabilitarGerar: false,
  setGerandoRelatorio: () => false,
  setDesabilitarGerar: () => false,
};

export default RelatorioOcorrenciasBotoesAcoes;
