import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SelectComponent } from '~/componentes';
import { SGP_SELECT_PERIODO_SONDAGEM } from '~/constantes/ids/select';

export const PeriodoSondagem = ({
  name,
  form,
  onChange,
  disabled,
  showSearch,
  labelRequired,
}) => {
  const [lista, setLista] = useState([]);

  // TODO Quando for IAD Matemática realizar validação!
  const ehSemestre = false;

  const obterPeriodos = useCallback(async () => {
    let listaSemestreBimestre = [];

    if (ehSemestre) {
      listaSemestreBimestre = [
        { descricao: '1º Semestre', valor: '1' },
        { descricao: '2º Semestre', valor: '2' },
      ];
    } else {
      listaSemestreBimestre = [
        { descricao: '1º Bimestre', valor: '1' },
        { descricao: '2º Bimestre', valor: '2' },
        { descricao: '3º Bimestre', valor: '3' },
        { descricao: '4º Bimestre', valor: '4' },
      ];
    }

    form.setFieldValue(name, undefined);
    setLista(listaSemestreBimestre);
  }, [ehSemestre]);

  useEffect(() => {
    obterPeriodos();
  }, [obterPeriodos]);

  return (
    <SelectComponent
      name="periodoSondagem"
      form={form}
      valueOption="valor"
      valueText="descricao"
      lista={lista}
      label="Período"
      labelRequired
      id={SGP_SELECT_PERIODO_SONDAGEM}
      placeholder="Período"
      disabled={lista?.length === 1}
      setValueOnlyOnChange
      onChange={newValue => {
        form.setFieldValue('modoEdicao', true);

        form.setFieldValue('periodoSondagem', newValue);
        form.setFieldTouched('periodoSondagem', true, true);
        onChange(newValue);
      }}
    />
  );
};

PeriodoSondagem.propTypes = {
  onChange: PropTypes.func,
  form: PropTypes.oneOfType([PropTypes.any]),
};

PeriodoSondagem.defaultProps = {
  form: null,
  onChange: () => null,
};
