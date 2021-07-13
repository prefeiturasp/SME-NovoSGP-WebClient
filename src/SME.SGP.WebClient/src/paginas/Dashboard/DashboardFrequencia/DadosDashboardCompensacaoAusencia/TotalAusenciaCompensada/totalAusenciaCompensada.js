import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Base, CardCollapse } from '~/componentes';

import GraficoTotalAusenciaCompensada from './GraficoTotalAusenciaCompensada';

const TotalAusenciaCompensada = ({
  anoLetivo,
  dreId,
  ueId,
  modalidade,
  semestre,
}) => {
  const [exibir, setExibir] = useState(false);

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const key = 'Total-ausencia-compensada';

  return (
    <div>
      <CardCollapse
        titulo="Total de ausências compensadas"
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
        alt={`${key}-alt`}
        configCabecalho={configCabecalho}
        show={exibir}
        onClick={() => {
          setExibir(!exibir);
        }}
      >
        {exibir && (
          <GraficoTotalAusenciaCompensada
            anoLetivo={anoLetivo}
            dreId={dreId}
            ueId={ueId}
            modalidade={modalidade}
            semestre={semestre}
          />
        )}
      </CardCollapse>
    </div>
  );
};

TotalAusenciaCompensada.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  semestre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

TotalAusenciaCompensada.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
  semestre: null,
};

export default TotalAusenciaCompensada;
