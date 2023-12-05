import InputEmail from '@/components/sgp/inputs/form/email';
import InputTelefone from '@/components/sgp/inputs/form/telefone';
import { Form, Modal } from 'antd';
import React from 'react';
import { Grid } from '~/componentes';
import { SGP_INPUT_EMAIL, SGP_INPUT_TELEFONE } from '~/constantes/ids/input';
import { validateMessages } from '@/core/constants/validate-messages';
import { DadosResponsavelAtualizarDto } from '@/core/dto/DadosResponsavelAtualizarDto';

type ModaltualizarResponsavelProps = {
  modalOpen: boolean;
  salvarDadosResponsavel: () => void;
  onClickCancelar: () => void;
  formInitialValues: DadosResponsavelAtualizarDto;
};
const ModaltualizarResponsavel: React.FC<ModaltualizarResponsavelProps> = ({
  modalOpen,
  salvarDadosResponsavel,
  onClickCancelar,
  formInitialValues,
}) => {
  const formResponsavel = Form.useFormInstance();
  return (
    <>
      <Modal
        title="Atualizar dados do responsável"
        centered
        open={modalOpen}
        onOk={() => salvarDadosResponsavel()}
        onCancel={() => onClickCancelar()}
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
          <hr />
          <Grid cols={12}>
            <div className="row">
              <Grid cols={6} className="mb-2">
                <Form.Item name="nome" label="Responsável">
                  {formInitialValues?.nome}
                </Form.Item>
              </Grid>
              <Grid cols={6} className="mb-2">
                <Form.Item label="CPF" name="cpf">
                  {formInitialValues?.cpf}
                </Form.Item>
              </Grid>
            </div>
          </Grid>
          <Grid cols={12}>
            <div className="row">
              <Grid cols={6} className="mb-2">
                <InputEmail
                  formItemProps={{ label: 'E-mail do responsável' }}
                  inputProps={{ id: SGP_INPUT_EMAIL, disabled: false }}
                />
              </Grid>
              <Grid cols={6} className="mb-2">
                <InputTelefone
                  formItemProps={{ label: 'Nº Celular do responsável', name: 'celular' }}
                  inputProps={{ id: SGP_INPUT_TELEFONE, disabled: false }}
                />
              </Grid>
            </div>
          </Grid>
          <Grid cols={12}>
            <div className="row">
              <Grid cols={6} className="mb-2">
                <InputTelefone
                  formItemProps={{
                    label: 'Nº do telefone residencial do responsável',
                    name: 'foneResidencial',
                    rules: [{ required: false }],
                  }}
                  inputProps={{ id: SGP_INPUT_EMAIL, disabled: false }}
                />
              </Grid>
              <Grid cols={6} className="mb-2">
                <InputTelefone
                  formItemProps={{
                    label: 'Nº do telefone comercial do responsável',
                    rules: [{ required: false }],
                    name: 'foneComercial',
                  }}
                  inputProps={{ id: SGP_INPUT_TELEFONE, disabled: false }}
                />
              </Grid>
            </div>
          </Grid>
          <hr />
        </Form>
      </Modal>
    </>
  );
};

export default ModaltualizarResponsavel;
