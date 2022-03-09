import PropTypes from 'prop-types';
import React, { useContext, useEffect } from 'react';
import { SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { modalidadeTipoCalendario } from '~/dtos';
import { onchangeMultiSelect } from '~/utils';
import FechaReabCadastroContext from '../fechaReabCadastroContext';

const BimestreReabertura = ({ form, onChangeCampos }) => {
  const {
    desabilitarCampos,
    calendarioSelecionado,
    setListaBimestres,
    listaBimestres,
  } = useContext(FechaReabCadastroContext);

  const { bimestres } = form.values;

  const nomeCampo = 'bimestres';

  const montarListaBimestres = tipoModalidade => {
    const listaNova = [
      {
        valor: 1,
        descricao: 'Primeiro Bimestre',
      },
      {
        valor: 2,
        descricao: 'Segundo Bimestre',
      },
    ];

    if (tipoModalidade !== modalidadeTipoCalendario.EJA) {
      listaNova.push(
        {
          valor: 3,
          descricao: 'Terceiro Bimestre',
        },
        {
          valor: 4,
          descricao: 'Quarto Bimestre',
        }
      );
    }

    listaNova.push({
      valor: OPCAO_TODOS,
      descricao: 'Todos',
    });
    setListaBimestres(listaNova);
  };

  useEffect(() => {
    if (calendarioSelecionado?.modalidade) {
      montarListaBimestres(calendarioSelecionado?.modalidade);
    } else {
      setListaBimestres([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarioSelecionado]);

  const onChangeBimestre = novosValores => {
    form.setFieldValue(nomeCampo, novosValores || []);
    form.setFieldTouched(nomeCampo, true, true);
  };

  return (
    <SelectComponent
      form={form}
      name={nomeCampo}
      lista={listaBimestres}
      valueOption="valor"
      valueText="descricao"
      label="Bimestre"
      placeholder="Selecione bimestre(s)"
      multiple
      setValueOnlyOnChange
      disabled={desabilitarCampos}
      onChange={valores => {
        onchangeMultiSelect(valores, bimestres, onChangeBimestre);
        onChangeCampos();
      }}
    />
  );
};

BimestreReabertura.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
};

BimestreReabertura.defaultProps = {
  form: null,
  onChangeCampos: () => null,
};

export default BimestreReabertura;
