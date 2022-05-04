import PropTypes from 'prop-types';
import React, { useState } from 'react';
import NAAPAContext from './naapaContext';

const NAAPAContextProvider = ({ children }) => {
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [anoLetivo, setAnoLetivo] = useState();
  const [dre, setDre] = useState();
  const [ue, setUe] = useState();
  const [modalidade, setModalidade] = useState();
  const [semestre, setSemestre] = useState();

  return (
    <NAAPAContext.Provider
      value={{
        consideraHistorico,
        setConsideraHistorico,
        anoLetivo,
        setAnoLetivo,
        dre,
        setDre,
        ue,
        setUe,
        modalidade,
        setModalidade,
        semestre,
        setSemestre,
      }}
    >
      {children}
    </NAAPAContext.Provider>
  );
};

NAAPAContextProvider.defaultProps = {
  children: {},
};

NAAPAContextProvider.propTypes = {
  children: PropTypes.node,
};

export default NAAPAContextProvider;
