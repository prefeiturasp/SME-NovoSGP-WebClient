import PropTypes from 'prop-types';
import React, { useState } from 'react';
import ListaoContext from './listaoContext';

const ListaoContextProvider = ({ children }) => {
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [anoLetivo, setAnoLetivo] = useState();
  const [codigoDre, setCodigoDre] = useState();
  const [codigoUe, setCodigoUe] = useState();
  const [modalidade, setModalidade] = useState();
  const [semestre, setSemestre] = useState();
  const [codigoTurma, setCodigoTurma] = useState();
  const [bimestre, setBimestre] = useState();

  return (
    <ListaoContext.Provider
      value={{
        consideraHistorico,
        setConsideraHistorico,
        anoLetivo,
        setAnoLetivo,
        codigoDre,
        setCodigoDre,
        codigoUe,
        setCodigoUe,
        modalidade,
        setModalidade,
        semestre,
        setSemestre,
        codigoTurma,
        setCodigoTurma,
        bimestre,
        setBimestre,
      }}
    >
      {children}
    </ListaoContext.Provider>
  );
};

ListaoContextProvider.defaultProps = {
  children: {},
};

ListaoContextProvider.propTypes = {
  children: PropTypes.node,
};

export default ListaoContextProvider;
