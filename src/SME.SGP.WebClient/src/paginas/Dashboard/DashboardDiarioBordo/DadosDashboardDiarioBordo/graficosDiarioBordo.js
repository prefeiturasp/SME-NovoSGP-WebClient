import React from 'react';
import { useSelector } from 'react-redux';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { ModalidadeDTO } from '~/dtos';
import DiariosBordoPreenchidosPendentes from './DiariosBordoPreenchidosPendentes/diariosBordoPreenchidosPendentes';
import TotalDiariosBordoPorDRE from './TotalDiariosBordoPorDRE/totalDiariosBordoPorDRE';

const GraficosDiarioBordo = () => {
  const anoLetivo = useSelector(
    store => store.dashboardDiarioBordo?.dadosDashboardDiarioBordo?.anoLetivo
  );
  const dre = useSelector(
    store => store.dashboardDiarioBordo?.dadosDashboardDiarioBordo?.dre
  );
  const ue = useSelector(
    store => store.dashboardDiarioBordo?.dadosDashboardDiarioBordo?.ue
  );
  const modalidade = useSelector(
    store => store.dashboardDiarioBordo?.dadosDashboardDiarioBordo?.modalidade
  );

  const dreId = OPCAO_TODOS === dre?.codigo ? OPCAO_TODOS : dre?.id;
  const ueId = OPCAO_TODOS === ue?.codigo ? OPCAO_TODOS : ue?.id;

  const naoEhInfantil =
    modalidade && Number(modalidade) !== ModalidadeDTO.INFANTIL;

  return anoLetivo && dre && ue && modalidade && !naoEhInfantil ? (
    <>
      {dre?.codigo === OPCAO_TODOS ? (
        <TotalDiariosBordoPorDRE
          anoLetivo={anoLetivo}
          dreId={dreId}
          ueId={ueId}
          modalidade={modalidade}
        />
      ) : (
        <></>
      )}
      <DiariosBordoPreenchidosPendentes
        anoLetivo={anoLetivo}
        dreId={dreId}
        ueId={ueId}
        modalidade={modalidade}
      />
    </>
  ) : (
    ''
  );
};

export default GraficosDiarioBordo;
