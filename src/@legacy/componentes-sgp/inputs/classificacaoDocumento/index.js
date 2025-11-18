import React from 'react';
import PropTypes from 'prop-types';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_CLASSIFICACAO_DOCUMENTO } from '~/constantes/ids/select';

export const ClassificacaoDocumento = ({
  name,
  form,
  onChange,
  disabled,
  showSearch,
  labelRequired,
}) => {
  const listaClassificacoes = form.values?.listaClassificacoes?.length
    ? form.values.listaClassificacoes
    : [];

  return (
    <Loader ignorarTip>
      <SelectComponent
        name={name}
        form={form}
        valueOption="id"
        valueText="classificacao"
        lista={listaClassificacoes}
        showSearch={showSearch}
        label="Classificação"
        labelRequired={labelRequired}
        id={SGP_SELECT_CLASSIFICACAO_DOCUMENTO}
        placeholder="Classificação do documento"
        disabled={listaClassificacoes?.length === 1 || disabled}
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

ClassificacaoDocumento.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  labelRequired: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

ClassificacaoDocumento.defaultProps = {
  form: null,
  disabled: false,
  showSearch: true,
  labelRequired: false,
  onChange: () => null,
  name: 'classificacaoId',
};
