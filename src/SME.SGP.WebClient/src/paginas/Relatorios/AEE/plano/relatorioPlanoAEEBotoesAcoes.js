/* eslint-disable react/prop-types */
import React from 'react';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import { MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO, URL_HOME } from '~/constantes';
import { erros, history, sucesso } from '~/servicos';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';

const RelatorioPlanoAEEBotoesAcoes = props => {
  const { form, initialValues, modoEdicao, setModoEdicao } = props;

  const onClickGerar = async values => {
    const params = {
      ...values,
    };
    // TODO LOADER
    const retorno = await ServicoPlanoAEE.gerarRelatorioPlanosAEE(
      params
    ).catch(e => erros(e));

    if (retorno?.status === 200) {
      sucesso(MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO);
    }
  };

  const validaAntesDoSubmit = () => {
    const arrayCampos = Object.keys(initialValues);
    arrayCampos.forEach(campo => {
      form.setFieldTouched(campo, true, true);
    });
    form.validateForm().then(() => {
      if (form.isValid || Object.keys(form.errors).length === 0) {
        // TODO
        onClickGerar(form?.values);
      }
    });
  };

  const onClickVoltar = async () => history.push(URL_HOME);

  const onClickCancelar = () => {
    // TODO
    form.resetForm();
    setModoEdicao(false);
  };

  return (
    <BotoesAcaoRelatorio
      onClickVoltar={() => onClickVoltar()}
      onClickCancelar={onClickCancelar}
      onClick={() => validaAntesDoSubmit(form)}
      modoEdicao={modoEdicao}
    />
  );
};

export default RelatorioPlanoAEEBotoesAcoes;
