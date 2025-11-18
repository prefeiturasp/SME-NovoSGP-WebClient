import { useState } from 'react';
import PropTypes from 'prop-types';
import CardCollapse from '~/componentes/cardCollapse';
import { Base } from '~/componentes';
import DistorcaoIdadeSerie from '../../../shared/DistorcaoIdadeSerie/DistorcaoIdadeSerie';

function DistorcaoIdadeSerieUe({ ueCodigo, anoLetivo, dreCodigo }) {
  const [exibirDistorcaoUe, setExibirDistorcaoUe] = useState(false);

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const key = 'distorcao-prof-coll';

  return (
    <>
      <CardCollapse
        titulo="Distorção idade-série"
        show={exibirDistorcaoUe}
        onClick={() => setExibirDistorcaoUe(!exibirDistorcaoUe)}
        configCabecalho={configCabecalho}
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
      >
        {exibirDistorcaoUe && (
          <>
            <DistorcaoIdadeSerie
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

DistorcaoIdadeSerieUe.propTypes = {
  ueCodigo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dreCodigo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

DistorcaoIdadeSerieUe.defaultProps = {
  ueCodigo: null,
  anoLetivo: null,
  dreCodigo: null,
};

export default DistorcaoIdadeSerieUe;
