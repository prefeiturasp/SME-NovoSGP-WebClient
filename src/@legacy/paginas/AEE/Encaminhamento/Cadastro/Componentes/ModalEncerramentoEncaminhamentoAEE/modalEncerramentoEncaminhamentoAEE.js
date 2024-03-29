import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import shortid from 'shortid';
import * as Yup from 'yup';
import { CampoTexto, Colors, Loader, ModalConteudoHtml } from '~/componentes';
import Button from '~/componentes/button';
import { ROUTES } from '@/core/enum/routes';
import { setExibirModalEncerramentoEncaminhamentoAEE } from '~/redux/modulos/encaminhamentoAEE/actions';
import { confirmar, erros, sucesso } from '~/servicos';
import ServicoEncaminhamentoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoEncaminhamentoAEE';

const ModalEncerramentoEncaminhamentoAEE = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const paramsRoute = useParams();

  const encaminhamentoId = paramsRoute?.id || 0;

  const exibirModalEncerramentoEncaminhamentoAEE = useSelector(
    store => store.encaminhamentoAEE.exibirModalEncerramentoEncaminhamentoAEE
  );

  const [modoEdicao, setModoEdicao] = useState(false);
  const [exibirLoader, setExibirLoader] = useState(false);
  const [refForm, setRefForm] = useState({});

  const valoresIniciais = {
    motivoEncerramento: '',
  };

  const validacoes = Yup.object().shape({
    motivoEncerramento: Yup.string().nullable().required('Campo obrigatório'),
  });

  const fecharModal = () => {
    dispatch(setExibirModalEncerramentoEncaminhamentoAEE(false));
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

  const onClickEncerrar = async valores => {
    const { motivoEncerramento } = valores;

    setExibirLoader(true);

    const retorno =
      await ServicoEncaminhamentoAEE.encerramentoEncaminhamentoAEE(
        encaminhamentoId,
        motivoEncerramento
      )
        .catch(e => erros(e))
        .finally(() => setExibirLoader(false));

    if (retorno?.status === 200) {
      sucesso('Encaminhamento encerrado com sucesso');
      fecharModal();
      navigate(ROUTES.RELATORIO_AEE_ENCAMINHAMENTO);
    }
  };

  return (
    <ModalConteudoHtml
      id={shortid.generate()}
      key="encerramento-encaminhamento-aee"
      visivel={exibirModalEncerramentoEncaminhamentoAEE}
      titulo="Encerramento do encaminhamento AEE"
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
              <div className="col-md-12 mb-2">
                <CampoTexto
                  label="Justifique o motivo do encerramento do encaminhamento"
                  maxLength={999999}
                  form={form}
                  name="motivoEncerramento"
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
                  id="btn-voltar"
                  label="Voltar"
                  color={Colors.Azul}
                  border
                  onClick={validaAntesDeFechar}
                  className="mt-2 mr-2"
                />
                <Button
                  key="btn-indeferir"
                  id="btn-indeferir"
                  label="Indeferir"
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

export default ModalEncerramentoEncaminhamentoAEE;
