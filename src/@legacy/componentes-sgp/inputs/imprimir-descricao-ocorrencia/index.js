import PropTypes from 'prop-types';
import { RadioGroupButton } from '~/componentes';
import { SGP_RADIO_DESCRICAO_OCORRENCIA } from '~/constantes/ids/radio';

export const ImprimirDescricaoOcorrencia = ({
  name,
  form,
  onChange,
  disabled,
  valorInicial,
  labelRequired,
}) => {
  const opcoes = [
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
      label="Imprimir descrição da ocorrência"
      opcoes={opcoes}
      id={SGP_RADIO_DESCRICAO_OCORRENCIA}
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

ImprimirDescricaoOcorrencia.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  valorInicial: PropTypes.bool,
  labelRequired: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

ImprimirDescricaoOcorrencia.defaultProps = {
  form: null,
  disabled: false,
  valorInicial: false,
  labelRequired: false,
  onChange: () => null,
  name: 'imprimirDescricaoOcorrencia',
};
