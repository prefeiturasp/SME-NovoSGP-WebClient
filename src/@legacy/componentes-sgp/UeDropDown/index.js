import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Componentes
import { SelectComponent } from '~/componentes';

// Servicos
import AbrangenciaServico from '~/servicos/Abrangencia';

import Loader from '~/componentes/loader';

function UeDropDown({
  form,
  onChange,
  dreId,
  label,
  url,
  desabilitado,
  opcaoTodas,
  temParametros,
  modalidade,
  onChangeListaUes,
  labelRequired,
  consideraHistorico,
}) {
  const [carregando, setCarregando] = useState(false);
  const [listaUes, setListaUes] = useState([]);
  const [forcaDesabilitado, setForcaDesabilitado] = useState(false);

  useEffect(() => {
    onChangeListaUes(listaUes);
  }, [listaUes, onChangeListaUes]);

  useEffect(() => {
    async function buscarUes() {
      setCarregando(true);
      const { data } = await AbrangenciaServico.buscarUes(
        dreId,
        url,
        temParametros,
        modalidade,
        consideraHistorico
      ).finally(() => setCarregando(false));
      let lista = [];
      if (data) {
        lista = data.map(item => ({
          desc: item.nome,
          valor: item.codigo,
          id: item.id,
        }));
      }
      if (lista.length > 1) {
        if (opcaoTodas) {
          lista.unshift({ desc: 'Todas', valor: '0' });
          setForcaDesabilitado(true);
        }
      } else if (!lista.length) {
        if (opcaoTodas) {
          lista.unshift({ desc: 'Todas', valor: '0' });
          setForcaDesabilitado(true);
        }
      }
      setListaUes(lista);
    }
    if (dreId) {
      buscarUes();
    } else {
      setListaUes([]);
    }
  }, [dreId, opcaoTodas, url, modalidade]);

  useEffect(() => {
    let valorUeId;
    const valorUe = form?.values?.ueId || form?.initialValues?.ueId;
    if (valorUe && listaUes?.length > 0) {
      valorUeId = listaUes.find(a => a.valor === valorUe)?.valor;
    }
    form.setFieldValue('ueId', valorUeId);
    if (listaUes.length === 1) {
      form.setFieldValue('ueId', listaUes[0].valor);
      onChange(listaUes[0].valor, listaUes);
    }
  }, [listaUes]);

  return (
    <Loader loading={carregando} tip="">
      <SelectComponent
        form={form}
        name="ueId"
        className="fonte-14"
        label={!label ? null : label}
        onChange={a => onChange(a, listaUes, true)}
        lista={listaUes}
        valueOption="valor"
        valueText="desc"
        placeholder="Unidade Escolar (UE)"
        disabled={
          dreId === '0'
            ? forcaDesabilitado || desabilitado
            : listaUes.length === 0 || listaUes.length === 1 || desabilitado
        }
        showSearch
        labelRequired={labelRequired}
      />
    </Loader>
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
  url: PropTypes.string,
  desabilitado: PropTypes.bool,
  opcaoTodas: PropTypes.bool,
  temParametros: PropTypes.bool,
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChangeListaUes: PropTypes.func,
  labelRequired: PropTypes.bool,
};

UeDropDown.defaultProps = {
  form: {},
  onChange: () => {},
  dreId: '',
  label: null,
  url: '',
  desabilitado: false,
  opcaoTodas: false,
  temParametros: false,
  modalidade: '',
  onChangeListaUes: () => {},
  labelRequired: false,
};

export default UeDropDown;
