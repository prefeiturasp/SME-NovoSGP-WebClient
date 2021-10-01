import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import DadosMuralGoogleSalaAula from './dadosMuralGoogleSalaAula';

const MuralGoogleSalaAula = props => {
  const { aulaId, podeAlterar } = props;

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(false);

  const key = 'mural-google-sala-aula';

  return (
    <CardCollapse
      titulo="Mural do Google Sala de Aula"
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
        <DadosMuralGoogleSalaAula aulaId={aulaId} podeAlterar={podeAlterar} />
      ) : (
        ''
      )}
    </CardCollapse>
  );
};

MuralGoogleSalaAula.propTypes = {
  aulaId: PropTypes.number,
  podeAlterar: PropTypes.bool,
};

MuralGoogleSalaAula.defaultProps = {
  aulaId: 0,
  podeAlterar: true,
};

export default MuralGoogleSalaAula;
