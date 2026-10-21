import PropTypes from 'prop-types';
import React from 'react';
import FrequenciaCardCollapse from './Frequencia/frequenciaCardCollapse';
import OcorrenciasCardCollapse from './Ocorrencias/ocorrenciasCardCollapse';

import comDefaultProps from '~/utils/comDefaultProps';
const DadosGerais = props => {
  const { semestreSelecionado } = props;

  return (
    <>
      <FrequenciaCardCollapse semestreSelecionado={semestreSelecionado} />
      <OcorrenciasCardCollapse semestreSelecionado={semestreSelecionado} />
    </>
  );
};

DadosGerais.propTypes = {
  semestreSelecionado: PropTypes.string,
};

DadosGerais.defaultProps = {
  semestreSelecionado: '',
};

export default comDefaultProps(DadosGerais, DadosGerais.defaultProps);