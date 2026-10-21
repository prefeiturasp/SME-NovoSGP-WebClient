import React from 'react';
import PropTypes from 'prop-types';
import { RadioGroupButton } from '~/componentes';
import { SGP_RADIO_EXIBIR_ENCAMINHAMENTOS_AEE_ENCERRADOS } from '~/constantes/ids/radio';
import comDefaultProps from '~/utils/comDefaultProps';

const ExibirEncaminhamentosEncerradosComponent = ({
  name,
  form,
  onChange,
  disabled,
  valorInicial,
  labelRequired,
}) => {
  const opcoesEncerrados = [
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
      label="Exibir encaminhamentos encerrados"
      opcoes={opcoesEncerrados}
      id={SGP_RADIO_EXIBIR_ENCAMINHAMENTOS_AEE_ENCERRADOS}
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

ExibirEncaminhamentosEncerradosComponent.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  valorInicial: PropTypes.bool,
  labelRequired: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

ExibirEncaminhamentosEncerradosComponent.defaultProps = {
  form: null,
  disabled: false,
  valorInicial: false,
  labelRequired: false,
  onChange: () => null,
  name: 'exibirEncaminhamentosEncerrados',
};

export const ExibirEncaminhamentosEncerrados = comDefaultProps(
  ExibirEncaminhamentosEncerradosComponent,
  ExibirEncaminhamentosEncerradosComponent.defaultProps
);
