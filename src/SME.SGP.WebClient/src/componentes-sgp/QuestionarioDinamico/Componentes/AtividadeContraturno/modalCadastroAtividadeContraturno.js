import { Col, Row } from 'antd';
import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import shortid from 'shortid';
import * as Yup from 'yup';
import { CampoTexto, Colors, ModalConteudoHtml } from '~/componentes';
import Button from '~/componentes/button';

const ModalCadastroAtividadeContraturno = props => {
  const { onClose, exibirModal, dadosIniciais } = props;

  const [refForm, setRefForm] = useState({});

  const valoresIniciais = {
    id: dadosIniciais ? dadosIniciais.id : 0,
    local: dadosIniciais ? dadosIniciais.tipoLogradouro : '',
    atividade: dadosIniciais ? dadosIniciais.logradouro : '',
  };

  const validacoes = Yup.object().shape({
    local: Yup.string()
      .nullable()
      .required('Campo obrigatório'),
    atividade: Yup.string()
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
      titulo="Nova atividade contraturno"
      key="nova-atividade-contraturno-modal"
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
                  name="local"
                  label="Local"
                  placeholder="Informe o local"
                />
              </Col>

              <Col sm={24} lg={12}>
                <CampoTexto
                  form={form}
                  labelRequired
                  name="atividade"
                  label="Atividade"
                  placeholder="Informe a atividade"
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

ModalCadastroAtividadeContraturno.propTypes = {
  onClose: PropTypes.func,
  exibirModal: PropTypes.bool,
  dadosIniciais: PropTypes.oneOfType([PropTypes.any]),
};

ModalCadastroAtividadeContraturno.defaultProps = {
  onClose: () => {},
  exibirModal: false,
  dadosIniciais: null,
};

export default ModalCadastroAtividadeContraturno;