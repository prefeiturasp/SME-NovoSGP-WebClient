import t from 'prop-types';
import React from 'react';
import shortid from 'shortid';
import { Base, Colors } from '~/componentes';
import { TipoEvento } from '~/componentes-sgp/calendarioProfessor/Semana.css';
import { Botao } from '../styles';

function LabelAulaEvento({ dadosEvento }) {
  const montarAulaEvento = () => {
    const { ehAula, ehAulaCJ, tipoEvento } = dadosEvento;

    let label = '';
    if (ehAula && !ehAulaCJ) {
      label = 'Aula';
    }
    if (ehAula && ehAulaCJ) {
      label = 'CJ';
    }

    if (label) {
      return (
        <Botao
          id={shortid.generate()}
          label={label}
          color={
            (label === 'Aula' && Colors.Roxo) ||
            (label === 'CJ' && Colors.Laranja) ||
            Colors.CinzaBotao
          }
          className="w-100"
          height={dadosEvento.ehAula ? '38px' : 'auto'}
          border
          steady
        />
      );
    }

    return (
      <TipoEvento cor={Base.AzulEventoCalendario} className="mb-2">
        {tipoEvento}
      </TipoEvento>
    );
  };

  return montarAulaEvento();
}

LabelAulaEvento.propTypes = {
  dadosEvento: t.oneOfType([t.any]),
};

LabelAulaEvento.defaultProps = {
  dadosEvento: {},
};

export default LabelAulaEvento;
