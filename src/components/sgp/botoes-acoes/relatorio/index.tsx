import ButtonSecundary from '@/components/lib/button/secundary';
import { ROUTES } from '@/core/enum/routes';
import { Col, Form, Row } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React from 'react';
import { FaPrint } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Base } from '~/componentes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { SGP_BUTTON_CANCELAR, SGP_BUTTON_GERAR_RELATORIO } from '~/constantes/ids/button';

interface BotoesAcoesRelatorioProps {
  desabilitarGerar: boolean;
}
export const BotoesAcoesRelatorio: React.FC<BotoesAcoesRelatorioProps> = ({ desabilitarGerar }) => {
  const navigate = useNavigate();
  const form = useFormInstance();

  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  const onClickCancelar = () => form.resetFields();

  return (
    <Col xs={24}>
      <Row gutter={[8, 8]}>
        <Col>
          <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
        </Col>
        <Col>
          <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
            {() => (
              <ButtonSecundary
                id={SGP_BUTTON_CANCELAR}
                onClick={() => onClickCancelar()}
                disabled={!form.isFieldsTouched()}
              >
                Cancelar
              </ButtonSecundary>
            )}
          </Form.Item>
        </Col>
        <Col>
          <ButtonSecundary
            htmlType="submit"
            color={Base.Azul}
            icon={<FaPrint />}
            id={SGP_BUTTON_GERAR_RELATORIO}
            disabled={desabilitarGerar}
          >
            <Col>Gerar</Col>
          </ButtonSecundary>
        </Col>
      </Row>
    </Col>
  );
};
