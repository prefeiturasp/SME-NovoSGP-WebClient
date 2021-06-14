import React from 'react';
import { useSelector } from 'react-redux';
import { AlertaPermiteSomenteTurmaInfantil } from '~/componentes-sgp';
import { ModalidadeDTO } from '~/dtos';

const DashboardRegistroIndividualAlertaInfantil = () => {
  const { modalidade } = useSelector(
    store => store.dashboardRegistroIndividual?.dadosDashboardRegistroIndividual
  );

  return (
    <AlertaPermiteSomenteTurmaInfantil
      exibir={modalidade && Number(modalidade) !== ModalidadeDTO.INFANTIL}
      validarModalidadeFiltroPrincipal={false}
    />
  );
};

export default DashboardRegistroIndividualAlertaInfantil;
