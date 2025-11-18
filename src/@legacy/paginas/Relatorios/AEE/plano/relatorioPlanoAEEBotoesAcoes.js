/* eslint-disable react/prop-types */
import _ from 'lodash';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import { MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO, URL_HOME } from '~/constantes';
import { erros, sucesso } from '~/servicos';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';

const RelatorioPlanoAEEBotoesAcoes = props => {
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
      anoLetivo: valuesClone?.anoLetivo,
      dreCodigo: valuesClone?.dreCodigo,
      ueCodigo: valuesClone?.ueCodigo,
      modalidade: valuesClone?.modalidade,
      codigosTurma: valuesClone?.codigosTurma,
      exibirEncerrados: valuesClone?.exibirEncerrados,
    };

    if (valuesClone?.semestre) {
      params.semestre = valuesClone.semestre;
    }
    if (valuesClone?.situacaoIds?.length) {
      params.situacaoIds = valuesClone.situacaoIds;
    }
    if (valuesClone?.codigosResponsavel?.length) {
      params.codigosResponsavel = valuesClone.codigosResponsavel;
    }
    if (valuesClone?.codigosPAAIResponsavel?.length) {
      params.codigosPAAIResponsavel = valuesClone.codigosPAAIResponsavel;
    }

    const retorno = await ServicoPlanoAEE.gerarRelatorioPlanosAEE(params).catch(
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

export default RelatorioPlanoAEEBotoesAcoes;
