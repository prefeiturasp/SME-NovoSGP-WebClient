import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Componentes
import { SelectComponent } from '~/componentes';

// Servicos
import AtribuicaoEsporadicaServico from '~/servicos/Paginas/AtribuicaoEsporadica';

function UeDropDown({
  form,
  onChange,
  dreId,
  label,
  desabilitado,
  preencherLista,
  labelRequired,
}) {
  const [listaUes, setListaUes] = useState([]);

  const ehInfantil = valor => {
    if (listaUes && listaUes.length) {
      const ue = listaUes.find(item => item.valor === valor);
      return ue && ue.ehInfantil;
    }
    return false;
  };

  async function buscarUes() {
    const { data } = await AtribuicaoEsporadicaServico.buscarUes(dreId);
    if (data) {
      const lista = data.map(item => ({
        id: item.id,
        desc: item.nome,
        valor: item.codigo,
        ehInfantil: item.ehInfantil,
      }));
      setListaUes(lista);
      preencherLista(lista);
      if (lista.length === 1) {
        form.setFieldValue('ueId', lista[0].valor);
        onChange(lista[0].valor, lista[0].ehInfantil, lista);
      }
    }
  }

  useEffect(() => {
    if (dreId) {
      buscarUes();
    } else {
      setListaUes([]);
      form.setFieldValue('ueId', undefined);
    }

  }, [dreId]);

  return (
    <SelectComponent
      form={form}
      name="ueId"
      className="fonte-14"
      label={!label ? null : label}
      onChange={v => {
        onChange(v, ehInfantil(v), listaUes);
      }}
      lista={listaUes}
      valueOption="valor"
      valueText="desc"
      placeholder="Unidade Escolar (UE)"
      disabled={listaUes.length === 1 || desabilitado}
      showSearch
      labelRequired={labelRequired}
    />
  );
}

UeDropDown.propTypes = {
  form: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.object),
    PropTypes.any,
  ]),
  onChange: PropTypes.func,
  dreId: PropTypes.string,
  label: PropTypes.string,
  desabilitado: PropTypes.bool,
  preencherLista: PropTypes.func,
  labelRequired: PropTypes.bool,
};

UeDropDown.defaultProps = {
  form: {},
  onChange: () => {},
  dreId: '',
  label: null,
  desabilitado: null,
  preencherLista: () => {},
  labelRequired: false,
};

export default UeDropDown;
