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
  const [listaUes, setListaUes] = useState([]);
  const [listaCalendarios, setListaCalendarios] = useState([]);
  const [listaTipoEvento, setListaTipoEvento] = useState([]);
  const [listaTipoEventoOrigem, setListaTipoEventoOrigem] = useState([]);
  const [desabilitarLetivo, setDesabilitarLetivo] = useState(false);
  const [listaCalendarioEscolar, setListaCalendarioEscolar] = useState([]);
  const [exibirLoaderSalvar, setExibirLoaderSalvar] = useState(false);
  const [exibirModalCopiarEvento, setExibirModalCopiarEvento] = useState(false);
  const [
    listaCalendarioParaCopiarInicial,
    setListaCalendarioParaCopiarInicial,
  ] = useState([]);
  const [exibirModalRetornoCopiarEvento, setExibirModalRetornoCopiarEvento] =
    useState(false);
  const [listaCalendarioParaCopiar, setListaCalendarioParaCopiar] = useState(
    []
  );
  const [listaMensagensCopiarEvento, setListaMensagensCopiarEvento] = useState(
    []
  );

  const [aguardandoAprovacao, setAguardandoAprovacao] = useState(false);
  const [limparRecorrencia, setLimparRecorrencia] = useState(false);

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
        listaUes,
        setListaUes,
        listaCalendarios,
        setListaCalendarios,
        listaTipoEvento,
        setListaTipoEvento,
        listaTipoEventoOrigem,
        setListaTipoEventoOrigem,
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
        exibirLoaderSalvar,
        setExibirLoaderSalvar,
        aguardandoAprovacao,
        setAguardandoAprovacao,
        limparRecorrencia,
        setLimparRecorrencia,
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
