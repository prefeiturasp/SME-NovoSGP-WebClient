import React from 'react';
import CardsDashboard from '~/componentes-sgp/cardsDashboard/cardsDashboard';
import AlertasFiltroPrincipal from './alertasFiltroPrincipal';
import PendenciasGerais from './Pendencias/pendenciasGerais';

const Principal = () => {
  return (
    <div>
      <AlertasFiltroPrincipal />
      <CardsDashboard />
      <PendenciasGerais />
    </div>
  );
};

export default Principal;
