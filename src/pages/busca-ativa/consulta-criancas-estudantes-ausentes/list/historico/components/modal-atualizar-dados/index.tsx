import InputEmail from '@/components/sgp/inputs/form/email';
import InputTelefone from '@/components/sgp/inputs/form/telefone';
import { validateMessages } from '@/core/constants/validate-messages';
import { Modal, Col, Row, Typography, Form } from 'antd';
import React from 'react';
import { SGP_BUTTON_CANCELAR_MODAL, SGP_BUTTON_SALVAR_MODAL } from '~/constantes/ids/button';
import { SGP_INPUT_EMAIL, SGP_INPUT_TELEFONE } from '~/constantes/ids/input';

type ModalAtualizarDadosProps = {
  modalOpen: boolean;
  salvarDadosResponsavel: any;
  onClickCancelar: any;
  formInitialValues: any;
  loading: boolean;
};

const ModalAtualizarDados: React.FC<ModalAtualizarDadosProps> = ({
  modalOpen,
  salvarDadosResponsavel,
  onClickCancelar,
  formInitialValues,
  loading,
}) => {
  const { Text } = Typography;
  const formResponsavel = Form.useFormInstance();
  return (
    <>
      <Modal
        title="Atualizar dados do responsável"
        centered
        open={modalOpen}
        onOk={() => salvarDadosResponsavel()}
        onCancel={() => onClickCancelar()}
        destroyOnClose
        cancelButtonProps={{ disabled: loading, id: SGP_BUTTON_CANCELAR_MODAL }}
        okButtonProps={{ disabled: loading, id: SGP_BUTTON_SALVAR_MODAL }}
        okText="Atualizar"
        cancelText="Cancelar"
        width={1100}
      >
        <Form
          form={formResponsavel}
          layout="vertical"
          autoComplete="off"
          onFinish={salvarDadosResponsavel}
          validateMessages={validateMessages}
          initialValues={formInitialValues}
        >
          <Col span={24}>
            <Row gutter={24} style={{ marginBottom: 20 }}>
              <Col span={12}>
                <Text strong>Nome: </Text>
                <Text>
                  {formInitialValues?.nome} - {formInitialValues?.tipoResponsavel}
                </Text>
              </Col>
              <Col span={12}>
                <Text strong>CPF: </Text>
                <Text>{formInitialValues?.cpf}</Text>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <InputEmail
                  formItemProps={{ label: 'E-mail do responsável' }}
                  inputProps={{ id: SGP_INPUT_EMAIL }}
                />
              </Col>
              <Col span={12}>
                <InputTelefone
                  formItemProps={{ label: 'Nº Celular do responsável', name: 'celular' }}
                  inputProps={{ id: SGP_INPUT_TELEFONE }}
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <InputTelefone
                  formItemProps={{
                    label: 'Nº do telefone residencial do responsável',
                    name: 'foneResidencial',
                    rules: [{ required: false }],
                  }}
                  inputProps={{ id: SGP_INPUT_EMAIL }}
                />
              </Col>
              <Col span={12}>
                <InputTelefone
                  formItemProps={{
                    label: 'Nº do telefone comercial do responsável',
                    rules: [{ required: false }],
                    name: 'foneComercial',
                  }}
                  inputProps={{ id: SGP_INPUT_TELEFONE }}
                />
              </Col>
            </Row>
          </Col>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAtualizarDados;
