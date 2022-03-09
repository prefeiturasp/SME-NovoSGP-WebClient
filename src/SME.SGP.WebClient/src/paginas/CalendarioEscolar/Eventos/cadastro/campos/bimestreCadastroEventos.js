import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { SelectComponent } from '~/componentes';
import { ServicoCalendarios } from '~/servicos';
import { onchangeMultiSelect } from '~/utils';

const BimestreCadastroEventos = ({
  form,
  onChangeCampos,
  tipoCalendarioId,
}) => {
  const [listaBimestres, setListaBimestres] = useState([]);

  const { bimestre } = form.values;

  const nomeCampo = 'bimestre';

  const obterBimestres = async idTipoCalendario => {
    const resposta = await ServicoCalendarios.obterBimestres(idTipoCalendario);
    if (resposta?.data) {
      const listaMap = resposta?.data.map(item => {
        return { ...item, valor: String(item.valor) };
      });
      setListaBimestres(listaMap);
    }
  };

  useEffect(() => {
    if (tipoCalendarioId) {
      obterBimestres(tipoCalendarioId);
    }
  }, [tipoCalendarioId]);

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
      valueText="desc"
      label="Bimestre"
      placeholder="Bimestre"
      multiple
      setValueOnlyOnChange
      onChange={valores => {
        onchangeMultiSelect(valores, bimestre, onChangeBimestre);
        onChangeCampos();
      }}
    />
  );
};

BimestreCadastroEventos.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  tipoCalendarioId: PropTypes.number,
};

BimestreCadastroEventos.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  tipoCalendarioId: 0,
};

export default BimestreCadastroEventos;
