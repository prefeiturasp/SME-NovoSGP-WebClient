import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import GraficoDiariosBordoPreenchidosPendentes from './graficoDiariosBordoPreenchidosPendentes';

const DiariosBordoPreenchidosPendentes = props => {
  const { anoLetivo, dreId, ueId, modalidade } = props;

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(false);

  const key = 'diarios-bordo-preenchidos-pendentes';

  return (
    <div className="mt-3">
      <CardCollapse
        titulo="Diários de bordo preenchidos e pendentes"
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
          <GraficoDiariosBordoPreenchidosPendentes
            anoLetivo={anoLetivo}
            dreId={dreId}
            ueId={ueId}
            modalidade={modalidade}
          />
        ) : (
          <></>
        )}
      </CardCollapse>
    </div>
  );
};

DiariosBordoPreenchidosPendentes.propTypes = {
  anoLetivo: PropTypes.oneOfType([PropTypes.any]),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

DiariosBordoPreenchidosPendentes.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
};

export default DiariosBordoPreenchidosPendentes;
