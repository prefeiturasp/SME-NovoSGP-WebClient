import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import GraficoQtdDiariosBordoCampoReflexoesReplanejamentoPreenchido from './graficoQtdDiariosBordoCampoReflexoesReplanejamentoPreenchido';

const QtdDiariosBordoCampoReflexoesReplanejamentoPreenchido = props => {
  const { anoLetivo, dreId, ueId, modalidade } = props;

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(false);

  const key = 'qtd-diarios-bordo-campo-reflexoes-replanejamento-preenchido';

  return (
    <div className="mt-3">
      <CardCollapse
        titulo={`Quantidade de diários de bordo com o campo "Reflexões e replanejamento" preenchido`}
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
          <GraficoQtdDiariosBordoCampoReflexoesReplanejamentoPreenchido
            anoLetivo={anoLetivo}
            dreId={dreId}
            ueId={ueId}
            modalidade={modalidade}
          />
        ) : (
          ''
        )}
      </CardCollapse>
    </div>
  );
};

QtdDiariosBordoCampoReflexoesReplanejamentoPreenchido.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

QtdDiariosBordoCampoReflexoesReplanejamentoPreenchido.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
};

export default QtdDiariosBordoCampoReflexoesReplanejamentoPreenchido;
