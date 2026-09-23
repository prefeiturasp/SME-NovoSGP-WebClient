import { useState, useEffect, useCallback } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import CardCollapse from '~/componentes/cardCollapse';
import { Base } from '~/componentes';
import TabelaAbandonoPorModalidade from './TabelaAbandonoPorModalidade';
import comDefaultProps from '~/utils/comDefaultProps';
import './tabelaAbandonoUe.css';

function TabelaAbandonoUe({ ueCodigo, anoLetivo, dreCodigo }) {
  const [exibirAbandonoUe, setExibirAbandonoUe] = useState(false);

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const key = 'abandono-prof-coll';

  return (
    <>
      <CardCollapse
        titulo="Abandono"
        show={exibirAbandonoUe}
        onClick={() => setExibirAbandonoUe(!exibirAbandonoUe)}
        configCabecalho={configCabecalho}
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
      >
        {exibirAbandonoUe && (
          <>
            <p className="tabela-abandono-custom-desc">
              É a quantidade de estudantes cadastrados no EOL, do ensino
              infantil ao ensino médio, classificados como desistentes ou
              abandono.
            </p>
            <TabelaAbandonoPorModalidade
              codigoUe={ueCodigo}
              codigoDre={dreCodigo}
              anoLetivo={anoLetivo}
              modalidade="Ensino Fundamental"
            />
            <TabelaAbandonoPorModalidade
              codigoUe={ueCodigo}
              codigoDre={dreCodigo}
              anoLetivo={anoLetivo}
              modalidade="Ensino Médio"
            />
            <TabelaAbandonoPorModalidade
              codigoUe={ueCodigo}
              codigoDre={dreCodigo}
              anoLetivo={anoLetivo}
              modalidade="CIEJA"
            />
            <TabelaAbandonoPorModalidade
              codigoUe={ueCodigo}
              codigoDre={dreCodigo}
              anoLetivo={anoLetivo}
              modalidade="Educação Infantil"
            />
            <TabelaAbandonoPorModalidade
              codigoUe={ueCodigo}
              codigoDre={dreCodigo}
              anoLetivo={anoLetivo}
              modalidade="Educação de Jovens e Adultos"
            />
            <TabelaAbandonoPorModalidade
              codigoUe={ueCodigo}
              codigoDre={dreCodigo}
              anoLetivo={anoLetivo}
              modalidade="ETEC"
            />
          </>
        )}
      </CardCollapse>
    </>
  );
}

TabelaAbandonoUe.propTypes = {
  ueCodigo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dreCodigo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

TabelaAbandonoUe.defaultProps = {
  ueCodigo: null,
  anoLetivo: null,
  dreCodigo: null,
};

export default comDefaultProps(TabelaAbandonoUe, TabelaAbandonoUe.defaultProps);