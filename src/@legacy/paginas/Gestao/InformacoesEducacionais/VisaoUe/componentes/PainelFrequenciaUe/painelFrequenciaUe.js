import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CardCollapse from '~/componentes/cardCollapse';
import { Base } from '~/componentes';
import PainelFrequenciaBase from '~/paginas/Gestao/InformacoesEducacionais/shared/PainelFrequenciaBase/PainelFrequenciaBase';
import '~/paginas/Gestao/InformacoesEducacionais/shared/PainelFrequenciaBase/painelFrequenciaBase.css';

export default function PainelFrequenciaUe({ ueCodigo, anoLetivo, nomeUe }) {
  const [exibirCard, setExibirCard] = useState(false);

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };
  const key = 'painel-frequencia-ue';

  return (
    <PainelFrequenciaBase
      tipoExtra="ue"
      codigo={ueCodigo}
      anoLetivo={anoLetivo}
    />
  );
}

PainelFrequenciaUe.propTypes = {
  ueCodigo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  anoLetivo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

PainelFrequenciaUe.defaultProps = {
  ueCodigo: null,
  anoLetivo: null,
};
