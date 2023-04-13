import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SelectComponent } from '~/componentes';
import { SGP_SELECT_PERIODO_SONDAGEM } from '~/constantes/ids/select';
import { TIPO_SONDAGEM } from 'core/enum/tipo-sondagem';

export const PeriodoSondagem = ({
  form,
  onChange,
  disabled,
  showSearch,
  labelRequired,
}) => {
  const [lista, setLista] = useState([]);

  const tipoSondagem = form.values?.tipoSondagem;
  const anoLetivo = form.values?.anoLetivo;

  const ANO_LETIVO_IAD_BIMESTRE = 2022;

  const tipoEhMatematica = tipo => {
    switch (Number(tipo)) {
      case TIPO_SONDAGEM.MAT_Numeros:
      case TIPO_SONDAGEM.MAT_CampoAditivo:
      case TIPO_SONDAGEM.MAT_CampoMultiplicativo:
      case TIPO_SONDAGEM.MAT_IAD:
        return true;
      default:
        return false;
    }
  };

  const obterPeriodos = useCallback(async () => {
    let listaSemestreBimestre = [];

    const ehMatematica = tipoEhMatematica(tipoSondagem);

    let ehSemestre = ehMatematica;

    if (ehMatematica) {
      if (anoLetivo < ANO_LETIVO_IAD_BIMESTRE) {
        ehSemestre = true;
      } else if (anoLetivo === ANO_LETIVO_IAD_BIMESTRE) {
        ehSemestre = false;
      } else if (
        anoLetivo > ANO_LETIVO_IAD_BIMESTRE &&
        TIPO_SONDAGEM.MAT_IAD === Number(tipoSondagem)
      ) {
        ehSemestre = true;
      } else {
        ehSemestre = false;
      }
    }

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

    form.setFieldValue('periodoSondagem', undefined);
    setLista(listaSemestreBimestre);
  }, [anoLetivo, tipoSondagem]);

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
