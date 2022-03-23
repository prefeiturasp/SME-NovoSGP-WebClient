import React from 'react';
import { useSelector } from 'react-redux';
import { OPCAO_TODOS } from '~/constantes';
import { ModalidadeDTO } from '~/dtos';
import QtdDevolutivasRegistradasEstimada from './QtdDevolutivasRegistradasEstimada/qtdDevolutivasRegistradasEstimada';
import QtdDiarioBordoDevolutiva from './QtdDiarioBordoDevolutiva/qtdDiarioBordoDevolutiva';
import QtdDiariosBordoCampoReflexoesReplanejamentoPreenchido from './QtdDiariosBordoCampoReflexoesReplanejamentoPreenchido/qtdDiariosBordoCampoReflexoesReplanejamentoPreenchido';
import TotalDevolutivasPorDRE from './TotalDevolutivasPorDRE/totalDevolutivasPorDRE';

const GraficosDevolutivas = () => {
  const anoLetivo = useSelector(
    store => store.dashboardDevolutivas?.dadosDashboardDevolutivas?.anoLetivo
  );
  const dre = useSelector(
    store => store.dashboardDevolutivas?.dadosDashboardDevolutivas?.dre
  );
  const ue = useSelector(
    store => store.dashboardDevolutivas?.dadosDashboardDevolutivas?.ue
  );
  const modalidade = useSelector(
    store => store.dashboardDevolutivas?.dadosDashboardDevolutivas?.modalidade
  );

  const dreId = OPCAO_TODOS === dre?.codigo ? OPCAO_TODOS : dre?.id;
  const ueId = OPCAO_TODOS === ue?.codigo ? OPCAO_TODOS : ue?.id;

  const naoEhInfantil =
    modalidade && Number(modalidade) !== ModalidadeDTO.INFANTIL;

  return anoLetivo && dre && ue && modalidade && !naoEhInfantil ? (
    <>
      {dre?.codigo === OPCAO_TODOS ? (
        <TotalDevolutivasPorDRE
          anoLetivo={anoLetivo}
          dreId={dreId}
          ueId={ueId}
          modalidade={modalidade}
        />
      ) : (
        <></>
      )}
      <QtdDevolutivasRegistradasEstimada
        anoLetivo={anoLetivo}
        dreId={dreId}
        ueId={ueId}
        modalidade={modalidade}
      />
      <QtdDiarioBordoDevolutiva
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

export default GraficosDevolutivas;
