import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Base, CardCollapse } from '~/componentes';

import GraficoTotalEstudantesPresenciasRemotosAusentes from './graficototalEstudantesPresRemAus';

const TotalEstudantesPresenciasRemotosAusentes = ({
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

  const key = 'total-estudantes-presencias-remotos-ausentes';

  return (
    <div className="mt-3">
      <CardCollapse
        titulo="Total de estudantes presenciais, remotos e ausentes"
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
        alt={`${key}-alt`}
        configCabecalho={configCabecalho}
        show={exibir}
        onClick={() => setExibir(!exibir)}
      >
        {exibir && (
          <GraficoTotalEstudantesPresenciasRemotosAusentes
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

TotalEstudantesPresenciasRemotosAusentes.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  semestre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

TotalEstudantesPresenciasRemotosAusentes.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
  semestre: null,
};

export default TotalEstudantesPresenciasRemotosAusentes;
