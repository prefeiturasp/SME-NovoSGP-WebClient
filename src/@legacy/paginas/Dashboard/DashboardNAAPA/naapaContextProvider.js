import PropTypes from 'prop-types';
import { useState } from 'react';
import NAAPAContext from './naapaContext';

const NAAPAContextProvider = ({ children }) => {
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [anoLetivo, setAnoLetivo] = useState();
  const [dre, setDre] = useState();
  const [ue, setUe] = useState();
  const [modalidade, setModalidade] = useState();
  const [semestre, setSemestre] = useState();
  const [listaMesesReferencias, setListaMesesReferencias] = useState([]);
  const [listaMesesReferencias2, setListaMesesReferencias2] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);

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
        listaMesesReferencias,
        setListaMesesReferencias,
        listaMesesReferencias2,
        setListaMesesReferencias2,
        listaModalidades,
        setListaModalidades,
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
