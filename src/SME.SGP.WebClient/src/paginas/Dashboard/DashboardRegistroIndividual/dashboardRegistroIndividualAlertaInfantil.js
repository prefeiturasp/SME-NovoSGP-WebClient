import React from 'react';
import { useSelector } from 'react-redux';
import { AlertaPermiteSomenteTurmaInfantil } from '~/componentes-sgp';

const DashboardRegistroIndividualAlertaInfantil = () => {
  const { ue } = useSelector(
    store => store.dashboardRegistroIndividual?.dadosDashboardRegistroIndividual
  );

  return (
    <AlertaPermiteSomenteTurmaInfantil
      exibir={ue && !ue?.ehInfantil}
      validarModalidadeFiltroPrincipal={false}
    />
  );
};

export default DashboardRegistroIndividualAlertaInfantil;
