import React from 'react';
import PropTypes from 'prop-types';
import { RadioGroupButton } from '~/componentes';
import { SGP_RADIO_EXIBIR_PLANOS_ENCERRADOS } from '~/constantes/ids/radio';

import comDefaultProps from '~/utils/comDefaultProps';
const ExibirPlanosEncerradosComponent = ({
  name,
  form,
  onChange,
  disabled,
  valorInicial,
  labelRequired,
}) => {
  const opcoesExibirPlanosEncerrados = [
    { label: 'Sim', value: true },
    { label: 'Não', value: false },
  ];

  return (
    <RadioGroupButton
      name={name}
      form={form}
      desabilitado={disabled}
      valorInicial={valorInicial}
      labelRequired={labelRequired}
      label="Exibir planos encerrados"
      opcoes={opcoesExibirPlanosEncerrados}
      id={SGP_RADIO_EXIBIR_PLANOS_ENCERRADOS}
      setValueOnlyOnChange
      onChange={newValue => {
        form.setFieldValue('modoEdicao', true);

        form.setFieldValue(name, newValue);
        onChange(newValue);
        form.setFieldTouched(name, true, true);
      }}
    />
  );
};

ExibirPlanosEncerradosComponent.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  valorInicial: PropTypes.bool,
  labelRequired: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

ExibirPlanosEncerradosComponent.defaultProps = {
  form: null,
  disabled: false,
  valorInicial: false,
  labelRequired: false,
  onChange: () => null,
  name: 'exibirPlanosEncerrados',
};

export const ExibirPlanosEncerrados = comDefaultProps(
  ExibirPlanosEncerradosComponent,
  ExibirPlanosEncerradosComponent.defaultProps
);
