import BotaoVoltarPadrao from '@/@legacy/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import ButtonPrimary from '@/components/lib/button/primary';
import CardContent from '@/components/lib/card-content';
import HeaderPage from '@/components/lib/header-page';
import SelectDRE from '@/components/sgp/inputs/form/dre';
import SelectModalidade from '@/components/sgp/inputs/form/modalidade';
import SelectSemestre from '@/components/sgp/inputs/form/semestre';
import SelectTurma from '@/components/sgp/inputs/form/turma';
import SelectUE from '@/components/sgp/inputs/form/ue';
import Select from '@/components/sgp/inputs/select';
import LocalizadorEstudante from '@/components/sgp/localizador-estudante';
import { validateMessages } from '@/core/constants/validate-messages';
import { ROUTES } from '@/core/enum/routes';
import { Checkbox, Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SGP_BUTTON_SALVAR_ALTERAR } from '~/constantes/ids/button';
import BuscaAtivaRegistroAcoesFormDinamico from './form-dinamico';

type BuscaAtivaRegistroAcoesFormProps = {
  onClickVoltar: () => void;
};
const BuscaAtivaRegistroAcoesForm: React.FC<BuscaAtivaRegistroAcoesFormProps> = ({
  onClickVoltar,
}) => {
  const navigate = useNavigate();
  const [form] = useForm();

  const anoAtual = dayjs().year();

  const onClickVoltarPadrao = () => {
    if (onClickVoltar) {
      onClickVoltar();
      return;
    }

    navigate(ROUTES.BUSCA_ATIVA_REGISTRO_ACOES);
  };

  const salvar = () => {
    console.log(form.getFieldsValue(true));
  };

  return (
    <Col>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={salvar}
        validateMessages={validateMessages}
        initialValues={{ anoLetivo: anoAtual, consideraHistorico: false }}
      >
        <HeaderPage title="Registro de ações">
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <BotaoVoltarPadrao onClick={() => onClickVoltarPadrao()} />
              </Col>
              <Col>
                <ButtonPrimary id={SGP_BUTTON_SALVAR_ALTERAR} htmlType="submit">
                  Salvar
                </ButtonPrimary>
              </Col>
            </Row>
          </Col>
        </HeaderPage>
        <CardContent>
          <Row gutter={24}>
            <Form.Item name="consideraHistorico" valuePropName="checked" hidden>
              <Checkbox />
            </Form.Item>

            <Col xs={24} sm={8} md={4}>
              <Form.Item name="anoLetivo" label="Ano Letivo" rules={[{ required: true }]}>
                <Select options={[{ label: anoAtual, value: anoAtual }]} disabled />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={10}>
              <SelectDRE formItemProps={{ rules: [{ required: true }] }} />
            </Col>

            <Col xs={24} sm={24} md={10}>
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
                    />
                  );
                }}
              </Form.Item>
            </Col>

            <Col xs={24}>
              <LocalizadorEstudante />
            </Col>

            <Col xs={24}>
              <BuscaAtivaRegistroAcoesFormDinamico />
            </Col>
          </Row>
        </CardContent>
      </Form>
    </Col>
  );
};

export default BuscaAtivaRegistroAcoesForm;
