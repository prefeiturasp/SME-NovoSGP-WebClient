import PropTypes from 'prop-types';
import React, { useState } from 'react';
import EventosListaContext from './eventosListaContext';

const EventosListaContextProvider = ({ children }) => {
  const [listaDres, setListaDres] = useState([]);
  const [codigoDre, setCodigoDre] = useState();
  const [listaUes, setListaUes] = useState([]);
  const [codigoUe, setCodigoUe] = useState();
  const [listaCalendarios, setListaCalendarios] = useState([]);
  const [calendarioSelecionado, setCalendarioSelecionado] = useState();
  const [eventosSelecionados, setEventosSelecionados] = useState([]);
  const [filtrarNovaConsulta, seFiltrarNovaConsulta] = useState(false);
  const [listaTipoEventos, setListaTipoEventos] = useState([]);
  const [tipoEventoSelecionado, setTipoEventoSelecionado] = useState();
  const [nomeEvento, setNomeEvento] = useState('');
  const [dataInicio, setDataInicio] = useState();
  const [dataFim, setDataFim] = useState();
  const [exibirEventosTodaRede, setExibirEventosTodaRede] = useState(false);

  return (
    <EventosListaContext.Provider
      value={{
        listaDres,
        setListaDres,
        codigoDre,
        setCodigoDre,
        listaUes,
        setListaUes,
        codigoUe,
        setCodigoUe,
        calendarioSelecionado,
        setCalendarioSelecionado,
        listaCalendarios,
        setListaCalendarios,
        eventosSelecionados,
        setEventosSelecionados,
        filtrarNovaConsulta,
        seFiltrarNovaConsulta,
        listaTipoEventos,
        setListaTipoEventos,
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
