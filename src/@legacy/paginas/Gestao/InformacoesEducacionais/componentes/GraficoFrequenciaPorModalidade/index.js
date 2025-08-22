import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import GraficoFrequenciaModalidade from './graficoFrequenciaModalidade';

const GraficoFrequenciaPorModalidade = props => {
  const { anoLetivo, dreId, ueId, modalidade, semestre, tipoVisualizacao } = props;

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(true);

  const key = 'frequencia-modalidade';

  return (
    <>
      <CardCollapse
        titulo="Frequência global por modalidade"
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
          <GraficoFrequenciaModalidade
            anoLetivo={anoLetivo}
            dreId={dreId}
            ueId={ueId}
            modalidade={modalidade}
            semestre={semestre}
            tipoVisualizacao={tipoVisualizacao}
          />
        ) : (
          ''
        )}
      </CardCollapse>
    </>
  );
};

GraficoFrequenciaPorModalidade.propTypes = {
  anoLetivo: PropTypes.oneOfType([PropTypes.any]),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  semestre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  tipoVisualizacao: PropTypes.oneOfType([PropTypes.string]),
};

GraficoFrequenciaPorModalidade.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
  semestre: null,
  tipoVisualizacao: 'global',
};

export default GraficoFrequenciaPorModalidade;
