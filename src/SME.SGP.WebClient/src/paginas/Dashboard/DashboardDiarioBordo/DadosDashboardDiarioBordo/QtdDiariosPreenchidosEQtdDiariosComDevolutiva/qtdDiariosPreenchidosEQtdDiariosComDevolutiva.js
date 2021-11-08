import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import GraficoQtdDiariosPreenchidosEQtdDiariosComDevolutiva from './graficoQtdDiariosPreenchidosEQtdDiariosComDevolutiva';

const QtdDiariosPreenchidosEQtdDiariosComDevolutiva = props => {
  const { anoLetivo, dreId, ueId, modalidade } = props;

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(false);

  const key = 'quantidade-total-diarios-bordos';

  return (
    <div className="mt-3">
      <CardCollapse
        titulo="Total de diários de bordos preenchidos e diários com devolutiva"
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
          <GraficoQtdDiariosPreenchidosEQtdDiariosComDevolutiva
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

QtdDiariosPreenchidosEQtdDiariosComDevolutiva.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

QtdDiariosPreenchidosEQtdDiariosComDevolutiva.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
};

export default QtdDiariosPreenchidosEQtdDiariosComDevolutiva;
