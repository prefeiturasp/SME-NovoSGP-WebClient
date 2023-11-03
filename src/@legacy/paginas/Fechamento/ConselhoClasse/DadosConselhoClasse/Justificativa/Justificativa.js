import { Form, Formik } from 'formik';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Auditoria, Colors, Loader } from '~/componentes';
import Button from '~/componentes/button';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import {
  setDadosListasNotasConceitos,
  setExpandirLinha,
  setJustificativaAtual,
  setNotaConceitoPosConselhoAtual,
  setSalvouJustificativa,
} from '~/redux/modulos/conselhoClasse/actions';
import { confirmar } from '~/servicos';
import servicoSalvarConselhoClasse from '../../servicoSalvarConselhoClasse';

const Justificativa = props => {
  const { alunoDesabilitado } = props;

  const dispatch = useDispatch();

  const mensagemCampoObrigatorio = 'Campo justificativa é obrigatório';

  const validacoes = Yup.object({
    justificativa: Yup.string().required(mensagemCampoObrigatorio),
  });

  const notaConceitoPosConselhoAtual = useSelector(
    store => store.conselhoClasse.notaConceitoPosConselhoAtual
  );

  const { turma } = useSelector(store => store.usuario.turmaSelecionada);

  const desabilitarCampos = useSelector(
    store => store.conselhoClasse.desabilitarCampos
  );

  const dentroPeriodo = useSelector(
    store => store.conselhoClasse.dentroPeriodo
  );

  const podeEditarNota = useSelector(
    store => store.conselhoClasse.podeEditarNota
  );

  const dadosIniciaisListasNotasConceitos = useSelector(
    store => store.conselhoClasse.dadosIniciaisListasNotasConceitos
  );

  notaConceitoPosConselhoAtual.justificativa =
    notaConceitoPosConselhoAtual.justificativa ?? '';

  const { justificativa, auditoria, ehEdicao } = notaConceitoPosConselhoAtual;

  const desabilitarBtnAcoes =
    (alunoDesabilitado && !podeEditarNota) ||
    !podeEditarNota ||
    desabilitarCampos ||
    !dentroPeriodo;

  const [valoresIniciais, setValoresIniciais] = useState({
    justificativa: '',
  });

  const [emEdicao, setEmEdicao] = useState(false);
  const [carregandoSessao, setCarregandoSessao] = useState(false);

  const salvarJustificativa = async () => {
    setCarregandoSessao(true);
    await servicoSalvarConselhoClasse.salvarNotaPosConselho(turma);
    setCarregandoSessao(false);
    dispatch(setSalvouJustificativa(true));
  };

  const clicouBotaoSalvar = form => {
    setEmEdicao(false);
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

  const onChange = justificativaNova => {
    if (!alunoDesabilitado || !desabilitarCampos || dentroPeriodo) {
      setEmEdicao(true);
      dispatch(setJustificativaAtual(justificativaNova));
    }
  };

  const clicouBotaoCancelar = async () => {
    if (!desabilitarBtnAcoes && ehEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        setEmEdicao(false);
        dispatch(setExpandirLinha([]));
        dispatch(setNotaConceitoPosConselhoAtual({}));
        const dadosCarregar = _.cloneDeep(dadosIniciaisListasNotasConceitos);
        dispatch(setDadosListasNotasConceitos([...dadosCarregar]));
      }
    } else {
      dispatch(setExpandirLinha([]));
      dispatch(setNotaConceitoPosConselhoAtual({}));
    }
  };

  useEffect(() => {
    if (!emEdicao) {
      setValoresIniciais(prev => ({ ...prev, justificativa }));
    }
  }, [justificativa]);

  return (
    <>
      {notaConceitoPosConselhoAtual && notaConceitoPosConselhoAtual.idCampo ? (
        <div className="row">
          <div className="col-md-12 d-flex justify-content-start">
            <span>Justificativa de nota pós-conselho</span>
          </div>
          <div className="col-md-12">
            <Loader loading={carregandoSessao} tip="Carregando...">
              <Formik
                enableReinitialize
                onSubmit={salvarJustificativa}
                validationSchema={validacoes}
                initialValues={valoresIniciais}
                validateOnBlur={false}
                validateOnChange={false}
              >
                {form => (
                  <Form>
                    <fieldset className="mt-3 text-left">
                      <JoditEditor
                        temErro={!form?.values?.justificativa}
                        mensagemErro={mensagemCampoObrigatorio}
                        form={form}
                        value={valoresIniciais.justificativa}
                        name="justificativa"
                        id="justificativa"
                        desabilitar={
                          (alunoDesabilitado && !podeEditarNota) ||
                          !podeEditarNota ||
                          desabilitarCampos ||
                          !dentroPeriodo ||
                          !ehEdicao
                        }
                        onChange={onChange}
                        labelRequired
                      />
                      <div className="d-flex justify-content-end pt-2">
                        {notaConceitoPosConselhoAtual &&
                        notaConceitoPosConselhoAtual.id &&
                        auditoria ? (
                          <Auditoria
                            criadoEm={auditoria.criadoEm}
                            criadoPor={auditoria.criadoPor}
                            criadoRf={auditoria.criadoRf}
                            alteradoPor={auditoria.alteradoPor}
                            alteradoEm={auditoria.alteradoEm}
                            alteradoRf={auditoria.alteradoRf}
                            ignorarMarginTop
                          />
                        ) : (
                          ''
                        )}
                        <Button
                          label="Cancelar"
                          color={Colors.Azul}
                          onClick={() => {
                            clicouBotaoCancelar(form);
                          }}
                          disabled={desabilitarBtnAcoes}
                          border
                          className="mr-3"
                        />
                        <Button
                          label="Salvar"
                          color={Colors.Roxo}
                          onClick={() => {
                            clicouBotaoSalvar(form);
                          }}
                          disabled={desabilitarBtnAcoes || !ehEdicao}
                          border
                        />
                      </div>
                    </fieldset>
                  </Form>
                )}
              </Formik>
            </Loader>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

Justificativa.propTypes = {
  alunoDesabilitado: PropTypes.bool,
};

Justificativa.defaultProps = {
  alunoDesabilitado: false,
};

export default Justificativa;
