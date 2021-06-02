import React from 'react';
import PropTypes from 'prop-types';

import { Label } from '~/componentes';

import { statusAcompanhamentoConselhoClasse } from '~/dtos';

import { DetalhesConselhoClasse } from './DetalhesConselhoClasse';
import { CardStatus } from '../CardStatus';

const SecaoConselhoClasse = ({
  dadosStatusConsselhoClasse,
  dadosTurmas,
  parametrosFiltro,
}) => {
  return (
    <>
      <Label text="Conselho de classe" className="mb-2" altura="24" />
      <div className="d-flex">
        {dadosStatusConsselhoClasse?.length ? (
          dadosStatusConsselhoClasse?.map(dadosConselhoClasse => (
            <CardStatus
              key={dadosConselhoClasse.descricao}
              dadosStatus={dadosConselhoClasse}
              statusAcompanhamento={statusAcompanhamentoConselhoClasse}
            />
          ))
        ) : (
          <Label
            text="Não foram encontrados conselhos de classe"
            className="mb-2"
            altura="16"
          />
        )}
      </div>
      <div className="row">
        {dadosStatusConsselhoClasse?.length ? (
          <DetalhesConselhoClasse
            turmaId={dadosTurmas?.turmaId}
            bimestre={parametrosFiltro?.bimestre}
          />
        ) : null}
      </div>
    </>
  );
};

SecaoConselhoClasse.defaultProps = {
  dadosStatusConsselhoClasse: {},
  dadosTurmas: {},
  parametrosFiltro: {},
};
SecaoConselhoClasse.propTypes = {
  dadosStatusConsselhoClasse: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  dadosTurmas: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  parametrosFiltro: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default SecaoConselhoClasse;
