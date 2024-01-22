import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SelectComponent } from '~/componentes';
import { SGP_SELECT_PERIODO_SONDAGEM } from '~/constantes/ids/select';
import { TIPO_SONDAGEM } from '@/core/enum/tipo-sondagem';

export const PeriodoSondagem = ({ form, onChange }) => {
  const [lista, setLista] = useState([]);

  const tipoSondagem = form.values?.tipoSondagem;
  const anoLetivo = form.values?.anoLetivo;

  const ANO_LETIVO_IAD_BIMESTRAL = 2022;
  const ANO_LETIVO_IAD_LP_SEMESTRAL = 2024;

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

  const tipoEhPortugues = tipo => {
    switch (Number(tipo)) {
      case TIPO_SONDAGEM.LP_CapacidadeLeitura:
      case TIPO_SONDAGEM.LP_ProducaoTexto:
      case TIPO_SONDAGEM.LP_LeituraVozAlta:
      case TIPO_SONDAGEM.LP_Escrita:
      case TIPO_SONDAGEM.LP_Leitura:
        return true;
      default:
        return false;
    }
  };

  const tipoEhPortuguesIAD = tipo => {
    switch (Number(tipo)) {
      case TIPO_SONDAGEM.LP_CapacidadeLeitura:
      case TIPO_SONDAGEM.LP_ProducaoTexto:
      case TIPO_SONDAGEM.LP_LeituraVozAlta:
        return true;
      default:
        return false;
    }
  };

  const obterPeriodos = useCallback(async () => {
    let listaSemestreBimestre = [];

    const ehMatematica = tipoEhMatematica(tipoSondagem);
    const ehPortugues = tipoEhPortugues(tipoSondagem);

    let ehSemestre = ehMatematica;

    if (ehMatematica) {
      if (anoLetivo < ANO_LETIVO_IAD_BIMESTRAL) {
        ehSemestre = true;
      } else if (anoLetivo === ANO_LETIVO_IAD_BIMESTRAL) {
        ehSemestre = false;
      } else if (
        anoLetivo > ANO_LETIVO_IAD_BIMESTRAL &&
        TIPO_SONDAGEM.MAT_IAD === Number(tipoSondagem)
      ) {
        ehSemestre = true;
      } else {
        ehSemestre = false;
      }
    } else if (ehPortugues) {
      ehSemestre = false;
      if (
        anoLetivo >= ANO_LETIVO_IAD_LP_SEMESTRAL &&
        tipoEhPortuguesIAD(tipoSondagem)
      )
        ehSemestre = true;
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
