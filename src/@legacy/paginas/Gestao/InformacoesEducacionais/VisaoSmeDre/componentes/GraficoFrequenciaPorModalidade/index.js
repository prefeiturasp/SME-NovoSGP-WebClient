import PropTypes from 'prop-types';
import { useState } from 'react';
import { Base } from '~/componentes';
import GraficoFrequenciaModalidade from './graficoFrequenciaModalidade';

import comDefaultProps from '~/utils/comDefaultProps';
const GraficoFrequenciaPorModalidade = props => {
  const { anoLetivo, dreId, ueId, modalidade, semestre, tipoVisualizacao, periodicidade } = props;

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(true);

  const key = 'frequencia-modalidade';

  return (
    <>
        {exibir ? (
         <GraficoFrequenciaModalidade
            anoLetivo={anoLetivo}
            dreId={dreId}
            ueId={ueId}
            modalidade={modalidade}
            semestre={semestre}
            tipoVisualizacao={tipoVisualizacao}
            periodicidade={periodicidade}
          />
        ) : (
          ''
        )}
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

export default comDefaultProps(GraficoFrequenciaPorModalidade, GraficoFrequenciaPorModalidade.defaultProps);