import { GraficoBarras } from '@/components/sgp/graficos/barras';
import { FiltroGraficoProcedimentoTrabalhoBuscaAtivaDto } from '@/core/dto/FiltroGraficoProcedimentoTrabalhoBuscaAtivaDto';
import { GraficoBuscaAtivaDto } from '@/core/dto/GraficoBuscaAtivaDto';
import {
  OrdemProcedimentoRealizadoEnum,
  OrdemProcedimentoRealizadoEnumDisplay,
} from '@/core/enum/ordem-procedimento-realizado-enum';
import dashboardBuscaAtivaService from '@/core/services/dashboard-busca-ativa-service';
import { Row, Segmented } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { SegmentedValue } from 'antd/es/segmented';
import { useCallback, useEffect, useState } from 'react';
import { Loader } from '~/componentes';

export const GraficoQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre: React.FC = () => {
  const form = useFormInstance();

  const modalidade = useWatch('modalidade', form);

  const [dados, setDados] = useState<GraficoBuscaAtivaDto | undefined>();
  const [exibirLoader, setExibirLoader] = useState<boolean>(false);
  const [tipoProcedimentoTrabalho, setTipoProcedimentoTrabalho] =
    useState<OrdemProcedimentoRealizadoEnum>(OrdemProcedimentoRealizadoEnum.Telefone);

  const obterDados = useCallback(async (params: FiltroGraficoProcedimentoTrabalhoBuscaAtivaDto) => {
    setExibirLoader(true);
    const resposta =
      await dashboardBuscaAtivaService.obterQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre(params);

    if (resposta.sucesso) {
      setDados(resposta.dados);
    } else {
      setDados(undefined);
    }

    setExibirLoader(false);
  }, []);

  useEffect(() => {
    setDados(undefined);
    if (modalidade?.value) {
      const values = form.getFieldsValue(true);

      const params: FiltroGraficoProcedimentoTrabalhoBuscaAtivaDto = {
        anoLetivo: values?.anoLetivo,
        dreId: values?.dre?.id,
        ueId: values?.ue?.id,
        modalidade: values?.modalidade?.value,
        tipoProcedimentoTrabalho,
      };
      obterDados(params);
    }
  }, [form, modalidade, tipoProcedimentoTrabalho, obterDados]);

  return (
    <Loader loading={exibirLoader}>
      <Row>
        <Segmented
          value={tipoProcedimentoTrabalho}
          options={[
            {
              label: OrdemProcedimentoRealizadoEnumDisplay[OrdemProcedimentoRealizadoEnum.Telefone],
              value: OrdemProcedimentoRealizadoEnum.Telefone,
            },
            {
              label:
                OrdemProcedimentoRealizadoEnumDisplay[
                  OrdemProcedimentoRealizadoEnum.VisitaDomiciliar
                ],
              value: OrdemProcedimentoRealizadoEnum.VisitaDomiciliar,
            },
          ]}
          onChange={(value: SegmentedValue) => {
            setTipoProcedimentoTrabalho(Number(value));
          }}
        />
      </Row>

      {dados?.graficos?.length ? (
        <GraficoBarras data={dados.graficos} xField="grupo" isGroup />
      ) : (
        <Row justify="center">Sem dados</Row>
      )}
    </Loader>
  );
};
