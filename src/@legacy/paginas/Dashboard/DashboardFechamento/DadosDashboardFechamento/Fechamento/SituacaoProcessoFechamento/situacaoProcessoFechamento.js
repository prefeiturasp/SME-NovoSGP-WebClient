import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import GraficoSituacaoProcessoFechamento from './graficoSituacaoProcessoFechamento';

const SituacaoProcessoFechamento = props => {
  const { anoLetivo, dreId, ueId, modalidade, semestre, bimestre } = props;

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(false);

  const key = 'situacao-processo-fechamento';

  return (
    <>
      <CardCollapse
        titulo="Situação do processo de fechamento (total de componentes por situação)"
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
          <GraficoSituacaoProcessoFechamento
            anoLetivo={anoLetivo}
            dreId={dreId}
            ueId={ueId}
            modalidade={modalidade}
            semestre={semestre}
            bimestre={bimestre}
          />
        ) : (
          ''
        )}
      </CardCollapse>
    </>
  );
};

SituacaoProcessoFechamento.propTypes = {
  anoLetivo: PropTypes.oneOfType([PropTypes.any]),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  semestre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  bimestre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

SituacaoProcessoFechamento.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
  semestre: null,
  bimestre: null,
};

export default SituacaoProcessoFechamento;
