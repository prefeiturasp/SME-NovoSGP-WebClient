import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Base, CardCollapse } from '~/componentes';

import GraficoTotalEstudantesPresenciasRemotosAusentesPorDre from './graficototalEstudantesPresRemAusPorDre';

const TotalEstudantesPresenciasRemotosAusentesPorDre = ({
  anoLetivo,
  dreId,
  ueId,
  modalidade,
  semestre,
  ehInfantil,
}) => {
  const [exibir, setExibir] = useState(false);

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const key = 'total-estudantes-presencias-remotos-ausentes-dre';
  const tipoAluno = ehInfantil ? 'crianças' : 'estudantes';

  return (
    <div className="mt-3">
      <CardCollapse
        titulo={`Total de ${tipoAluno} presenciais, remotos e ausentes por DRE`}
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

TotalEstudantesPresenciasRemotosAusentesPorDre.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  semestre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ehInfantil: PropTypes.bool,
};

TotalEstudantesPresenciasRemotosAusentesPorDre.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
  semestre: null,
  ehInfantil: false,
};

export default TotalEstudantesPresenciasRemotosAusentesPorDre;
