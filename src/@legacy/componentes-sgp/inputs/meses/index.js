import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SelectComponent } from '~/componentes';
import { SGP_SELECT_MESES } from '~/constantes/ids/select';
import { obterTodosMeses, onchangeMultiSelect } from '@/@legacy/utils';
import { OPCAO_TODOS } from '@/@legacy/constantes';

export const Meses = ({ form, onChange, multiple, disabled }) => {
  const [lista, setLista] = useState([]);

  const montarMeses = useCallback(() => {
    const meses = obterTodosMeses();
    delete meses[0];
    meses.unshift({ numeroMes: OPCAO_TODOS, nome: 'Todos' });
    setLista(meses);
    form.setFieldValue('mesesReferencias', undefined);
  }, []);

  useEffect(() => {
    montarMeses();
  }, []);

  const setarNovoValor = newValue => {
    form.setFieldValue('mesesReferencias', newValue || '');
    form.setFieldTouched('mesesReferencias', true, true);
  };

  return (
    <SelectComponent
      name="mesesReferencias"
      form={form}
      valueOption="numeroMes"
      valueText="nome"
      lista={lista}
      label="Mês"
      labelRequired
      id={SGP_SELECT_MESES}
      placeholder="Mês"
      disabled={disabled}
      setValueOnlyOnChange
      multiple={multiple}
      onChange={valor => {
        form.setFieldValue('modoEdicao', true);

        if (multiple) {
          onchangeMultiSelect(valor, form.values?.meses, setarNovoValor);
          onChange(valor);
        } else {
          setarNovoValor(valor);
          onChange(valor);
        }
      }}
    />
  );
};

Meses.propTypes = {
  onChange: PropTypes.func,
  form: PropTypes.oneOfType([PropTypes.any]),
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
};

Meses.defaultProps = {
  form: null,
  onChange: () => null,
  multiple: true,
  disabled: false,
};
