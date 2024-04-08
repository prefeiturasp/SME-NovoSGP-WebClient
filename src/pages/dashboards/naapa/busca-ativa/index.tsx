import BotaoVoltarPadrao from '@/@legacy/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import CardContent from '@/components/lib/card-content';
import HeaderPage from '@/components/lib/header-page';
import SelectAnoLetivo from '@/components/sgp/inputs/form/anoLetivo';
import SelectDRE from '@/components/sgp/inputs/form/dre';
import CheckboxExibirHistorico from '@/components/sgp/inputs/form/exibir-historico';
import SelectModalidade from '@/components/sgp/inputs/form/modalidade';
import SelectUE from '@/components/sgp/inputs/form/ue';
import { validateMessages } from '@/core/constants/validate-messages';
import { ROUTES } from '@/core/enum/routes';
import { Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardBuscaAtivaTabs } from './tabs';

export const DashboardBuscaAtiva: React.FC = () => {
  const navigate = useNavigate();
  const [form] = useForm();

  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  return (
    <Col>
      <HeaderPage title="Dashboard busca ativa">
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
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
              <SelectAnoLetivo formItemProps={{ rules: [{ required: true }] }} />
            </Col>

            <Col xs={24} md={10}>
              <SelectDRE formItemProps={{ rules: [{ required: true }] }} mostrarOpcaoTodas />
            </Col>

            <Col xs={24} md={10}>
              <SelectUE formItemProps={{ rules: [{ required: true }] }} mostrarOpcaoTodas />
            </Col>
          </Row>

          <Row gutter={[16, 8]}>
            <Col xs={24} md={12} lg={8}>
              <SelectModalidade formItemProps={{ rules: [{ required: true }] }} />
            </Col>
          </Row>

          <Row gutter={[16, 8]}>
            <DashboardBuscaAtivaTabs />
          </Row>
        </Form>
      </CardContent>
    </Col>
  );
};
