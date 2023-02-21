import PropTypes from 'prop-types';
import React, { useContext, useEffect } from 'react';
import { SelectComponent } from '~/componentes';
import EventosCadastroContext from '../eventosCadastroContext';

const CalendarioCadastroEventos = ({
  form,
  eventoId,
  tipoCalendarioIdRota,
  montarTipoCalendarioPorId,
}) => {
  const { listaCalendarios } = useContext(EventosCadastroContext);

  const { tipoCalendarioId } = form.values;

  const nomeCampo = 'tipoCalendarioId';

  useEffect(() => {
    // Novo registro!
    if (!eventoId && tipoCalendarioIdRota) {
      montarTipoCalendarioPorId(tipoCalendarioIdRota, form);
    }

  }, [eventoId, tipoCalendarioIdRota]);

  useEffect(() => {
    // Carregando um registor salvo!
    if (eventoId && tipoCalendarioId) {
      montarTipoCalendarioPorId(tipoCalendarioId, form);
    }

  }, [eventoId, tipoCalendarioId]);

  return (
    <SelectComponent
      form={form}
      name={nomeCampo}
      id="calendario-escolar"
      lista={listaCalendarios}
      valueOption="id"
      valueText="descricaoTipoCalendario"
      disabled
    />
  );
};

CalendarioCadastroEventos.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  eventoId: PropTypes.number,
  tipoCalendarioIdRota: PropTypes.number,
  montarTipoCalendarioPorId: PropTypes.func,
};

CalendarioCadastroEventos.defaultProps = {
  form: null,
  eventoId: 0,
  tipoCalendarioIdRota: 0,
  montarTipoCalendarioPorId: () => null,
};

export default CalendarioCadastroEventos;
