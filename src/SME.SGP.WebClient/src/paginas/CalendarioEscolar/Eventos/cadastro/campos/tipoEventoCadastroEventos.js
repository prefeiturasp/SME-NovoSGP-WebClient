import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect } from 'react';
import { SelectComponent } from '~/componentes';
import tipoEvento from '~/dtos/tipoEvento';
import { api } from '~/servicos';
import EventosCadastroContext from '../eventosCadastroContext';

const TipoEventoCadastroEventos = ({ form, onChangeCampos, desabilitar }) => {
  const {
    listaTipoEvento,
    setListaTipoEvento,
    setListaTipoEventoOrigem,
    setDesabilitarLetivo,
  } = useContext(EventosCadastroContext);

  const { ueId } = form.values;

  const nomeCampo = 'tipoEventoId';

  const obterTiposEvento = useCallback(async () => {
    const tiposEvento = await api.get(
      'v1/calendarios/eventos/tipos/listar?ehCadastro=true&numeroRegistros=100'
    );
    if (tiposEvento?.data?.items) {
      setListaTipoEvento([...tiposEvento.data.items]);
      setListaTipoEventoOrigem([...tiposEvento.data.items]);
    } else {
      setListaTipoEvento([]);
      setListaTipoEventoOrigem([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    obterTiposEvento();
  }, [obterTiposEvento]);

  useEffect(() => {
    if (listaTipoEvento?.length === 1 && ueId) {
      form.setFieldValue('tipoEventoId', String(listaTipoEvento[0].id));

      if (listaTipoEvento[0].id === tipoEvento.ItineranciaPAAI) {
        setDesabilitarLetivo(true);
        form.setFieldValue('letivo', 0);
      }
    }
  }, [listaTipoEvento, ueId]);

  return (
    <SelectComponent
      form={form}
      name={nomeCampo}
      lista={listaTipoEvento}
      valueOption="id"
      valueText="descricao"
      onChange={onChangeCampos}
      label="Tipo evento"
      placeholder="Selecione um tipo"
      disabled={listaTipoEvento?.length === 1 || desabilitar}
    />
  );
};

TipoEventoCadastroEventos.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
};

TipoEventoCadastroEventos.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
};

export default TipoEventoCadastroEventos;
