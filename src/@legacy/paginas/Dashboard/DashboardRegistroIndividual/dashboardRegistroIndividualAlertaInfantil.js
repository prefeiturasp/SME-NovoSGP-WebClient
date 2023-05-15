import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AlertaPermiteSomenteTurmaInfantil } from '~/componentes-sgp';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { ModalidadeDTO } from '~/dtos';

const DashboardRegistroIndividualAlertaInfantil = () => {
  const { ue } = useSelector(
    store => store.dashboardRegistroIndividual?.dadosDashboardRegistroIndividual
  );

  const { modalidade } = useSelector(
    store => store.dashboardRegistroIndividual?.dadosDashboardRegistroIndividual
  );

  const [exibir, setExibir] = useState(false);

  function exibirAlerta(ue, modalidade) {
    if (!ue) return true;

    if (ue?.codigo === OPCAO_TODOS) {
      return modalidade && Number(modalidade) !== ModalidadeDTO.INFANTIL;
    }

    return !ue?.ehInfantil;
  }

  useEffect(() => {
    setExibir(exibirAlerta(ue, modalidade));
  }, [ue, modalidade]);

  return (
    <AlertaPermiteSomenteTurmaInfantil
      exibir={exibir}
      validarModalidadeFiltroPrincipal={false}
    />
  );
};

export default DashboardRegistroIndividualAlertaInfantil;
