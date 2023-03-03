import { Col, Row } from 'antd';
import { Form, Formik } from 'formik';
import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { CampoTexto, Colors, Loader, ModalConteudoHtml } from '~/componentes';
import Button from '~/componentes/button';
import {
  SGP_BUTTON_SALVAR_MODAL_OBSERVACOES_COMPLEMENTARES,
  SGP_BUTTON_CANCELAR_MODAL_OBSERVACOES_COMPLEMENTARES,
} from '~/constantes/ids/button';
import { erros, sucesso } from '~/servicos';
import ServicoHistoricoEscolar from '~/servicos/Paginas/HistoricoEscolar/ServicoHistoricoEscolar';

const ModalObservacoesComplementares = props => {
  const { exibirModal, setExibirModal, codigoAluno, gerarRelatorio } = props;

  const [exibirLoader, setExibirLoader] = useState(false);
  const [refForm, setRefForm] = useState({});

  const [valoresIniciais, setValoresIniciais] = useState({
    observacao: '',
  });

  const validacoes = Yup.object().shape({
    observacao: Yup.string().nullable().required('Campo obrigatório'),
  });

  const fecharModal = (gerarRel = false) => {
    setExibirModal(false);

    if (gerarRel) {
      gerarRelatorio(refForm?.state?.values?.observacao);
    }

    if (refForm && refForm.resetForm) {
      refForm.resetForm();
    }
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

  const onClickSalvar = async valores => {
    const { observacao } = valores;

    setExibirLoader(true);

    const retorno = await ServicoHistoricoEscolar.salvarObservacaoComplementar(
      codigoAluno,
      observacao
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.status === 200) {
      sucesso('Observação salva com sucesso.');
      fecharModal(true);
    }
  };

  const obterObservacao = async () => {
    setExibirLoader(true);
    const retorno = await ServicoHistoricoEscolar.obterObservacaoComplementar(
      codigoAluno
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));
    if (retorno?.status === 200) {
      setValoresIniciais({ observacao: retorno?.data || '' });
    }
  };

  useEffect(() => {
    obterObservacao();
    return () => {
      fecharModal();
    };
  }, []);

  return (
    <ModalConteudoHtml
      key="key-modal-observacoes-complementares"
      visivel={exibirModal}
      titulo="Observações"
      onClose={() => fecharModal()}
      esconderBotaoPrincipal
      esconderBotaoSecundario
      width={750}
      closable={!exibirLoader}
      fecharAoClicarFora={!exibirLoader}
      fecharAoClicarEsc={!exibirLoader}
    >
      <Formik
        ref={f => setRefForm(f)}
        enableReinitialize
        initialValues={valoresIniciais}
        validationSchema={validacoes}
        onSubmit={valores => {
          onClickSalvar(valores);
        }}
        validateOnChange
        validateOnBlur
      >
        {form => (
          <Loader loading={exibirLoader} tip="">
            <Form>
              <Row gutter={[16, 16]}>
                <Col sm={24}>
                  <CampoTexto
                    maxLength={500}
                    form={form}
                    name="observacao"
                    type="textarea"
                    labelRequired
                  />
                </Col>
              </Row>
              <Row gutter={[8, 8]} type="flex" justify="end">
                <Col>
                  <Button
                    id={SGP_BUTTON_CANCELAR_MODAL_OBSERVACOES_COMPLEMENTARES}
                    label="Cancelar"
                    color={Colors.Azul}
                    border
                    onClick={() => fecharModal()}
                  />
                </Col>
                <Col>
                  <Button
                    id={SGP_BUTTON_SALVAR_MODAL_OBSERVACOES_COMPLEMENTARES}
                    label="Salvar"
                    color={Colors.Azul}
                    onClick={() => validaAntesDoSubmit(form)}
                  />
                </Col>
              </Row>
            </Form>
          </Loader>
        )}
      </Formik>
    </ModalConteudoHtml>
  );
};

export default ModalObservacoesComplementares;
