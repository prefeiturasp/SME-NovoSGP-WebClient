import React from 'react';
import PropTypes from 'prop-types';

import EstudanteAtendidoAEE from '@/components/sgp/estudante-atendido-aee';
import EstudanteMatriculadoPAP from '@/components/sgp/estudante-matriculado-pap';

const NomeEstudanteLista = ({ nome, ehAtendidoAEE, ehMatriculadoTurmaPAP }) => {
  return (
    <div className="d-flex justify-content-between w-100">
      <span>{nome} </span>
      <div className="d-flex justify-content-end">
        <EstudanteAtendidoAEE show={ehAtendidoAEE} />
        <EstudanteMatriculadoPAP show={ehMatriculadoTurmaPAP} />
      </div>
    </div>
  );
};

NomeEstudanteLista.defaultProps = {
  nome: '',
  ehAtendidoAEE: false,
  ehMatriculadoTurmaPAP: false,
};

NomeEstudanteLista.propTypes = {
  nome: PropTypes.string,
  ehAtendidoAEE: PropTypes.bool,
  ehMatriculadoTurmaPAP: PropTypes.bool,
};

export default NomeEstudanteLista;
