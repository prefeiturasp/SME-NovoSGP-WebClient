import PropTypes from 'prop-types';
import React, { useState } from 'react';
import FechaReabCadastroContext from './fechaReabCadastroContext';

const FechaReabCadastroContextProvider = ({ children }) => {
  const [emEdicao, setEmEdicao] = useState(false);
  const [refForm, setRefForm] = useState();
  const [auditoriaFechaReab, setAuditoriaFechaReab] = useState();
  const [executaResetarTela, setExecutaResetarTela] = useState(false);
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [desabilitarCampos, setDesabilitarCampos] = useState(false);
  const [exibirLoaderReabertura, setExibirLoaderReabertura] = useState(false);
  const [listaTipoCalendarioEscolar, setListaTipoCalendarioEscolar] = useState(
    []
  );
  const [listaUes, setListaUes] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [calendarioSelecionado, setCalendarioSelecionado] = useState('');
  const [listaBimestres, setListaBimestres] = useState([]);

  const valoresIniciaisPadrao = {
    tipoCalendarioId: 0,
    dreCodigo: undefined,
    ueCodigo: undefined,
    dataInicio: '',
    dataFim: '',
    descricao: '',
    bimestres: [],
  };

  return (
    <FechaReabCadastroContext.Provider
      value={{
        valoresIniciaisPadrao,
        emEdicao,
        setEmEdicao,
        setRefForm,
        refForm,
        setAuditoriaFechaReab,
        auditoriaFechaReab,
        setExecutaResetarTela,
        executaResetarTela,
        setSomenteConsulta,
        somenteConsulta,
        setDesabilitarCampos,
        desabilitarCampos,
        setExibirLoaderReabertura,
        exibirLoaderReabertura,
        setListaTipoCalendarioEscolar,
        listaTipoCalendarioEscolar,
        setListaUes,
        listaUes,
        setListaDres,
        listaDres,
        setCalendarioSelecionado,
        calendarioSelecionado,
        setListaBimestres,
        listaBimestres,
      }}
    >
      {children}
    </FechaReabCadastroContext.Provider>
  );
};

FechaReabCadastroContextProvider.defaultProps = {
  children: {},
};

FechaReabCadastroContextProvider.propTypes = {
  children: PropTypes.node,
};

export default FechaReabCadastroContextProvider;
