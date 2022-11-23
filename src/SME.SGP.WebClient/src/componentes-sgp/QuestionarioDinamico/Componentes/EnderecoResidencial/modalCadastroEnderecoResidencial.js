import { Col, Row } from 'antd';
import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import shortid from 'shortid';
import * as Yup from 'yup';
import { CampoTexto, Colors, ModalConteudoHtml } from '~/componentes';
import Button from '~/componentes/button';

const ModalCadastroEnderecoResidencial = props => {
  const { onClose, exibirModal, dadosIniciais } = props;

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
                  label="Tipo de logradouro"
                  placeholder="Informe o tipo de logradouro"
                />
              </Col>

              <Col sm={24} lg={12}>
                <CampoTexto
                  form={form}
                  labelRequired
                  name="logradouro"
                  label="Logradouro"
                  placeholder="Informe o logradouro"
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
                  placeholder="Informe o número"
                />
              </Col>

              <Col sm={24} lg={6}>
                <CampoTexto
                  form={form}
                  labelRequired
                  name="complemento"
                  label="Complemento"
                  placeholder="Informe o complemento"
                />
              </Col>

              <Col sm={24} lg={12}>
                <CampoTexto
                  form={form}
                  labelRequired
                  name="bairro"
                  label="Bairro"
                  placeholder="Informe o bairro"
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} type="flex" justify="end">
              <Col>
                <Button
                  border
                  id="btn-voltar"
                  key="btn-voltar"
                  label="Cancelar"
                  color={Colors.Azul}
                  onClick={fecharModal}
                />
              </Col>

              <Col>
                <Button
                  border
                  label="Salvar"
                  id="btn-salvar"
                  key="btn-salvar"
                  color={Colors.Roxo}
                  onClick={() => validaAntesDoSubmit(form)}
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
  exibirModal: PropTypes.bool,
  dadosIniciais: PropTypes.oneOfType([PropTypes.any]),
};

ModalCadastroEnderecoResidencial.defaultProps = {
  onClose: () => {},
  exibirModal: false,
  dadosIniciais: null,
};

export default ModalCadastroEnderecoResidencial;
