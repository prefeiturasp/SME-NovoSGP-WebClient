import { Col, Row } from 'antd';
import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import shortid from 'shortid';
import * as Yup from 'yup';
import {
  CampoTexto,
  Colors,
  ModalConteudoHtml,
  SelectComponent,
} from '~/componentes';
import Button from '~/componentes/button';
import { erros } from '~/servicos';
import ServicoEstudante from '~/servicos/Paginas/Estudante/ServicoEstudante';

const ModalCadastroContatoResponsaveis = props => {
  const { onClose, exibirModal, dadosIniciais } = props;

  const [refForm, setRefForm] = useState({});
  const [grauParentescoLista, setGruParentescoLista] = useState([]);

  const valoresIniciais = {
    id: dadosIniciais ? dadosIniciais.id : 0,
    nomeCompleto: dadosIniciais ? dadosIniciais.nomeCompleto : '',
    grauParentescoAfetividade: dadosIniciais
      ? dadosIniciais.grauParentescoAfetividade
      : '',
    telefone: dadosIniciais ? dadosIniciais.telefone : '',
  };

  const validacoes = Yup.object().shape({
    nomeCompleto: Yup.string()
      .nullable()
      .required('Campo obrigatório'),
    grauParentescoAfetividade: Yup.string()
      .nullable()
      .required('Campo obrigatório'),
    telefone: Yup.string()
      .nullable()
      .required('Campo obrigatório'),
  });

  const obterGrauParentesco = async () => {
    const resposta = await ServicoEstudante.obterGrauParentesco().catch(e =>
      erros(e)
    );

    setGruParentescoLista(resposta?.data || []);
  };

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

  useEffect(() => {
    obterGrauParentesco();
  }, []);

  return (
    <ModalConteudoHtml
      closable
      width={750}
      esconderBotoes
      onClose={fecharModal}
      visivel={exibirModal}
      id={shortid.generate()}
      key="cadastro-contato-responsável-modal"
      titulo="Cadastro de contato responsável"
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
              <Col sm={24}>
                <CampoTexto
                  form={form}
                  labelRequired
                  name="nomeCompleto"
                  label="Nome completo"
                  placeholder="Informe o nome completo"
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col sm={24} lg={12}>
                <SelectComponent
                  form={form}
                  labelRequired
                  valueOption="codigo"
                  valueText="descricao"
                  lista={grauParentescoLista}
                  name="grauParentescoAfetividade"
                  label="Grau de parentesco/afetividade"
                  placeholder="Grau de parentesco/afetividade"
                />
              </Col>

              <Col sm={24} lg={12}>
                <CampoTexto
                  form={form}
                  labelRequired
                  maxLength={11}
                  name="telefone"
                  label="Telefone"
                  placeholder="Informe o telefone"
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

ModalCadastroContatoResponsaveis.propTypes = {
  onClose: PropTypes.func,
  exibirModal: PropTypes.bool,
  dadosIniciais: PropTypes.oneOfType([PropTypes.any]),
};

ModalCadastroContatoResponsaveis.defaultProps = {
  onClose: () => {},
  exibirModal: false,
  dadosIniciais: null,
};

export default ModalCadastroContatoResponsaveis;
