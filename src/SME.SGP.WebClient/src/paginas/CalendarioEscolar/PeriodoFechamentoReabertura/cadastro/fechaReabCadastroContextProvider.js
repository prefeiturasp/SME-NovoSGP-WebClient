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
  const [exibirLoaderSalvar, setExibirLoaderSalvar] = useState(false);

  const valoresIniciaisPadrao = {
    tipoCalendarioId: 0,
    dreId: undefined,
    ueId: undefined,
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
        setExibirLoaderSalvar,
        exibirLoaderSalvar,
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
