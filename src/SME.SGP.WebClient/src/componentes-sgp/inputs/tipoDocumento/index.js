import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_TIPO_DOCUMENTO } from '~/constantes/ids/select';
import { erros } from '~/servicos';
import ServicoDocumentosPlanosTrabalho from '~/servicos/Paginas/Gestao/DocumentosPlanosTrabalho/ServicoDocumentosPlanosTrabalho';

export const TipoDocumento = ({
  name,
  form,
  onChange,
  disabled,
  showSearch,
  labelRequired,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaTipoDocumento, setListaTipoDocumento] = useState([]);

  const obterTiposDocumento = useCallback(async () => {
    setExibirLoader(true);
    const resposta = await ServicoDocumentosPlanosTrabalho.obterTiposDeDocumentos().catch(
      e => erros(e)
    );

    if (resposta?.data?.length) {
      setListaTipoDocumento(resposta.data);
      if (resposta.data.length === 1) {
        const tipo = resposta.data[0];
        form.setFieldValue(name, String(tipo.id));

        if (tipo.classificacoes.length === 1) {
          form.setFieldValue('listaClassificacoes', tipo.classificacoes);
          const classificacao = tipo.classificacoes[0];
          form.setFieldValue('classificacaoId', String(classificacao.id));
        }
      }
    }
    setExibirLoader(false);
  }, [form, name]);

  useEffect(() => {
    obterTiposDocumento();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeTipoDocumento = tipo => {
    let classificacaoPorTipo = [];
    if (tipo) {
      const lista = listaTipoDocumento.find(
        item => String(item.id) === String(tipo)
      );
      classificacaoPorTipo = lista.classificacoes;
    }

    form.setFieldValue('modoEdicao', true);

    form.setFieldValue(name, tipo);
    form.setFieldTouched(name, true, true);

    form.setFieldValue('listaClassificacoes', classificacaoPorTipo);
    form.setFieldValue('classificacaoId', undefined);
    onChange(tipo);
  };

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        name={name}
        form={form}
        valueOption="id"
        valueText="tipoDocumento"
        lista={listaTipoDocumento}
        showSearch={showSearch}
        label="Tipo de documento"
        labelRequired={labelRequired}
        id={SGP_SELECT_TIPO_DOCUMENTO}
        placeholder="Tipo de documento"
        disabled={listaTipoDocumento?.length === 1 || disabled}
        setValueOnlyOnChange
        onChange={onChangeTipoDocumento}
      />
    </Loader>
  );
};

TipoDocumento.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  labelRequired: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

TipoDocumento.defaultProps = {
  form: null,
  disabled: false,
  showSearch: true,
  labelRequired: false,
  onChange: () => null,
  name: 'tipoDocumentoId',
};
