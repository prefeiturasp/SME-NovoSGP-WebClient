import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Base, CardCollapse } from '~/componentes';

import GraficoTotalEstudantesPresenciasRemotosAusentesPorDre from './graficototalEstudantesPresRemAusPorDre';

const TotalEstudantesPresenciasRemotosAusentesPorDre = ({
  anoLetivo,
  modalidade,
  semestre,
}) => {
  const [exibir, setExibir] = useState(false);

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const key = 'total-estudantes-presencias-remotos-ausentes-dre';

  return (
    <div className="mt-3">
      <CardCollapse
        titulo="Total de estudantes presenciais, remotos e ausentes por DRE"
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
        alt={`${key}-alt`}
        configCabecalho={configCabecalho}
        show={exibir}
        onClick={() => setExibir(!exibir)}
      >
        {exibir && (
          <GraficoTotalEstudantesPresenciasRemotosAusentesPorDre
            anoLetivo={anoLetivo}
            modalidade={modalidade}
            semestre={semestre}
          />
        )}
      </CardCollapse>
    </div>
  );
};

TotalEstudantesPresenciasRemotosAusentesPorDre.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  semestre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

TotalEstudantesPresenciasRemotosAusentesPorDre.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
  semestre: null,
};

export default TotalEstudantesPresenciasRemotosAusentesPorDre;
