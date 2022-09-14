import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import shortid from 'shortid';
import * as Yup from 'yup';
import { Auditoria, Colors, Loader, ModalConteudoHtml } from '~/componentes';
import DetalhesAluno from '~/componentes/Alunos/Detalhes';
import Button from '~/componentes/button';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import SelectComponent from '~/componentes/select';
import { confirmar, erros, sucesso } from '~/servicos/alertas';
import ServicoAnotacaoFrequenciaAluno from '~/servicos/Paginas/DiarioClasse/ServicoAnotacaoFrequenciaAluno';
import { EditorAnotacao } from './modalAnotacoes.css';

const ModalAnotacoesFrequencia = props => {
  const {
    dadosListaFrequencia,
    ehInfantil,
    aulaId,
    componenteCurricularId,
    desabilitarCampos,
    exibirModal,
    setExibirModal,
    dadosModal,
    setDadosModal,
    fechouModal,
    listaPadraoMotivoAusencia,
  } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setDadosModal({}));
      dispatch(setExibirModal(false));
    };
  }, [dispatch, setExibirModal, setDadosModal]);

  const [carregandoMotivosAusencia, setCarregandoMotivosAusencia] = useState(
    exibirModal
  );

  const iniciar = {
    id: 0,
    anotacao: '',
    motivoAusenciaId: undefined,
    auditoria: {},
  };

  const [listaMotivoAusencia, setListaMotivoAusencia] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [refForm, setRefForm] = useState({});
  const [valoresIniciais, setValoresIniciais] = useState(iniciar);
  const [loaderSalvarEditar, setLoaderSalvarEditar] = useState(false);

  const [validacoes] = useState(
    Yup.object().shape(
      {
        anotacao: Yup.string()
          .nullable()
          .when('motivoAusenciaId', (motivoAusenciaId, schema) => {
            return motivoAusenciaId
              ? schema.notRequired()
              : schema.required('Anotação obrigatória');
          }),
        motivoAusenciaId: Yup.string()
          .nullable()
          .when('anotacao', (anotacao, schema) => {
            return anotacao
              ? schema.notRequired()
              : schema.required('Motivo ausência obrigatório');
          }),
      },
      ['motivoAusenciaId', 'anotacao']
    )
  );

  const [dadosEstudanteOuCrianca, setDadosEstudanteOuCrianca] = useState({});

  const onCloseModal = (salvou, excluiu) => {
    refForm.resetForm({});
    refForm.setFieldValue('anotacao', null);
    setValoresIniciais({});
    setValoresIniciais({ ...iniciar });
    setRefForm({});
    dispatch(setDadosModal({}));
    dispatch(setExibirModal(false));
    setModoEdicao(false);
    fechouModal(salvou, excluiu);
    setDadosEstudanteOuCrianca({});
  };

  const obterAnotacao = useCallback(async () => {
    const resultado = await ServicoAnotacaoFrequenciaAluno.obterAnotacao(
      dadosModal?.codigoAluno,
      aulaId
    ).catch(e => erros(e));

    if (resultado && resultado.data) {
      resultado.data.motivoAusenciaId = resultado.data.motivoAusenciaId
        ? String(resultado.data.motivoAusenciaId)
        : undefined;
      setValoresIniciais(resultado.data);
      setModoEdicao(false);
    }
  }, [aulaId, dadosModal]);

  const obterListaMotivosAusencia = async () => {
    const retorno = await ServicoAnotacaoFrequenciaAluno.obterMotivosAusencia().catch(
      e => erros(e)
    );
    if (retorno && retorno.data) {
      setListaMotivoAusencia(retorno.data);
    } else {
      setListaMotivoAusencia([]);
    }
    setCarregandoMotivosAusencia(false);
  };

  const montarDadosAluno = useCallback(() => {
    const aluno = {
      ...dadosModal,
      nome: dadosModal?.nomeAluno,
      numeroChamada: dadosModal?.numeroAlunoChamada,
      dataNascimento: dadosModal?.dataNascimento,
      codigoEOL: dadosModal?.codigoAluno,
    };
    setDadosEstudanteOuCrianca(aluno);
  }, [dadosModal]);

  useEffect(() => {
    if (listaPadraoMotivoAusencia?.length)
      setListaMotivoAusencia(listaPadraoMotivoAusencia);
  }, [listaPadraoMotivoAusencia]);

  useEffect(() => {
    if (!listaPadraoMotivoAusencia?.length && dadosModal?.codigoAluno) {
      obterListaMotivosAusencia();
    } else {
      setCarregandoMotivosAusencia(false);
    }
  }, [listaPadraoMotivoAusencia, dadosModal]);

  useEffect(() => {
    if (dadosModal?.codigoAluno) {
      obterAnotacao();
      montarDadosAluno();
    }
  }, [dadosModal, obterAnotacao, montarDadosAluno]);

  const fecharAposSalvarExcluir = (salvou, excluiu) => {
    const linhaEditada = dadosListaFrequencia.find(
      item => item.codigoAluno === dadosModal.codigoAluno
    );
    const index = dadosListaFrequencia.indexOf(linhaEditada);
    if (salvou) {
      dadosListaFrequencia[index].possuiAnotacao = true;
    } else if (excluiu) {
      dadosListaFrequencia[index].possuiAnotacao = false;
    }
    onCloseModal(salvou, excluiu);
  };

  const onClickExcluir = async id => {
    const retorno = await ServicoAnotacaoFrequenciaAluno.deletarAnotacao(
      id
    ).catch(e => erros(e));
    if (retorno && retorno.status === 200) {
      sucesso('Anotação excluída com sucesso');
      fecharAposSalvarExcluir(false, true);
    }
  };

  const onClickEditar = async valores => {
    const { anotacao, motivoAusenciaId, id } = valores;
    const params = {
      motivoAusenciaId,
      id,
      anotacao,
    };
    const retorno = await ServicoAnotacaoFrequenciaAluno.alterarAnotacao(params)
      .catch(e => erros(e))
      .finally(() => setLoaderSalvarEditar(false));
    if (retorno && retorno.status === 200) {
      sucesso('Anotação alterada com sucesso');
      fecharAposSalvarExcluir(true, false);
    }
  };

  const onClickSalvar = async valores => {
    const { codigoAluno } = dadosModal;
    const { anotacao, motivoAusenciaId } = valores;
    const params = {
      motivoAusenciaId,
      aulaId,
      componenteCurricularId,
      anotacao,
      codigoAluno,
      ehInfantil,
    };
    const retorno = await ServicoAnotacaoFrequenciaAluno.salvarAnotacao(params)
      .catch(e => {
        erros(e);
        onCloseModal();
      })
      .finally(() => setLoaderSalvarEditar(false));
    if (retorno && retorno.status === 200) {
      sucesso('Anotação salva com sucesso');
      fecharAposSalvarExcluir(true, false);
    }
  };

  const validaAntesDoSubmit = form => {
    if (!desabilitarCampos) {
      const arrayCampos = Object.keys(valoresIniciais);
      arrayCampos.forEach(campo => {
        form.setFieldTouched(campo, true, true);
      });
      form.validateForm().then(() => {
        if (form.isValid || Object.keys(form.errors).length === 0) {
          setLoaderSalvarEditar(true);
          setTimeout(() => {
            form.handleSubmit(e => e);
          }, 400);
        }
      });
    }
  };

  const validaAntesDeExcluir = async id => {
    if (!desabilitarCampos) {
      dispatch(setExibirModal(false));
      dispatch(setExibirModal(false));
      const confirmado = await confirmar(
        'Atenção',
        '',
        'Você tem certeza que deseja excluir este registro?'
      );
      if (confirmado) {
        onClickExcluir(id);
      } else {
        dispatch(setExibirModal(true));
      }
    }
  };

  const validaAntesDeFechar = async () => {
    if (modoEdicao && !desabilitarCampos) {
      dispatch(setExibirModal(false));
      const confirmado = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );
      if (confirmado) {
        if (refForm) {
          validaAntesDoSubmit(refForm.getFormikContext());
        }
      } else {
        onCloseModal();
      }
    } else {
      onCloseModal();
    }
  };

  const onChangeCampos = () => {
    if (!modoEdicao) {
      setModoEdicao(true);
    }
  };

  return (
    <ModalConteudoHtml
      id={shortid.generate()}
      key="inserir-anotacao"
      visivel={exibirModal}
      titulo={`Anotações ${ehInfantil ? 'da criança' : 'do estudante'}`}
      onClose={() => (!loaderSalvarEditar ? validaAntesDeFechar() : null)}
      esconderBotaoPrincipal
      esconderBotaoSecundario
      width={750}
      closable
    >
      <Formik
        ref={f => setRefForm(f)}
        enableReinitialize
        initialValues={valoresIniciais}
        validationSchema={validacoes}
        onSubmit={valores => {
          if (valores.id) {
            onClickEditar(valores);
          } else {
            onClickSalvar(valores);
          }
        }}
        validateOnChange
        validateOnBlur
      >
        {form => (
          <Loader loading={loaderSalvarEditar}>
            <Form>
              <div className="col-md-12">
                <DetalhesAluno
                  dados={dadosEstudanteOuCrianca}
                  exibirBotaoImprimir={false}
                  exibirFrequencia={false}
                  permiteAlterarImagem={false}
                />
              </div>
              <div className="col-md-12 mt-2">
                <Loader loading={carregandoMotivosAusencia} tip="">
                  <SelectComponent
                    form={form}
                    id="motivo-ausencia"
                    name="motivoAusenciaId"
                    lista={listaMotivoAusencia}
                    valueOption="valor"
                    valueText="descricao"
                    onChange={onChangeCampos}
                    placeholder="Selecione um motivo"
                    disabled={desabilitarCampos}
                  />
                </Loader>
              </div>
              <div className="col-md-12 mt-2">
                <EditorAnotacao>
                  <JoditEditor
                    form={form}
                    value={refForm?.state?.values?.anotacao}
                    name="anotacao"
                    onChange={v => {
                      if (valoresIniciais.anotacao !== v) {
                        onChangeCampos();
                      }
                    }}
                    readonly={desabilitarCampos}
                  />
                </EditorAnotacao>
              </div>
              <div className="row">
                <div
                  className="col-md-12 d-flex justify-content-start"
                  style={{ marginTop: '-15px' }}
                >
                  {valoresIniciais &&
                  valoresIniciais.auditoria &&
                  valoresIniciais.auditoria.criadoPor ? (
                    <Auditoria
                      criadoPor={valoresIniciais.auditoria.criadoPor}
                      criadoEm={valoresIniciais.auditoria.criadoEm}
                      alteradoPor={valoresIniciais.auditoria.alteradoPor}
                      alteradoEm={valoresIniciais.auditoria.alteradoEm}
                      alteradoRf={valoresIniciais.auditoria.alteradoRF}
                      criadoRf={valoresIniciais.auditoria.criadoRF}
                    />
                  ) : (
                    ''
                  )}
                </div>
                <div className="col-md-12 d-flex justify-content-end">
                  <Button
                    key="btn-voltar-anotacao"
                    id="btn-voltar-anotacao"
                    label="Voltar"
                    icon="arrow-left"
                    color={Colors.Azul}
                    border
                    onClick={validaAntesDeFechar}
                    className="mr-3 mt-2 padding-btn-confirmacao"
                  />
                  <Button
                    key="btn-excluir-anotacao"
                    id="btn-excluir-anotacao"
                    label="Excluir"
                    color={Colors.Vermelho}
                    bold
                    border
                    className="mr-3 mt-2 padding-btn-confirmacao"
                    onClick={() => validaAntesDeExcluir(form.values.id)}
                    disabled={desabilitarCampos || !dadosModal?.possuiAnotacao}
                  />
                  <Button
                    id="btn-salvar-anotacao"
                    key="btn-salvar-anotacao"
                    label={
                      valoresIniciais && valoresIniciais.id
                        ? 'Alterar'
                        : 'Salvar'
                    }
                    color={Colors.Roxo}
                    bold
                    border
                    className="mr-3 mt-2 padding-btn-confirmacao"
                    onClick={() => validaAntesDoSubmit(form)}
                    disabled={!modoEdicao || desabilitarCampos}
                  />
                </div>
              </div>
            </Form>
          </Loader>
        )}
      </Formik>
    </ModalConteudoHtml>
  );
};

ModalAnotacoesFrequencia.propTypes = {
  dadosListaFrequencia: PropTypes.oneOfType([PropTypes.array]),
  ehInfantil: PropTypes.bool,
  aulaId: PropTypes.oneOfType([PropTypes.any]),
  componenteCurricularId: PropTypes.oneOfType([PropTypes.any]),
  desabilitarCampos: PropTypes.bool,
  exibirModal: PropTypes.bool,
  setExibirModal: PropTypes.func,
  dadosModal: PropTypes.oneOfType([PropTypes.any]),
  setDadosModal: PropTypes.func,
  fechouModal: PropTypes.func,
  listaPadraoMotivoAusencia: PropTypes.oneOfType([PropTypes.array]),
};

ModalAnotacoesFrequencia.defaultProps = {
  dadosListaFrequencia: [],
  ehInfantil: false,
  aulaId: '',
  componenteCurricularId: '',
  desabilitarCampos: false,
  exibirModal: false,
  setExibirModal: () => {},
  dadosModal: [],
  setDadosModal: () => {},
  fechouModal: () => {},
  listaPadraoMotivoAusencia: [],
};

export default ModalAnotacoesFrequencia;
