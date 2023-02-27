import React from 'react';
import PropTypes from 'prop-types';
import { CheckboxComponent } from '~/componentes';
import { SGP_CHECKBOX_EXIBIR_HISTORICO } from '~/constantes/ids/checkbox';

export const ExibirHistorico = ({ name, form, onChange, disabled }) => {
  return (
    <CheckboxComponent
      form={form}
      name={name}
      disabled={disabled}
      label="Exibir histórico?"
      id={SGP_CHECKBOX_EXIBIR_HISTORICO}
      setValueOnlyOnChange
      onChangeCheckbox={checked => {
        form.setFieldValue('modoEdicao', true);

        form.setFieldValue(name, checked);
        onChange(checked);
        form.setFieldTouched(name, true, true);
      }}
    />
  );
};

ExibirHistorico.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  form: PropTypes.oneOfType([PropTypes.any]),
};

ExibirHistorico.defaultProps = {
  form: null,
  disabled: false,
  onChange: () => null,
  name: 'consideraHistorico',
};
