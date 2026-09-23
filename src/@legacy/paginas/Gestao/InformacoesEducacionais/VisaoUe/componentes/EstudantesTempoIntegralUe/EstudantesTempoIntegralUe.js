import { useState } from 'react';
import PropTypes from 'prop-types';
import CardCollapse from '~/componentes/cardCollapse';
import { Base } from '~/componentes';
import EstudantesTemposIntegral from '../../../shared/EstudantesTempoIntegral/EstudantesTemposIntegral';

import comDefaultProps from '~/utils/comDefaultProps';
function EstudantesTempoIntegralUe({ ueCodigo, anoLetivo, dreCodigo }) {
  const [exibirTempoIntegralUe, setExibirTempoIntegralUe] = useState(false);

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const key = 'estudantes-integral-prof-coll';

  return (
    <>
      <CardCollapse
        titulo="Estudantes em período integral"
        show={exibirTempoIntegralUe}
        onClick={() => setExibirTempoIntegralUe(!exibirTempoIntegralUe)}
        configCabecalho={configCabecalho}
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
      >
        {exibirTempoIntegralUe && (
          <>
            <EstudantesTemposIntegral
              codigoUe={ueCodigo}
              codigoDre={dreCodigo}
              anoLetivo={anoLetivo}
            />
          </>
        )}
      </CardCollapse>
    </>
  );
}

EstudantesTempoIntegralUe.propTypes = {
  ueCodigo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dreCodigo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

EstudantesTempoIntegralUe.defaultProps = {
  ueCodigo: null,
  anoLetivo: null,
  dreCodigo: null,
};

export default comDefaultProps(EstudantesTempoIntegralUe, EstudantesTempoIntegralUe.defaultProps);