import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import CardCollapse from '~/componentes/cardCollapse';
import { Base } from '~/componentes';
import TabelaEstudantesReclassificados from '../../../shared/estudantesReclassificados/tabelaEstudantesReclassificados';

function Reclassificados({ ueCodigo, anoLetivo, dreCodigo }) {
  const [exibirReclassificadosUe, setExibirReclassificadosUe] = useState(false);

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const key = 'reclassificados-prof-coll';

  return (
    <>
      <CardCollapse
        titulo="Estudantes reclassificados"
        show={exibirReclassificadosUe}
        onClick={() => setExibirReclassificadosUe(!exibirReclassificadosUe)}
        configCabecalho={configCabecalho}
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
      >
        {exibirReclassificadosUe && (
          <>
            <TabelaEstudantesReclassificados
              codigoUe={ueCodigo}
              codigoDre={dreCodigo}
              anoLetivo={anoLetivo}
            />
          </>
        )}
      </CardCollapse>
    </>
  );
}

Reclassificados.propTypes = {
  ueCodigo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dreCodigo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Reclassificados.defaultProps = {
  ueCodigo: null,
  anoLetivo: null,
  dreCodigo: null,
};

export default Reclassificados;
