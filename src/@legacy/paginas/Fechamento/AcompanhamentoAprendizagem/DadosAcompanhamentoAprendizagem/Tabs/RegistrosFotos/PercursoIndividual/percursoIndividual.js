import React, { useState } from 'react';
import CardCollapse from '~/componentes/cardCollapse';
import CampoPercursoIndividual from './campoPercursoIndividual';

const PercursoIndividual = () => {
  const [exibir, setExibir] = useState(false);

  return (
    <div className="col-md-12 mb-2">
      <CardCollapse
        key="percurso-individual-collapse"
        titulo="Percurso individual da criança"
        indice="percurso-individual"
        alt="percurso-individual"
        show={exibir}
        onClick={() => setExibir(!exibir)}
      >
        <CampoPercursoIndividual />
      </CardCollapse>
    </div>
  );
};

export default PercursoIndividual;
