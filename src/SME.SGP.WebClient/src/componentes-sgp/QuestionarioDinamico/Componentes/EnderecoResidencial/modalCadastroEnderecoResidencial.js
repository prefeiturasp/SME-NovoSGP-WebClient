import { Col, Row } from 'antd';
import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import shortid from 'shortid';
import * as Yup from 'yup';
import { CampoTexto, Colors, ModalConteudoHtml } from '~/componentes';
import Button from '~/componentes/button';
import {
  SGP_BUTTON_ADICIONAR_ENDERECO_RESIDENCIAL_MODAL,
  SGP_BUTTON_VOLTAR_ENDERECO_RESIDENCIAL_MODAL,
} from '~/constantes/ids/button';
import {
  SGP_INPUT_BAIRRO_ENDERECO_RESIDENCIAL_MODAL,
  SGP_INPUT_COMPLEMENTO_ENDERECO_RESIDENCIAL_MODAL,
  SGP_INPUT_LOGRADOURO_ENDERECO_RESIDENCIAL_MODAL,
  SGP_INPUT_NUMERO_ENDERECO_RESIDENCIAL_MODAL,
  SGP_INPUT_TIPO_LOGRADOURO_ENDERECO_RESIDENCIAL_MODAL,
} from '~/constantes/ids/input';

const ModalCadastroEnderecoResidencial = props => {
  const { onClose, exibirModal, dadosIniciais, disabled } = props;

  const [refForm, setRefForm] = useState({});

  const valoresIniciais = {
    id: dadosIniciais ? dadosIniciais.id : 0,
    tipoLogradouro: dadosIniciais ? dadosIniciais.tipoLogradouro : '',
    logradouro: dadosIniciais ? dadosIniciais.logradouro : '',
    numero: dadosIniciais ? dadosIniciais.numero : '',
    complemento: dadosIniciais ? dadosIniciais.complemento : '',
    bairro: dadosIniciais ? dadosIniciais.bairro : '',
  };

  const validacoes = Yup.object().shape({
    tipoLogradouro: Yup.string()
      .nullable()
      .required('Campo obrigatório'),
    logradouro: Yup.string()
      .nullable()
      .required('Campo obrigatório'),
    numero: Yup.string()
      .nullable()
      .required('Campo obrigatório'),
    complemento: Yup.string()
      .nullable()
      .required('Campo obrigatório'),
    bairro: Yup.string()
      .nullable()
      .required('Campo obrigatório'),
  });

  const fecharModal = () => {
    refForm.resetForm();
    onClose();
  };

  const onSalvar = valores => {
    refForm.resetForm();
    onClose(valores);
  };

  const validaAntesDoSubmit = form => {
    const arrayCampos = Object.keys(valoresIniciais);
    arrayCampos.forEach(campo => {
      form.setFieldTouched(campo, true, true);
    });
    form.validateForm().then(() => {
      if (form.isValid || Object.keys(form.errors).length === 0) {
        form.handleSubmit(e => e);
      }
    });
  };

  return (
    <ModalConteudoHtml
      closable
      width={750}
      esconderBotoes
      onClose={fecharModal}
      visivel={exibirModal}
      id={shortid.generate()}
      titulo="Endereço residencial"
      key="endereço-residencial-modal"
    >
      <Formik
        validateOnBlur
        validateOnChange
        enableReinitialize
        ref={f => setRefForm(f)}
        validationSchema={validacoes}
        initialValues={valoresIniciais}
        onSubmit={valores => onSalvar(valores)}
      >
        {form => (
          <Form>
            <Row gutter={[16, 16]}>
              <Col sm={24} lg={12}>
                <CampoTexto
                  form={form}
                  labelRequired
                  name="tipoLogradouro"
                  desabilitado={disabled}
                  label="Tipo de logradouro"
                  placeholder="Informe o tipo de logradouro"
                  id={SGP_INPUT_TIPO_LOGRADOURO_ENDERECO_RESIDENCIAL_MODAL}
                />
              </Col>

              <Col sm={24} lg={12}>
                <CampoTexto
                  form={form}
                  labelRequired
                  name="logradouro"
                  label="Logradouro"
                  desabilitado={disabled}
                  placeholder="Informe o logradouro"
                  id={SGP_INPUT_LOGRADOURO_ENDERECO_RESIDENCIAL_MODAL}
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col sm={24} lg={6}>
                <CampoTexto
                  form={form}
                  labelRequired
                  maxLength={11}
                  name="numero"
                  label="Número"
                  desabilitado={disabled}
                  placeholder="Informe o número"
                  id={SGP_INPUT_NUMERO_ENDERECO_RESIDENCIAL_MODAL}
                />
              </Col>

              <Col sm={24} lg={6}>
                <CampoTexto
                  form={form}
                  labelRequired
                  name="complemento"
                  label="Complemento"
                  desabilitado={disabled}
                  placeholder="Informe o complemento"
                  id={SGP_INPUT_COMPLEMENTO_ENDERECO_RESIDENCIAL_MODAL}
                />
              </Col>

              <Col sm={24} lg={12}>
                <CampoTexto
                  form={form}
                  labelRequired
                  name="bairro"
                  label="Bairro"
                  desabilitado={disabled}
                  placeholder="Informe o bairro"
                  id={SGP_INPUT_BAIRRO_ENDERECO_RESIDENCIAL_MODAL}
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} type="flex" justify="end">
              <Col>
                <Button
                  border
                  key="btn-voltar"
                  label="Cancelar"
                  color={Colors.Azul}
                  onClick={fecharModal}
                  id={SGP_BUTTON_VOLTAR_ENDERECO_RESIDENCIAL_MODAL}
                />
              </Col>

              <Col>
                <Button
                  border
                  key="btn-salvar"
                  label="Adicionar"
                  color={Colors.Roxo}
                  disabled={disabled}
                  onClick={() => validaAntesDoSubmit(form)}
                  id={SGP_BUTTON_ADICIONAR_ENDERECO_RESIDENCIAL_MODAL}
                />
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </ModalConteudoHtml>
  );
};

ModalCadastroEnderecoResidencial.propTypes = {
  onClose: PropTypes.func,
  disabled: PropTypes.bool,
  exibirModal: PropTypes.bool,
  dadosIniciais: PropTypes.oneOfType([PropTypes.any]),
};

ModalCadastroEnderecoResidencial.defaultProps = {
  disabled: false,
  onClose: () => {},
  exibirModal: false,
  dadosIniciais: null,
};

export default ModalCadastroEnderecoResidencial;
