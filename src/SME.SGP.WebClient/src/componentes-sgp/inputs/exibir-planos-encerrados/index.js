import React from 'react';
import PropTypes from 'prop-types';
import { RadioGroupButton } from '~/componentes';
import { SGP_RADIO_EXIBIR_PLANOS_ENCERRADOS } from '~/constantes/ids/radio';

export const ExibirPlanosEncerrados = ({
  name,
  form,
  onChange,
  disabled,
  valorInicial,
}) => {
  const opcoesExibirPlanosEncerrados = [
    { label: 'Sim', value: true },
    { label: 'Não', value: false },
  ];

  return (
    <RadioGroupButton
      name={name}
      form={form}
      onChange={onChange()}
      desabilitado={disabled}
      valorInicial={valorInicial}
      label="Exibir planos encerrados"
      opcoes={opcoesExibirPlanosEncerrados}
      id={SGP_RADIO_EXIBIR_PLANOS_ENCERRADOS}
    />
  );
};

ExibirPlanosEncerrados.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  valorInicial: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

ExibirPlanosEncerrados.defaultProps = {
  form: null,
  disabled: false,
  valorInicial: false,
  onChange: () => null,
  name: 'exibirPlanosEncerrados',
};
