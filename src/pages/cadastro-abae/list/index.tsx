import BotaoVoltarPadrao from '@/@legacy/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { SGP_BUTTON_NOVO } from '@/@legacy/constantes/ids/button';
import { SGP_INPUT_NOME } from '@/@legacy/constantes/ids/input';
import ButtonPrimary from '@/components/lib/button/primary';
import CardContent from '@/components/lib/card-content';
import HeaderPage from '@/components/lib/header-page';
import SelectDRE from '@/components/sgp/inputs/form/dre';
import RadioSituacaoAtivoInativo from '@/components/sgp/inputs/form/situacao-ativo-inativo/radio-situacao-ativo-inativo';
import SelectUE from '@/components/sgp/inputs/form/ue';
import { validateMessages } from '@/core/constants/validate-messages';
import { ROUTES } from '@/core/enum/routes';
import { Checkbox, Col, Form, Input, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verificaSomenteConsulta } from '~/servicos';
import ListaPaginadaCadastroABAE from './lista-paginada';

const ListCadastroABAE: React.FC = () => {
  const navigate = useNavigate();
  const [form] = useForm();

  const usuario = useSelector((state: any) => state.usuario);
  const { permissoes } = usuario;
  const podeIncluir = permissoes?.[ROUTES.CADASTRO_ABAE]?.podeIncluir;

  const [somenteConsulta, setSomenteConsulta] = useState(false);

  const anoAtual = dayjs().year();

  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  const onClickNovo = () => navigate(ROUTES.CADASTRO_ABAE_NOVO);

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(permissoes?.[ROUTES.CADASTRO_ABAE]);
    setSomenteConsulta(soConsulta);
  }, [permissoes]);

  return (
    <Col>
      <HeaderPage title="Cadastro de ABAE">
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
          initialValues={{ anoLetivo: anoAtual, consideraHistorico: false, situacao: true }}
        >
          <Row gutter={24}>
            <Form.Item name="consideraHistorico" valuePropName="checked" hidden>
              <Checkbox />
            </Form.Item>

            <Form.Item name="anoLetivo" hidden>
              <Input type="text" />
            </Form.Item>

            <Col xs={24} md={12}>
              <SelectDRE formItemProps={{ rules: [{ required: true }] }} mostrarOpcaoTodas />
            </Col>

            <Col xs={24} md={12}>
              <SelectUE formItemProps={{ rules: [{ required: true }] }} mostrarOpcaoTodas />
            </Col>

            <Col xs={24} md={12}>
              <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                {({ getFieldsValue }) => {
                  const values = getFieldsValue();
                  const disabled = !values?.ue?.value;

                  return (
                    <Form.Item label="Nome" name="nome" rules={[{ min: 3 }]}>
                      <Input
                        type="text"
                        placeholder="Nome"
                        id={SGP_INPUT_NOME}
                        disabled={disabled}
                        allowClear
                        prefix={<i className="fa fa-search fa-lg" />}
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                {({ getFieldsValue }) => {
                  const values = getFieldsValue();
                  const disabled = !values?.ue?.value;
                  return (
                    <Col xs={24} sm={12}>
                      <RadioSituacaoAtivoInativo radioGroupProps={{ disabled }} />
                    </Col>
                  );
                }}
              </Form.Item>
            </Col>

            <Col xs={24}>
              <ListaPaginadaCadastroABAE />
            </Col>
          </Row>
        </Form>
      </CardContent>
    </Col>
  );
};

export default ListCadastroABAE;
