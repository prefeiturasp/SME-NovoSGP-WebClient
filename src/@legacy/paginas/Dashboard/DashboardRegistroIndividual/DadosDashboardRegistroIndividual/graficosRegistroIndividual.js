import React from 'react';
import { useSelector } from 'react-redux';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import MediaPeriodoRegistrosIndividuaisPorCrianca from './MediaPeriodoRegistrosIndividuaisPorCrianca/mediaPeriodoRegistrosIndividuaisPorCrianca';
import QuantidadeCriancasSemRegistros from './QuantidadeCriancasSemRegistros/quantidadeCriancasSemRegistros';
import QuantidadeTotalRegistrosIndividuais from './QuantidadeTotalRegistrosIndividuais/quantidadeTotalRegistrosIndividuais';
import TotalRegistrosIndividuaisPorDRE from './TotalRegistrosIndividuaisPorDRE/totalRegistrosIndividuaisPorDRE';

const GraficosRegistroIndividual = () => {
  const anoLetivo = useSelector(
    store =>
      store.dashboardRegistroIndividual?.dadosDashboardRegistroIndividual
        ?.anoLetivo
  );
  const dre = useSelector(
    store =>
      store.dashboardRegistroIndividual?.dadosDashboardRegistroIndividual?.dre
  );
  const ue = useSelector(
    store =>
      store.dashboardRegistroIndividual?.dadosDashboardRegistroIndividual?.ue
  );
  const modalidade = useSelector(
    store =>
      store.dashboardRegistroIndividual?.dadosDashboardRegistroIndividual
        ?.modalidade
  );

  const dreId = OPCAO_TODOS === dre?.codigo ? OPCAO_TODOS : dre?.id;
  const ueId = OPCAO_TODOS === ue?.codigo ? OPCAO_TODOS : ue?.id;

  const naoEhInfantil =
    modalidade && Number(modalidade) !== ModalidadeEnum.INFANTIL;

  return anoLetivo && dre && ue && modalidade && !naoEhInfantil ? (
    <>
      <QuantidadeTotalRegistrosIndividuais
        anoLetivo={anoLetivo}
        dreId={dreId}
        ueId={ueId}
        modalidade={modalidade}
      />
      {dre?.codigo === OPCAO_TODOS ? (
        <TotalRegistrosIndividuaisPorDRE
          anoLetivo={anoLetivo}
          dreId={dreId}
          ueId={ueId}
          modalidade={modalidade}
        />
      ) : (
        <></>
      )}
      <MediaPeriodoRegistrosIndividuaisPorCrianca
        anoLetivo={anoLetivo}
        dreId={dreId}
        ueId={ueId}
        modalidade={modalidade}
      />
      <QuantidadeCriancasSemRegistros
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

export default GraficosRegistroIndividual;
