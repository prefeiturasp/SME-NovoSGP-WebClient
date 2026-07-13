import React from 'react';
import t from 'prop-types';
import { dateAdapter } from '@/core/date/adapter';

function DataInicioFim({ dadosAula }) {
  return (
    !!dadosAula.dataInicio &&
    !!dadosAula.dataFim &&
    dateAdapter.format(dadosAula.dataInicio, 'YYYY-MM-DD') !==
      dateAdapter.format(dadosAula.dataFim, 'YYYY-MM-DD') && (
      <span>
        <span>
          Data Início: &nbsp;
          <strong>
            {dateAdapter.format(dadosAula.dataInicio, 'DD/MM/YYYY')}
          </strong>
        </span>
        &nbsp;-&nbsp;
        <span>
          Data Fim: &nbsp;
          <strong>{dateAdapter.format(dadosAula.dataFim, 'DD/MM/YYYY')}</strong>
        </span>
      </span>
    )
  );
}

DataInicioFim.propTypes = {
  dadosAula: t.oneOfType([t.any]).isRequired,
};

export default DataInicioFim;
