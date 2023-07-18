import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams} from 'react-router-dom';
import shortid from 'shortid';
import * as Yup from 'yup';
import { CampoTexto, Colors, Loader, ModalConteudoHtml } from '~/componentes';
import Button from '~/componentes/button';
import {
  SGP_BUTTON_DEVOLVER_MODAL,
  SGP_BUTTON_VOLTAR_MODAL,
} from '~/constantes/ids/button';
import { SGP_INPUT_JUSTIFIQUE_MOTIVO_DEVOLUCAO } from '~/constantes/ids/input';
import { RotasDto } from '~/dtos';
import { setExibirModalDevolverPlanoAEE } from '~/redux/modulos/planoAEE/actions';
import { confirmar, erros, sucesso } from '~/servicos';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';

const ModalDevolverPlanoAEE = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const paramsRoute = useParams();


  const planoAEEId = paramsRoute?.id;

  const exibirModalDevolverPlanoAEE = useSelector(
    store => store.planoAEE.exibirModalDevolverPlanoAEE
  );

  const [modoEdicao, setModoEdicao] = useState(false);
  const [exibirLoader, setExibirLoader] = useState(false);
  const [refForm, setRefForm] = useState({});

  const valoresIniciais = {
    motivo: '',
  };

  const validacoes = Yup.object().shape({
    motivo: Yup.string().nullable().required('Campo obrigatório'),
  });

  const fecharModal = () => {
    dispatch(setExibirModalDevolverPlanoAEE(false));
    setModoEdicao(false);
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

  const onClickDevolver = async valores => {
    const { motivo } = valores;

    setExibirLoader(true);

    const retorno = await ServicoPlanoAEE.devolverPlanoAEE({
      planoAEEId,
      motivo,
    })
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.status === 200) {
      sucesso('Plano devolvido com sucesso');
      fecharModal();
      navigate(RotasDto.RELATORIO_AEE_PLANO);
    }
  };

  return (
    <ModalConteudoHtml
      id={shortid.generate()}
      key="devolucao-plano-aee"
      visivel={exibirModalDevolverPlanoAEE}
      titulo="Devolução do Plano AEE"
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
          onClickDevolver(valores);
        }}
        validateOnChange
        validateOnBlur
      >
        {form => (
          <Loader loading={exibirLoader} tip="">
            <Form>
              <div className="col-md-12 mb-2">
                <CampoTexto
                  id={SGP_INPUT_JUSTIFIQUE_MOTIVO_DEVOLUCAO}
                  label="Justifique o motivo da devolução"
                  maxLength={999999}
                  form={form}
                  name="motivo"
                  type="textarea"
                  onChange={() => {
                    setModoEdicao(true);
                  }}
                  labelRequired
                />
              </div>

              <div className="col-md-12 mt-2  d-flex justify-content-end">
                <Button
                  key="btn-voltar"
                  id={SGP_BUTTON_VOLTAR_MODAL}
                  label="Voltar"
                  color={Colors.Azul}
                  border
                  onClick={validaAntesDeFechar}
                  className="mt-2 mr-2"
                />
                <Button
                  key="btn-devolver"
                  id={SGP_BUTTON_DEVOLVER_MODAL}
                  label="Devolver"
                  color={Colors.Vermelho}
                  border
                  onClick={() => validaAntesDoSubmit(form)}
                  className="mt-2"
                />
              </div>
            </Form>
          </Loader>
        )}
      </Formik>
    </ModalConteudoHtml>
  );
};

export default ModalDevolverPlanoAEE;
