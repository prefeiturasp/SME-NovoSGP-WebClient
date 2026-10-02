import { useState } from 'react';
import PropTypes from 'prop-types';
import CardCollapse from '~/componentes/cardCollapse';
import { Base } from '~/componentes';
import PlanoAEE from '../../../shared/PlanoAEE/PlanoAEE';

import comDefaultProps from '~/utils/comDefaultProps';
function PlanoAEEUe({ ueCodigo, anoLetivo, dreCodigo }) {
  const [exibirPlanoAEEUe, setExibirPlanoAEEUe] = useState(false);

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const key = 'planoaee-prof-coll';

  return (
    <>
      <CardCollapse
        titulo="Plano de Atendimento Educacional Especializado (AEE)"
        show={exibirPlanoAEEUe}
        onClick={() => setExibirPlanoAEEUe(!exibirPlanoAEEUe)}
        configCabecalho={configCabecalho}
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
      >
        {exibirPlanoAEEUe && (
          <>
            <PlanoAEE
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

PlanoAEEUe.propTypes = {
  ueCodigo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dreCodigo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

PlanoAEEUe.defaultProps = {
  ueCodigo: null,
  anoLetivo: null,
  dreCodigo: null,
};

export default comDefaultProps(PlanoAEEUe, PlanoAEEUe.defaultProps);