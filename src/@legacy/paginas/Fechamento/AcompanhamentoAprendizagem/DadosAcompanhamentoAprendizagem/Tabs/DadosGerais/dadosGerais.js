import PropTypes from 'prop-types';
import React from 'react';
import FrequenciaCardCollapse from './Frequencia/frequenciaCardCollapse';
import OcorrenciasCardCollapse from './Ocorrencias/ocorrenciasCardCollapse';

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

export default DadosGerais;
