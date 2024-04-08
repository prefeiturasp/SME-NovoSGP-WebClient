import { GraficoBarras } from '@/components/sgp/graficos/barras';
import { FiltroGraficoBuscaAtivaDto } from '@/core/dto/FiltroGraficoBuscaAtivaDto';
import { GraficoBaseDto } from '@/core/dto/GraficoBaseDto';
import dashboardBuscaAtivaService from '@/core/services/dashboard-busca-ativa-service';
import { Row } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { cloneDeep } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { Loader } from '~/componentes';

export const GraficoQuantidadeBuscaAtivaPorMotivosAusencia: React.FC = () => {
  const form = useFormInstance();

  const modalidade = useWatch('modalidade', form);

  const [dados, setDados] = useState<GraficoBaseDto[]>([]);
  const [exibirLoader, setExibirLoader] = useState<boolean>(false);

  const obterDados = useCallback(async (params: FiltroGraficoBuscaAtivaDto) => {
    setExibirLoader(true);
    const resposta = await dashboardBuscaAtivaService
      .obterQuantidadeBuscaAtivaPorMotivosAusencia(params)
      .finally(() => setExibirLoader(false));

    if (resposta.sucesso && resposta.dados?.graficos?.length) {
      setDados(cloneDeep(resposta.dados?.graficos));
    } else {
      setDados([]);
    }
  }, []);

  useEffect(() => {
    if (modalidade?.value) {
      const values = form.getFieldsValue(true);
      const params: FiltroGraficoBuscaAtivaDto = {
        anoLetivo: values?.anoLetivo,
        dreId: values?.dre?.id,
        ueId: values?.ue?.id,
        modalidade: values?.modalidade?.value,
      };
      obterDados(params);
    } else {
      setDados([]);
    }
  }, [form, modalidade, obterDados]);

  return (
    <Loader loading={exibirLoader}>
      {dados?.length ? (
        <GraficoBarras data={dados} xAxisVisible={false} />
      ) : (
        <Row justify="center">Sem dados</Row>
      )}
    </Loader>
  );
};
