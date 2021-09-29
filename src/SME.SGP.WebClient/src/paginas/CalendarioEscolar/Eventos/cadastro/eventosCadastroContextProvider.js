import PropTypes from 'prop-types';
import React, { useState } from 'react';
import EventosCadastroContext from './eventosCadastroContext';

const EventosCadastroContextProvider = ({ children }) => {
  const [emEdicao, setEmEdicao] = useState(false);
  const [podeAlterarEvento, setPodeAlterarEvento] = useState(true);
  const [refFormEventos, setRefFormEventos] = useState();
  const [executaResetarTela, setExecutaResetarTela] = useState(false);
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [podeAlterarExcluir, setPodeAlterarExcluir] = useState(true);
  const [desabilitarCampos, setDesabilitarCampos] = useState(false);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaCalendarios, setListaCalendarios] = useState([]);
  const [listaTipoEvento, setListaTipoEvento] = useState([]);
  const [listaTipoEventoOrigem, setListaTipoEventoOrigem] = useState([]);
  const [
    eventoTipoFeriadoSelecionado,
    setEventoTipoFeriadoSelecionado,
  ] = useState(false);
  const [
    eventoTipoLocalOcorrenciaSMESelecionado,
    setEventoTipoLocalOcorrenciaSMESelecionado,
  ] = useState(false);
  const [listaFeriados, setListaFeriados] = useState([]);
  const [desabilitarOpcaoLetivo, setDesabilitarOpcaoLetivo] = useState(true);
  const [tipoDataUnico, setTipoDataUnico] = useState(true);
  const [recorrencia, setRecorrencia] = useState(null);
  const [showModalRecorrencia, setShowModalRecorrencia] = useState(false);
  const [desabilitarLetivo, setDesabilitarLetivo] = useState(false);
  const [listaCalendarioEscolar, setListaCalendarioEscolar] = useState([]);
  const [
    listaCalendarioParaCopiarInicial,
    setListaCalendarioParaCopiarInicial,
  ] = useState([]);
  const [listaCalendarioParaCopiar, setListaCalendarioParaCopiar] = useState(
    []
  );
  const [exibirModalCopiarEvento, setExibirModalCopiarEvento] = useState(false);
  const [
    exibirModalRetornoCopiarEvento,
    setExibirModalRetornoCopiarEvento,
  ] = useState(false);
  const [listaMensagensCopiarEvento, setListaMensagensCopiarEvento] = useState(
    []
  );
  const [auditoriaEventos, setAuditoriaEventos] = useState({});
  const [exibirLoaderSalvar, setExibirLoaderSalvar] = useState(false);
  const [aguardandoAprovacao, setAguardandoAprovacao] = useState(false);

  const valoresIniciaisPadrao = {
    dataFim: '',
    dataInicio: '',
    descricao: '',
    dreId: '',
    feriadoId: '',
    letivo: 1,
    nome: '',
    tipoCalendarioId: '',
    tipoEventoId: '',
    ueId: '',
    recorrenciaEventos: null,
    bimestre: [],
  };

  return (
    <EventosCadastroContext.Provider
      value={{
        valoresIniciaisPadrao,
        emEdicao,
        setEmEdicao,
        podeAlterarEvento,
        setPodeAlterarEvento,
        refFormEventos,
        setRefFormEventos,
        executaResetarTela,
        setExecutaResetarTela,
        somenteConsulta,
        setSomenteConsulta,
        podeAlterarExcluir,
        setPodeAlterarExcluir,
        desabilitarCampos,
        setDesabilitarCampos,
        listaDres,
        setListaDres,
        listaUes,
        setListaUes,
        listaCalendarios,
        setListaCalendarios,
        listaTipoEvento,
        setListaTipoEvento,
        listaTipoEventoOrigem,
        setListaTipoEventoOrigem,
        eventoTipoFeriadoSelecionado,
        setEventoTipoFeriadoSelecionado,
        eventoTipoLocalOcorrenciaSMESelecionado,
        setEventoTipoLocalOcorrenciaSMESelecionado,
        listaFeriados,
        setListaFeriados,
        desabilitarOpcaoLetivo,
        setDesabilitarOpcaoLetivo,
        tipoDataUnico,
        setTipoDataUnico,
        recorrencia,
        setRecorrencia,
        setShowModalRecorrencia,
        showModalRecorrencia,
        desabilitarLetivo,
        setDesabilitarLetivo,
        listaCalendarioEscolar,
        setListaCalendarioEscolar,
        listaCalendarioParaCopiarInicial,
        setListaCalendarioParaCopiarInicial,
        listaCalendarioParaCopiar,
        setListaCalendarioParaCopiar,
        exibirModalCopiarEvento,
        setExibirModalCopiarEvento,
        exibirModalRetornoCopiarEvento,
        setExibirModalRetornoCopiarEvento,
        listaMensagensCopiarEvento,
        setListaMensagensCopiarEvento,
        auditoriaEventos,
        setAuditoriaEventos,
        exibirLoaderSalvar,
        setExibirLoaderSalvar,
        aguardandoAprovacao,
        setAguardandoAprovacao,
      }}
    >
      {children}
    </EventosCadastroContext.Provider>
  );
};

EventosCadastroContextProvider.defaultProps = {
  children: {},
};

EventosCadastroContextProvider.propTypes = {
  children: PropTypes.node,
};

export default EventosCadastroContextProvider;
