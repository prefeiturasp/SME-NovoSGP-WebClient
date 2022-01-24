import PropTypes from 'prop-types';
import React, { useState } from 'react';
import FechaReabListaContext from './fechaReabListaContext';

const FechaReabListaContextProvider = ({ children }) => {
  const [codigoDre, setCodigoDre] = useState();
  const [codigoUe, setCodigoUe] = useState();
  const [calendarioSelecionado, setCalendarioSelecionado] = useState();
  const [idsReaberturasSelecionadas, setIdsReaberturasSelecionadas] = useState(
    []
  );
  const [filtrarNovaConsulta, seFiltrarNovaConsulta] = useState(false);
  const [exibirLoaderLista, setExibirLoaderLista] = useState(false);

  return (
    <FechaReabListaContext.Provider
      value={{
        codigoDre,
        setCodigoDre,
        codigoUe,
        setCodigoUe,
        calendarioSelecionado,
        setCalendarioSelecionado,
        idsReaberturasSelecionadas,
        setIdsReaberturasSelecionadas,
        exibirLoaderLista,
        setExibirLoaderLista,
        filtrarNovaConsulta,
        seFiltrarNovaConsulta,
      }}
    >
      {children}
    </FechaReabListaContext.Provider>
  );
};

FechaReabListaContextProvider.defaultProps = {
  children: {},
};

FechaReabListaContextProvider.propTypes = {
  children: PropTypes.node,
};

export default FechaReabListaContextProvider;
