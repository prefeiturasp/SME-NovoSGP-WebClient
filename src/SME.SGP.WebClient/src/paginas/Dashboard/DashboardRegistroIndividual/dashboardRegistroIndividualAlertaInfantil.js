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

  useEffect(() => {
    let exibirAlerta = false;

    if (ue && ue?.codigo === OPCAO_TODOS) {
      exibirAlerta =
        modalidade && Number(modalidade) !== ModalidadeDTO.INFANTIL;
    } else {
      exibirAlerta = ue && !ue?.ehInfantil;
    }

    setExibir(exibirAlerta);
  }, [ue, modalidade]);

  return (
    <AlertaPermiteSomenteTurmaInfantil
      exibir={exibir}
      validarModalidadeFiltroPrincipal={false}
    />
  );
};

export default DashboardRegistroIndividualAlertaInfantil;
