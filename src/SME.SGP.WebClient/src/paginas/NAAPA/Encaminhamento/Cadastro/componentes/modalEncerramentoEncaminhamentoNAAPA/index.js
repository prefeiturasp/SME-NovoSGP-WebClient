import { Col, Row } from 'antd';
import { Form, Formik } from 'formik';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import * as Yup from 'yup';
import { CampoTexto, Colors, Loader, ModalConteudoHtml } from '~/componentes';
import Button from '~/componentes/button';
import {
  SGP_BUTTON_CANCELAR_MODAL_ENCERRAMENTO,
  SGP_BUTTON_SALVAR_MODAL_ENCERRAMENTO,
} from '~/constantes/ids/button';
import { RotasDto } from '~/dtos';
import { setExibirModalEncerramentoEncaminhamentoNAAPA } from '~/redux/modulos/encaminhamentoNAAPA/actions';
import { confirmar, erros, history, sucesso } from '~/servicos';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';

const ModalEncerramentoEncaminhamentoNAAPA = () => {
  const dispatch = useDispatch();
  const routeMatch = useRouteMatch();

  const encaminhamentoId = routeMatch?.params?.id;

  const exibirModalEncerramentoEncaminhamentoNAAPA = useSelector(
    store =>
      store.encaminhamentoNAAPA.exibirModalEncerramentoEncaminhamentoNAAPA
  );

  const [modoEdicao, setModoEdicao] = useState(false);
  const [exibirLoader, setExibirLoader] = useState(false);
  const [refForm, setRefForm] = useState({});

  const valoresIniciais = {
    motivoEncerramento: '',
  };

  const validacoes = Yup.object().shape({
    motivoEncerramento: Yup.string()
      .nullable()
      .required('Campo obrigatório'),
  });

  const fecharModal = () => {
    dispatch(setExibirModalEncerramentoEncaminhamentoNAAPA(false));
    setModoEdicao(false);
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

  const validaAntesDeFechar = async () => {
    if (modoEdicao) {
      const confirmado = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmado) {
        fecharModal();
      }
    } else {
      fecharModal();
    }
  };

  const onClickEncerrar = async valores => {
    const { motivoEncerramento } = valores;

    setExibirLoader(true);

    const retorno = await ServicoNAAPA.encerrarEncaminhamentoNAAPA(
      encaminhamentoId,
      motivoEncerramento
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.status === 200) {
      sucesso('Encaminhamento encerrado com sucesso.');
      fecharModal();
      history.push(RotasDto.ENCAMINHAMENTO_NAAPA);
    }
  };

  useEffect(() => {
    return () => {
      fecharModal();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ModalConteudoHtml
      key="encerramento-encaminhamento-naapa"
      visivel={exibirModalEncerramentoEncaminhamentoNAAPA}
      titulo="Encerramento"
      onClose={() => validaAntesDeFechar()}
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
          onClickEncerrar(valores);
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
                    label="Justificativa do encerramento"
                    maxLength={500}
                    form={form}
                    name="motivoEncerramento"
                    type="textarea"
                    onChange={() => {
                      setModoEdicao(true);
                    }}
                    labelRequired
                  />
                </Col>
              </Row>
              <Row gutter={[8, 8]} type="flex" justify="end">
                <Col>
                  <Button
                    id={SGP_BUTTON_CANCELAR_MODAL_ENCERRAMENTO}
                    label="Cancelar"
                    color={Colors.Azul}
                    border
                    onClick={() => validaAntesDeFechar()}
                  />
                </Col>
                <Col>
                  <Button
                    id={SGP_BUTTON_SALVAR_MODAL_ENCERRAMENTO}
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

export default ModalEncerramentoEncaminhamentoNAAPA;
