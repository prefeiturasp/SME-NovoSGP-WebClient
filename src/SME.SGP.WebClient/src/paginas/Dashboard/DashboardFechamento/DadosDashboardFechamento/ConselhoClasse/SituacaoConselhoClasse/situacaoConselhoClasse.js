import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Base, CardCollapse } from '~/componentes';

import { OPCAO_TODOS } from '~/constantes';

import GraficoSituacaoConselhoClasse from './graficoSituacaoConselhoClasse';

const SituacaoConselhoClasse = props => {
  const { anoLetivo, dreId, ueId, modalidade, semestre, bimestre } = props;

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(false);

  const key = 'situacao-conselho-classe';

  const tipoGrafico = ueId === OPCAO_TODOS ? 'Ano' : 'Turma';

  return (
    <>
      <CardCollapse
        titulo={`Situacao do conselho de classe (${tipoGrafico} X Estudantes)`}
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
          <GraficoSituacaoConselhoClasse
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

SituacaoConselhoClasse.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  semestre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  bimestre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

SituacaoConselhoClasse.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
  semestre: null,
  bimestre: null,
};

export default SituacaoConselhoClasse;
