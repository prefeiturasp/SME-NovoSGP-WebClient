import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import GraficoTotalRegistrosIndividuaisPorDRE from './graficoTotalRegistrosIndividuaisPorDRE';

const TotalRegistrosIndividuaisPorDRE = props => {
  const { anoLetivo, dreId, ueId, modalidade } = props;

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(false);

  const key = 'total-registros-individuais-por-dre';

  return (
    <div className="mt-3">
      <CardCollapse
        titulo="Total de registros individuais por DRE"
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
          <GraficoTotalRegistrosIndividuaisPorDRE
            anoLetivo={anoLetivo}
            dreId={dreId}
            ueId={ueId}
            modalidade={modalidade}
          />
        ) : (
          ''
        )}
      </CardCollapse>
    </div>
  );
};

TotalRegistrosIndividuaisPorDRE.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

TotalRegistrosIndividuaisPorDRE.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
};

export default TotalRegistrosIndividuaisPorDRE;
