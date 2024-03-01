import BotaoVoltarPadrao from '@/@legacy/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import CardContent from '@/components/lib/card-content';
import HeaderPage from '@/components/lib/header-page';
import SelectAusencias from '@/components/sgp/inputs/form/ausencias';
import SelectDRE from '@/components/sgp/inputs/form/dre';
import SelectModalidade from '@/components/sgp/inputs/form/modalidade';
import SelectSemestre from '@/components/sgp/inputs/form/semestre';
import SelectTurma from '@/components/sgp/inputs/form/turma';
import SelectUE from '@/components/sgp/inputs/form/ue';
import { validateMessages } from '@/core/constants/validate-messages';
import { ROUTES } from '@/core/enum/routes';
import { Checkbox, Col, Form, Input, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TableTurmasCriancasEstudantesAusentes from './table-turmas';

const ConsultaCriancasEstudantesAusentes: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = useForm();

  const dadosRouteState = location.state;

  const anoAtual = dayjs().year();

  const [formInitialValues, setFormInitialValues] = useState({
    anoLetivo: anoAtual,
    consideraHistorico: false,
  });

  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  useEffect(() => {
    if (dadosRouteState?.dadosFiltros?.dre?.id) {
      setFormInitialValues({ ...dadosRouteState?.dadosFiltros });
    }
  }, [dadosRouteState]);

  useEffect(() => {
    form.resetFields();
  }, [form, formInitialValues]);

  return (
    <Col>
      <HeaderPage title="Consulta de crianças/estudantes ausentes">
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
          initialValues={formInitialValues}
        >
          <Row gutter={24}>
            <Form.Item name="consideraHistorico" valuePropName="checked" hidden>
              <Checkbox />
            </Form.Item>

            <Form.Item name="anoLetivo" hidden>
              <Input type="text" />
            </Form.Item>

            <Col xs={24} md={12}>
              <SelectDRE formItemProps={{ rules: [{ required: true }] }} />
            </Col>

            <Col xs={24} md={12}>
              <SelectUE formItemProps={{ rules: [{ required: true }] }} />
            </Col>

            <Col xs={24} md={12} lg={10}>
              <SelectModalidade formItemProps={{ rules: [{ required: true }] }} />
            </Col>

            <Col xs={24} md={12} lg={4}>
              <SelectSemestre />
            </Col>

            <Col xs={24} md={12} lg={10}>
              <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                {(form) => {
                  const modalidade = form.getFieldValue('modalidade');

                  return (
                    <SelectTurma
                      formItemProps={{ rules: [{ required: true }] }}
                      selectProps={{ disabled: !modalidade }}
                      mostrarOpcaoTodas
                      selecionarOpcaoTodasAoCarregar={!dadosRouteState?.dadosFiltros?.turma?.id}
                    />
                  );
                }}
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                {(form) => {
                  const turma = form.getFieldValue('turma');

                  return (
                    <SelectAusencias
                      formItemProps={{ rules: [{ required: true }] }}
                      selectProps={{ disabled: !turma?.value }}
                    />
                  );
                }}
              </Form.Item>
            </Col>

            <Col xs={24}>
              <TableTurmasCriancasEstudantesAusentes />
            </Col>
          </Row>
        </Form>
      </CardContent>
    </Col>
  );
};

export default ConsultaCriancasEstudantesAusentes;
