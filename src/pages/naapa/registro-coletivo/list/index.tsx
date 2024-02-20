import BotaoVoltarPadrao from '@/@legacy/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { SGP_BUTTON_NOVO } from '@/@legacy/constantes/ids/button';
import ButtonPrimary from '@/components/lib/button/primary';
import CardContent from '@/components/lib/card-content';
import HeaderPage from '@/components/lib/header-page';
import SelectAnoLetivo from '@/components/sgp/inputs/form/anoLetivo';
import DataFim from '@/components/sgp/inputs/form/data-fim';
import DataInicio from '@/components/sgp/inputs/form/data-inicio';
import SelectDRE from '@/components/sgp/inputs/form/dre';
import CheckboxExibirHistorico from '@/components/sgp/inputs/form/exibir-historico';
import {
  SelectTipoReuniao,
  SelectTipoReuniaoFormItem,
} from '@/components/sgp/inputs/form/tipo-reuniao';
import SelectUE from '@/components/sgp/inputs/form/ue';
import { ANO_INICIO_REGISTRO_COLETIVO_NAAPA } from '@/core/constants/contants';
import { validateMessages } from '@/core/constants/validate-messages';
import { Dayjs, dayjs } from '@/core/date/dayjs';
import { ROUTES } from '@/core/enum/routes';
import { Col, Form, Row } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verificaSomenteConsulta } from '~/servicos';
import { ListaPaginadaRegistroColetivo } from './lista-paginada';

export const ListRegistroColetivo: React.FC = () => {
  const navigate = useNavigate();
  const [form] = useForm();

  const usuario = useSelector((state: any) => state.usuario);
  const { permissoes } = usuario;

  const podeIncluir = permissoes?.[ROUTES.NAAPA_REGISTRO_COLETIVO]?.podeIncluir;

  const [somenteConsulta, setSomenteConsulta] = useState(false);

  const ue = useWatch('ue', form);
  const anoLetivo = useWatch('anoLetivo', form);

  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  const onClickNovo = () => navigate(ROUTES.NAAPA_REGISTRO_COLETIVO_NOVO);

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(permissoes?.[ROUTES.NAAPA_REGISTRO_COLETIVO]);
    setSomenteConsulta(soConsulta);
  }, [permissoes]);

  useEffect(() => {
    if (!ue?.value) {
      form.setFieldValue('dataInicio', undefined);
      form.setFieldValue('dataFim', undefined);
      form.setFieldValue('tipoReuniao', undefined);
    }
  }, [ue, form]);

  const validarDesabilitarDatas = (data?: Dayjs) => {
    if (data) {
      const hoje = dayjs();
      const ano = dayjs(`${anoLetivo}-01-01`);
      const anoSelecionadoIgualAnoDataAtual = ano.year() === data.year();
      const anoDataAtualMenorAnoSelecionado = data.year() < ano.year();
      const anoSelecionadoIgualAnoHoje = ano.year() === hoje.year();

      if (anoDataAtualMenorAnoSelecionado) return true;

      if (anoSelecionadoIgualAnoDataAtual && !anoSelecionadoIgualAnoHoje) {
        const menorQueAnoAtual = data.isBefore(ano.startOf('year'), 'day');
        const maiorQueAnoAtual = data.isAfter(ano.endOf('year'), 'day');

        return menorQueAnoAtual || maiorQueAnoAtual;
      }

      return (
        !anoSelecionadoIgualAnoHoje ||
        data.isAfter(dayjs(), 'day') ||
        data.isBefore(ano.startOf('year'), 'day')
      );
    }

    return false;
  };

  return (
    <Col>
      <HeaderPage title="Registro Coletivo">
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
            </Col>
            <Col>
              <ButtonPrimary
                id={SGP_BUTTON_NOVO}
                onClick={onClickNovo}
                disabled={somenteConsulta || !podeIncluir}
              >
                Novo
              </ButtonPrimary>
            </Col>
          </Row>
        </Col>
      </HeaderPage>
      <CardContent>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          validateMessages={validateMessages}
          initialValues={{
            consideraHistorico: false,
          }}
        >
          <Row gutter={[16, 8]}>
            <Col xs={24}>
              <CheckboxExibirHistorico />
            </Col>
          </Row>

          <Row gutter={[16, 8]}>
            <Col xs={24} sm={8} md={4}>
              <SelectAnoLetivo
                formItemProps={{ rules: [{ required: true }] }}
                anoMinimo={ANO_INICIO_REGISTRO_COLETIVO_NAAPA}
              />
            </Col>

            <Col xs={24} md={10}>
              <SelectDRE formItemProps={{ rules: [{ required: true }] }} />
            </Col>

            <Col xs={24} md={10}>
              <SelectUE formItemProps={{ rules: [{ required: true }] }} mostrarOpcaoTodas />
            </Col>
          </Row>

          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={6}>
              <DataInicio
                formItemProps={{ label: 'Data da reunião' }}
                datePickerProps={{ disabled: !ue?.value }}
                desabilitarData={validarDesabilitarDatas}
                validarInicioMaiorQueFim
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <DataFim
                formItemProps={{ label: ' ' }}
                datePickerProps={{ disabled: !ue?.value }}
                desabilitarData={validarDesabilitarDatas}
                validarFimMenorQueInicio
              />
            </Col>

            <Col xs={24} md={12}>
              <SelectTipoReuniaoFormItem name="tiposReuniaoId">
                <SelectTipoReuniao disabled={!ue?.value} mode="multiple" />
              </SelectTipoReuniaoFormItem>
            </Col>

            <Col xs={24}>
              <ListaPaginadaRegistroColetivo />
            </Col>
          </Row>
        </Form>
      </CardContent>
    </Col>
  );
};
