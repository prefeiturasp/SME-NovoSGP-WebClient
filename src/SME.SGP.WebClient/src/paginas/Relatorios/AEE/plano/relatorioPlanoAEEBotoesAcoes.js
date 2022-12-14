/* eslint-disable react/prop-types */
import React from 'react';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import { MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO, URL_HOME } from '~/constantes';
import { erros, history, sucesso } from '~/servicos';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';

const RelatorioPlanoAEEBotoesAcoes = props => {
  const {
    form,
    modoEdicao,
    initialValues,
    setModoEdicao,
    desabilitarGerar,
    setGerandoRelatorio,
    setDesabilitarGerar,
  } = props;

  const onClickGerar = async values => {
    setGerandoRelatorio(true);

    const retorno = await ServicoPlanoAEE.gerarRelatorioPlanosAEE(
      values
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

  const onClickVoltar = async () => history.push(URL_HOME);

  const onClickCancelar = () => {
    form.resetForm();
    setModoEdicao(false);
    setDesabilitarGerar(false);
  };

  return (
    <BotoesAcaoRelatorio
      modoEdicao={modoEdicao}
      onClickCancelar={onClickCancelar}
      onClickVoltar={() => onClickVoltar()}
      desabilitarBtnGerar={desabilitarGerar}
      onClickGerar={() => validaAntesDoSubmit(form)}
    />
  );
};

export default RelatorioPlanoAEEBotoesAcoes;
