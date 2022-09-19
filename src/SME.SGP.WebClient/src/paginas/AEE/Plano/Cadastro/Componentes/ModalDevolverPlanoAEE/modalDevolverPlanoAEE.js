import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shortid from 'shortid';
import * as Yup from 'yup';
import { CampoTexto, Colors, Loader, ModalConteudoHtml } from '~/componentes';
import Button from '~/componentes/button';
import { RotasDto } from '~/dtos';
import { setExibirModalDevolverPlanoAEE } from '~/redux/modulos/planoAEE/actions';
import { confirmar, erros, history, sucesso } from '~/servicos';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';

const ModalDevolverPlanoAEE = props => {
  const { match } = props;

  const dispatch = useDispatch();

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
    motivo: Yup.string()
      .nullable()
      .required('Campo obrigatório'),
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
    const planoAEEId = match?.params?.id;

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
      history.push(RotasDto.RELATORIO_AEE_PLANO);
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
                  id="btn-voltar"
                  label="Voltar"
                  color={Colors.Azul}
                  border
                  onClick={validaAntesDeFechar}
                  className="mt-2 mr-2"
                />
                <Button
                  key="btn-devolver"
                  id="btn-devolver"
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

ModalDevolverPlanoAEE.propTypes = {
  match: PropTypes.oneOfType([PropTypes.object]),
};

ModalDevolverPlanoAEE.defaultProps = {
  match: {},
};

export default ModalDevolverPlanoAEE;
