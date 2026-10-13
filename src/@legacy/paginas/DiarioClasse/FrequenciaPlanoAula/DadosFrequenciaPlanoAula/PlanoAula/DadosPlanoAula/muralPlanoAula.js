import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import MuralGoogleSalaAula from '~/componentes-sgp/MuralGoogleSalaAula/muralGoogleSalaAula';

import comDefaultProps from '~/utils/comDefaultProps';
const MuralPlanoAula = props => {
  const { aulaId } = props;

  const desabilitarCamposPlanoAula = useSelector(
    state => state.frequenciaPlanoAula.desabilitarCamposPlanoAula
  );

  return (
    <div className="mt-3 mb-3">
      <MuralGoogleSalaAula
        aulaId={aulaId}
        podeAlterar={!desabilitarCamposPlanoAula}
      />
    </div>
  );
};

MuralPlanoAula.propTypes = {
  aulaId: PropTypes.number,
};

MuralPlanoAula.defaultProps = {
  aulaId: 0,
};

export default comDefaultProps(MuralPlanoAula, MuralPlanoAula.defaultProps);