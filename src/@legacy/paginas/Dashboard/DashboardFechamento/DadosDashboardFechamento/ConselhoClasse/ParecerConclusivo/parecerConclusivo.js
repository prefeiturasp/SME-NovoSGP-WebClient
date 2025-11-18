import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Base, CardCollapse } from '~/componentes';

import GraficoParecerConclusivo from './graficoParecerConclusivo';

const ParecerConclusivo = props => {
  const { anoLetivo, dreId, ueId, modalidade, semestre, bimestre } = props;

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(false);

  const key = 'parecer-conclusivo';

  return (
    <>
      <CardCollapse
        titulo="Parecer conclusivo"
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
        alt={`${key}-alt`}
        configCabecalho={configCabecalho}
        show={exibir}
        onClick={() => {
          setExibir(!exibir);
        }}
      >
        {exibir ? (
          <GraficoParecerConclusivo
            anoLetivo={anoLetivo}
            dreId={dreId}
            ueId={ueId}
            modalidade={modalidade}
            semestre={semestre}
            bimestre={bimestre}
          />
        ) : (
          ''
        )}
      </CardCollapse>
    </>
  );
};

ParecerConclusivo.propTypes = {
  anoLetivo: PropTypes.oneOfType([PropTypes.any]),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  semestre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  bimestre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

ParecerConclusivo.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
  semestre: null,
  bimestre: null,
};

export default ParecerConclusivo;
