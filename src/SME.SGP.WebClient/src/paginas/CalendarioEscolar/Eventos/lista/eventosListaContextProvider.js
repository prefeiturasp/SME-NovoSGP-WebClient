import PropTypes from 'prop-types';
import React, { useState } from 'react';
import EventosListaContext from './eventosListaContext';

const EventosListaContextProvider = ({ children }) => {
  const [codigoDre, setCodigoDre] = useState();
  const [codigoUe, setCodigoUe] = useState();
  const [calendarioSelecionado, setCalendarioSelecionado] = useState();
  const [eventosSelecionados, setEventosSelecionados] = useState([]);
  const [filtrarNovaConsulta, seFiltrarNovaConsulta] = useState(false);
  const [tipoEventoSelecionado, setTipoEventoSelecionado] = useState();
  const [nomeEvento, setNomeEvento] = useState('');
  const [dataInicio, setDataInicio] = useState();
  const [dataFim, setDataFim] = useState();
  const [exibirEventosTodaRede, setExibirEventosTodaRede] = useState(false);
  const [exibirLoaderListaEventos, setExibirLoaderListaEventos] = useState(
    false
  );

  return (
    <EventosListaContext.Provider
      value={{
        codigoDre,
        setCodigoDre,
        codigoUe,
        setCodigoUe,
        calendarioSelecionado,
        setCalendarioSelecionado,
        eventosSelecionados,
        setEventosSelecionados,
        filtrarNovaConsulta,
        seFiltrarNovaConsulta,
        tipoEventoSelecionado,
        setTipoEventoSelecionado,
        nomeEvento,
        setNomeEvento,
        dataInicio,
        setDataInicio,
        dataFim,
        setDataFim,
        exibirEventosTodaRede,
        setExibirEventosTodaRede,
        exibirLoaderListaEventos,
        setExibirLoaderListaEventos,
      }}
    >
      {children}
    </EventosListaContext.Provider>
  );
};

EventosListaContextProvider.defaultProps = {
  children: {},
};

EventosListaContextProvider.propTypes = {
  children: PropTypes.node,
};

export default EventosListaContextProvider;
