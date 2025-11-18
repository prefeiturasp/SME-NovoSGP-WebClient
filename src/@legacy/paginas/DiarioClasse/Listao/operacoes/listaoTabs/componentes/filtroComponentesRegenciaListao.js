import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import ListaoContext from '../../../listaoContext';
import FiltroComponentesRegencia from '@/@legacy/componentes-sgp/FiltroComponentesRegencia';

const FiltroComponentesRegenciaListao = props => {
  const {
    componentesRegenciaListao,
    setComponentesRegenciaListao,
    componenteCurricular,
  } = useContext(ListaoContext);

  const ehRegencia = componenteCurricular?.regencia;
  const ehSintese = props?.ehSintese;

  const exibirFiltro = !ehSintese && ehRegencia;

  return exibirFiltro ? (
    <FiltroComponentesRegencia
      ehRegencia={ehRegencia}
      componentesRegencia={componentesRegenciaListao}
      setComponentesRegencia={setComponentesRegenciaListao}
      codigoComponenteCurricular={
        componenteCurricular?.codigoComponenteCurricular
      }
    />
  ) : (
    <></>
  );
};

FiltroComponentesRegenciaListao.propTypes = {
  ehSintese: PropTypes.bool,
};

FiltroComponentesRegenciaListao.defaultProps = {
  ehSintese: false,
};

export default FiltroComponentesRegenciaListao;
