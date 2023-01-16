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
import {
  SGP_BUTTON_ADICIONAR_CONTATO_RESPONSAVEIS_MODAL,
  SGP_BUTTON_VOLTAR_CONTATO_RESPONSAVEIS_MODAL,
} from '~/constantes/ids/button';
import {
  SGP_INPUT_GRAU_PARENTESCO_AFETIVIDADE_CONTATO_RESPONSAVEIS_MODAL,
  SGP_INPUT_NOME_COMPLETO_CONTATO_RESPONSAVEIS_MODAL,
  SGP_INPUT_TELEFONE_CONTATO_RESPONSAVEIS_MODAL,
} from '~/constantes/ids/input';
import { erros } from '~/servicos';
import ServicoEstudante from '~/servicos/Paginas/Estudante/ServicoEstudante';

const ModalCadastroContatoResponsaveis = props => {
  const { onClose, exibirModal, dadosIniciais, disabled } = props;

  const [refForm, setRefForm] = useState({});
  const [grauParentescoLista, setGrauParentescoLista] = useState([]);

  const valoresIniciais = {
    id: dadosIniciais ? dadosIniciais.id : 0,
    nomeCompleto: dadosIniciais ? dadosIniciais.nomeCompleto : '',
    grauParentescoAfetividade: dadosIniciais
      ? dadosIniciais.grauParentescoAfetividade
      : '',
    grauParentescoAfetividadeDescricao: dadosIniciais
      ? dadosIniciais?.grauParentescoAfetividadeDescricao
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
      .required('Campo obrigatório')
      .test(
        'len',
        'Telefone inválido, você deve digitar o DDD com dois dígitos e o telefone com 8 ou 9 dígitos.',
        val => {
          const regex = /(?=\s(9)).*/;
          const comecaComNove = regex.test(val);

          const ehCelular = comecaComNove && val?.length === 15;
          const ehTelefone = !comecaComNove && val?.length === 14;

          return ehCelular || ehTelefone;
        }
      ),
  });

  const obterGrauParentesco = async () => {
    const resposta = await ServicoEstudante.obterGrauParentesco().catch(e =>
      erros(e)
    );

    setGrauParentescoLista(resposta?.data || []);
  };

  const fecharModal = () => {
    refForm.resetForm();
    onClose();
  };

  const onSalvar = valores => {
    if (valores?.grauParentescoAfetividade) {
      const grauSelecionado = grauParentescoLista?.find(
        g =>
          g?.codigo?.toString() ===
          valores?.grauParentescoAfetividade?.toString()
      );
      valores.grauParentescoAfetividadeDescricao = grauSelecionado?.descricao;
    }
    onClose(valores);
    refForm.resetForm();
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
                  somenteTexto
                  labelRequired
                  name="nomeCompleto"
                  label="Nome completo"
                  desabilitado={disabled}
                  placeholder="Informe o nome completo"
                  id={SGP_INPUT_NOME_COMPLETO_CONTATO_RESPONSAVEIS_MODAL}
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col sm={24} lg={12}>
                <SelectComponent
                  form={form}
                  labelRequired
                  disabled={disabled}
                  valueOption="codigo"
                  valueText="descricao"
                  lista={grauParentescoLista}
                  name="grauParentescoAfetividade"
                  label="Grau de parentesco/afetividade"
                  placeholder="Grau de parentesco/afetividade"
                  id={
                    SGP_INPUT_GRAU_PARENTESCO_AFETIVIDADE_CONTATO_RESPONSAVEIS_MODAL
                  }
                />
              </Col>

              <Col sm={24} lg={12}>
                <CampoTexto
                  form={form}
                  labelRequired
                  maxLength={15}
                  name="telefone"
                  addMaskTelefone
                  label="Telefone"
                  desabilitado={disabled}
                  placeholder="Informe o telefone"
                  id={SGP_INPUT_TELEFONE_CONTATO_RESPONSAVEIS_MODAL}
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
                  id={SGP_BUTTON_VOLTAR_CONTATO_RESPONSAVEIS_MODAL}
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
                  id={SGP_BUTTON_ADICIONAR_CONTATO_RESPONSAVEIS_MODAL}
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
  disabled: PropTypes.bool,
  exibirModal: PropTypes.bool,
  dadosIniciais: PropTypes.oneOfType([PropTypes.any]),
};

ModalCadastroContatoResponsaveis.defaultProps = {
  onClose: () => {},
  disabled: false,
  exibirModal: false,
  dadosIniciais: null,
};

export default ModalCadastroContatoResponsaveis;
