import { TagDataUltimaConsolidacao } from '@/components/sgp/data-ultima-consolidacao';
import { GraficoBarras } from '@/components/sgp/graficos/barras';
import { SelectMes } from '@/components/sgp/inputs/form/mes';
import { FiltroGraficoReflexoFrequenciaBuscaAtivaDto } from '@/core/dto/FiltroGraficoReflexoFrequenciaBuscaAtivaDto';
import { GraficoBuscaAtivaDto } from '@/core/dto/GraficoBuscaAtivaDto';
import dashboardBuscaAtivaService from '@/core/services/dashboard-busca-ativa-service';
import { Col, Row } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { useCallback, useEffect, useState } from 'react';
import { Loader } from '~/componentes';

export const GraficoQuantidadeBuscaAtivaPorReflexoFrequenciaMes: React.FC = () => {
  const form = useFormInstance();

  const modalidade = useWatch('modalidade', form);

  const [dados, setDados] = useState<GraficoBuscaAtivaDto | undefined>();
  const [exibirLoader, setExibirLoader] = useState<boolean>(false);
  const [mesSelecionado, setMesSelecionado] = useState<string>('');

  const obterDados = useCallback(async (params: FiltroGraficoReflexoFrequenciaBuscaAtivaDto) => {
    setExibirLoader(true);
    const resposta =
      await dashboardBuscaAtivaService.obterQuantidadeBuscaAtivaPorReflexoFrequenciaMes(params);

    if (resposta.sucesso) {
      setDados(resposta.dados);
    } else {
      setDados(undefined);
    }

    setExibirLoader(false);
  }, []);

  useEffect(() => {
    setDados(undefined);

    if (modalidade?.value && mesSelecionado) {
      const values = form.getFieldsValue(true);

      const params: FiltroGraficoReflexoFrequenciaBuscaAtivaDto = {
        anoLetivo: values?.anoLetivo,
        dreId: values?.dre?.id,
        ueId: values?.ue?.id,
        modalidade: values?.modalidade?.value,
        mes: mesSelecionado,
      };

      obterDados(params);
    }
  }, [form, modalidade, mesSelecionado, obterDados]);

  return (
    <Loader loading={exibirLoader}>
      <Row justify="space-between">
        <Col xs={12} sm={6}>
          <SelectMes onChange={(value) => setMesSelecionado(value)} mesesRemover={['1']} />
        </Col>
        {dados?.dataUltimaConsolidacao && (
          <Col>
            <TagDataUltimaConsolidacao data={dados.dataUltimaConsolidacao} />
          </Col>
        )}
      </Row>

      {mesSelecionado && dados?.graficos?.length ? (
        <GraficoBarras data={dados.graficos} xField="grupo" isGroup />
      ) : (
        <Row justify="center">Sem dados</Row>
      )}
    </Loader>
  );
};
