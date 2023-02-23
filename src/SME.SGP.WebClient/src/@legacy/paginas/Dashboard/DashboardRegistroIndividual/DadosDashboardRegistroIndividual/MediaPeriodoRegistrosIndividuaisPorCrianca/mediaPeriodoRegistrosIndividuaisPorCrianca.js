import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import GraficoMediaPeriodoPorCrianca from './graficoMediaPeriodoPorCrianca';

const MediaPeriodoRegistrosIndividuaisPorCrianca = props => {
  const { anoLetivo, dreId, ueId, modalidade } = props;

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(false);

  const key = 'media-periodo-registros-individuais-por-criança';

  return (
    <div className="mt-3">
      <CardCollapse
        titulo="Média de período dos registros individuais por criança"
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
          <GraficoMediaPeriodoPorCrianca
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

MediaPeriodoRegistrosIndividuaisPorCrianca.propTypes = {
  anoLetivo: PropTypes.oneOfType([PropTypes.any]),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

MediaPeriodoRegistrosIndividuaisPorCrianca.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
};

export default MediaPeriodoRegistrosIndividuaisPorCrianca;
