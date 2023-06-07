import React from 'react';
import PropTypes from 'prop-types';
import { SelectComponent } from '~/componentes';
import { SGP_SELECT_FORMATO } from '~/constantes/ids/select';
import { TIPO_FORMATO_RELATORIO } from '@/core/enum/tipo-formato-relatorio';

export const FormatoRelatorio = ({ form, onChange, disabled }) => {
  const lista = [
    { value: TIPO_FORMATO_RELATORIO.PDF, label: 'PDF' },
    { value: TIPO_FORMATO_RELATORIO.XLSX, label: 'EXCEL' },
  ];

  return (
    <SelectComponent
      name="tipoFormatoRelatorio"
      form={form}
      valueOption="value"
      valueText="label"
      lista={lista}
      label="Formato"
      labelRequired
      id={SGP_SELECT_FORMATO}
      placeholder="Formato"
      disabled={disabled}
      setValueOnlyOnChange
      onChange={newValue => {
        form.setFieldValue('modoEdicao', true);

        form.setFieldValue('tipoFormatoRelatorio', newValue);
        form.setFieldTouched('tipoFormatoRelatorio', true, true);
        onChange(newValue);
      }}
    />
  );
};

FormatoRelatorio.propTypes = {
  onChange: PropTypes.func,
  form: PropTypes.oneOfType([PropTypes.any]),
  disabled: PropTypes.bool,
};

FormatoRelatorio.defaultProps = {
  form: null,
  onChange: () => null,
  disabled: false,
};
