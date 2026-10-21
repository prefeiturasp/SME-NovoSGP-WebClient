import React from 'react';
import PropTypes from 'prop-types';
import { CheckboxComponent } from '~/componentes';
import { SGP_CHECKBOX_EXIBIR_HISTORICO } from '~/constantes/ids/checkbox';

import comDefaultProps from '~/utils/comDefaultProps';
const ExibirHistoricoComponent = ({ name, form, onChange, disabled }) => {
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

ExibirHistoricoComponent.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  form: PropTypes.oneOfType([PropTypes.any]),
};

ExibirHistoricoComponent.defaultProps = {
  form: null,
  disabled: false,
  onChange: () => null,
  name: 'consideraHistorico',
};

export const ExibirHistorico = comDefaultProps(
  ExibirHistoricoComponent,
  ExibirHistoricoComponent.defaultProps
);
