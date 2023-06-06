import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_SITUACAO_REGISTRO_ITINERANCIA } from '~/constantes/ids/select';
import { ServicoRegistroItineranciaAEE, erros } from '~/servicos';

export const SituacaoItinerancia = ({
  name,
  form,
  onChange,
  disabled,
  multiple,
  showSearch,
  labelRequired,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaSituacoes, setListaSituacoes] = useState([]);

  const obterSituacoes = useCallback(async () => {
    setExibirLoader(true);

    const resposta = await ServicoRegistroItineranciaAEE.obterSituacoes()
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;
      setListaSituacoes(lista);
    } else {
      setListaSituacoes([]);
      form.setFieldValue(name, undefined);
    }
  }, []);

  useEffect(() => {
    obterSituacoes();
  }, []);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        name={name}
        form={form}
        multiple={multiple}
        valueOption="codigo"
        valueText="descricao"
        lista={listaSituacoes}
        showSearch={showSearch}
        label="Situação do registro"
        labelRequired={labelRequired}
        id={SGP_SELECT_SITUACAO_REGISTRO_ITINERANCIA}
        placeholder="Selecione uma situação"
        disabled={listaSituacoes?.length === 1 || disabled}
        setValueOnlyOnChange
        onChange={newValue => {
          form.setFieldValue('modoEdicao', true);

          form.setFieldValue(name, newValue);
          form.setFieldTouched(name, true, true);
          onChange(newValue);
        }}
      />
    </Loader>
  );
};

SituacaoItinerancia.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  labelRequired: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

SituacaoItinerancia.defaultProps = {
  form: null,
  disabled: false,
  multiple: false,
  showSearch: true,
  labelRequired: false,
  onChange: () => null,
  name: 'situacao',
};
