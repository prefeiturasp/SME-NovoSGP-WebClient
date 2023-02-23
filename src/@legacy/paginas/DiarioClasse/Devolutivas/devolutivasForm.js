import { Col, Row } from 'antd';
import { Form, Formik } from 'formik';
import $ from 'jquery';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Auditoria, CampoData, Loader, momentSchema } from '~/componentes';
import AlertaPermiteSomenteTurmaInfantil from '~/componentes-sgp/AlertaPermiteSomenteTurmaInfantil/alertaPermiteSomenteTurmaInfantil';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import Cabecalho from '~/componentes-sgp/cabecalho';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR_ALTERAR,
} from '~/constantes/ids/button';
import Alert from '~/componentes/alert';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import SelectComponent from '~/componentes/select';
import RotasDto from '~/dtos/rotasDto';
import {
  limparDadosPlanejamento,
  setAlterouCaixaSelecao,
  setDadosPlanejamentos,
  setNumeroRegistros,
  setPlanejamentoExpandido,
  setPlanejamentoSelecionado,
} from '~/redux/modulos/devolutivas/actions';
import { confirmar, erros, sucesso } from '~/servicos/alertas';
import { setBreadcrumbManual } from '~/servicos/breadcrumb-services';
import history from '~/servicos/history';
import ServicoPeriodoEscolar from '~/servicos/Paginas/Calendario/ServicoPeriodoEscolar';
import ServicoDevolutivas from '~/servicos/Paginas/DiarioClasse/ServicoDevolutivas';
import ServicoDiarioBordo from '~/servicos/Paginas/DiarioClasse/ServicoDiarioBordo';
import ServicoDisciplina from '~/servicos/Paginas/ServicoDisciplina';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import DadosPlanejamentoDiarioBordo from './DadosPlanejamentoDiarioBordo/dadosPlanejamentoDiarioBordo';

const DevolutivasForm = ({ match }) => {
  const dispatch = useDispatch();

  const usuario = useSelector(state => state.usuario);
  const { turmaSelecionada } = usuario;

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );
  const turmaCodigo = turmaSelecionada ? turmaSelecionada.turma : 0;

  const numeroRegistros = useSelector(
    store => store.devolutivas.numeroRegistros
  );

  const [
    listaComponenteCurriculare,
    setListaComponenteCurriculare,
  ] = useState();

  const [carregandoGeral, setCarregandoGeral] = useState(false);
  const [
    codigoComponenteCurricular,
    setCodigoComponenteCurricular,
  ] = useState();
  const [turmaInfantil, setTurmaInfantil] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [datasParaHabilitar, setDatasParaHabilitar] = useState();
  const [idDevolutiva, setIdDevolutiva] = useState(0);
  const [refForm, setRefForm] = useState({});
  const permissoesTela = usuario.permissoes[RotasDto.DEVOLUTIVAS];
  const [desabilitarCampos, setDesabilitarCampos] = useState(false);
  const [exibirCampoDescricao, setExibirCampoDescricao] = useState(false);
  const [periodoLetivo, setPeriodoLetivo] = useState();

  const inicial = {
    codigoComponenteCurricular: '',
    periodoInicio: '',
    periodoFim: '',
    descricao: '',
    auditoria: null,
  };
  const [valoresIniciais, setValoresIniciais] = useState(inicial);

  const validacoesRegistroNovo = Yup.object({
    codigoComponenteCurricular: Yup.string().required('Campo obrigatório'),
    periodoInicio: momentSchema.required('Campo obrigatório'),
    periodoFim: momentSchema.required('Campo obrigatório'),
    descricao: Yup.string()
      .required('Campo obrigatório')
      .min(200, 'Você precisa preencher com no mínimo 200 caracteres'),
  });

  const validacoesRegistroEdicao = Yup.object({
    descricao: Yup.string()
      .required('Campo obrigatório')
      .min(200, 'Você precisa preencher com no mínimo 200 caracteres'),
  });

  const obterPeriodoLetivoTurma = async () => {
    if (turmaSelecionada && turmaSelecionada.turma) {
      const periodoLetivoTurmaResponse = await ServicoPeriodoEscolar.obterPeriodoLetivoTurma(
        turmaSelecionada.turma
      ).catch(e => erros(e));
      if (periodoLetivoTurmaResponse?.data) {
        const datas = [
          moment(periodoLetivoTurmaResponse.data.periodoInicio).format(
            'YYYY-MM-DD'
          ),
        ];
        const qtdDias = moment(periodoLetivoTurmaResponse.data.periodoFim).diff(
          periodoLetivoTurmaResponse.data.periodoInicio,
          'days'
        );
        for (let indice = 1; indice <= qtdDias; indice++) {
          const novaData = moment(
            periodoLetivoTurmaResponse.data.periodoInicio
          ).add(indice, 'days');
          datas.push(novaData.format('YYYY-MM-DD'));
        }
        setPeriodoLetivo(datas);
      }
    }
  };

  useEffect(() => {
    const naoSetarSomenteConsultaNoStore = !ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );

    const soConsulta = verificaSomenteConsulta(
      permissoesTela,
      naoSetarSomenteConsultaNoStore
    );
    const desabilitar =
      idDevolutiva && idDevolutiva > 0
        ? soConsulta || !permissoesTela.podeAlterar
        : soConsulta || !permissoesTela.podeIncluir;
    setDesabilitarCampos(desabilitar);
    obterPeriodoLetivoTurma();

  }, [
    idDevolutiva,
    permissoesTela,
    modalidadesFiltroPrincipal,
    turmaSelecionada,
  ]);

  useEffect(() => {
    if (match && match.params && match.params.id) {
      setBreadcrumbManual(
        match.url,
        'Alterar Devolutiva',
        RotasDto.DEVOLUTIVAS
      );
      setIdDevolutiva(match.params.id);

      dispatch(setPlanejamentoExpandido(false));
      dispatch(setPlanejamentoSelecionado([]));
    } else {
      setIdDevolutiva(0);
    }
  }, [dispatch, match]);

  const resetarTela = useCallback(() => {
    dispatch(limparDadosPlanejamento());
    dispatch(setNumeroRegistros(null));
    dispatch(setPlanejamentoExpandido(false));
    dispatch(setPlanejamentoSelecionado([]));
    dispatch(setAlterouCaixaSelecao(false));
    if (refForm && refForm.resetForm) {
      refForm.resetForm();
    }
  }, [dispatch, refForm]);

  useEffect(() => {
    const infantil = ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );
    setTurmaInfantil(infantil);

    if (!infantil) {
      resetarTela();
      history.push(RotasDto.DEVOLUTIVAS);
    }
  }, [turmaSelecionada, modalidadesFiltroPrincipal, resetarTela]);

  useEffect(() => {
    if (!turmaSelecionada.turma) {
      history.push(RotasDto.DEVOLUTIVAS);
    }
    resetarTela();
  }, [turmaSelecionada.turma, resetarTela]);

  const obterSugestaoDataInicio = useCallback(
    async codigoCompCurricular => {
      const retorno = await ServicoDevolutivas.obterSugestaoDataInicio(
        turmaCodigo,
        codigoCompCurricular
      ).catch(e => erros(e));
      if (retorno && retorno.data) {
        return moment(retorno.data);
      }
      return '';
    },
    [turmaCodigo]
  );

  const obterDatasFimParaHabilitar = async periodoInicio => {
    const dataInicial = moment({ ...periodoInicio });
    const datas = [dataInicial.format('YYYY-MM-DD')];

    setCarregandoGeral(true);
    const periodoDeDiasDevolutivaPorParametro = await ServicoDevolutivas.obterPeriodoDeDiasDevolutivaPorParametro(
      turmaSelecionada?.anoLetivo
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoGeral(false));

    const qtdMaxDias = periodoDeDiasDevolutivaPorParametro?.data || 0;
    if (qtdMaxDias) {
      for (let index = 0; index < qtdMaxDias; index += 1) {
        const novaData = dataInicial.add(1, 'days');
        datas.push(novaData.format('YYYY-MM-DD'));
      }
    }
    return datas;
  };

  const setarValoresIniciaisRegistroNovo = useCallback(
    async codigoCompCurricular => {
      const valores = {
        codigoComponenteCurricular: 0,
        periodoInicio: '',
        periodoFim: '',
        descricao: '',
        auditoria: null,
      };
      valores.codigoComponenteCurricular = codigoCompCurricular;
      valores.periodoInicio = await obterSugestaoDataInicio(
        codigoCompCurricular
      );
      if (valores.periodoInicio) {
        const paraHabilitar = await obterDatasFimParaHabilitar(
          moment(valores.periodoInicio)
        );
        setDatasParaHabilitar(paraHabilitar);
      }
      setValoresIniciais(valores);
    },

    [obterSugestaoDataInicio]
  );

  const setarValoresIniciaisRegistroEdicao = (dados, codigoComponente) => {
    const valores = {
      codigoComponenteCurricular: codigoComponente,
      periodoInicio: moment(dados.periodoInicio),
      periodoFim: moment(dados.periodoFim),
      descricao: dados.descricao,
      auditoria: dados.auditoria,
    };
    setValoresIniciais({ ...valores });
  };

  const obterDevolutiva = useCallback(async id => {
    const retorno = await ServicoDevolutivas.obterDevolutiva(id).catch(e =>
      erros(e)
    );
    if (retorno?.data) {
      setarValoresIniciaisRegistroEdicao(
        retorno.data,
        String(retorno.data?.codigoComponenteCurricular)
      );
      setCodigoComponenteCurricular(
        String(retorno.data?.codigoComponenteCurricular)
      );
    }
  }, []);

  const obterPlanejamentosPorDevolutiva = useCallback(
    async (pagina, numero) => {
      setCarregandoGeral(true);
      const numeroEscolhido = numero || numeroRegistros || 4;
      const retorno = await ServicoDiarioBordo.obterPlanejamentosPorDevolutiva(
        idDevolutiva,
        pagina || 1,
        numeroEscolhido
      ).catch(e => erros(e));
      setCarregandoGeral(false);
      if (retorno && retorno.data && retorno.data.totalRegistros) {
        setExibirCampoDescricao(true);
        dispatch(setDadosPlanejamentos(retorno.data));
      } else {
        setExibirCampoDescricao(false);
        dispatch(limparDadosPlanejamento());
      }
    },
    [idDevolutiva, numeroRegistros, dispatch]
  );

  useEffect(() => {
    const temComponente =
      listaComponenteCurriculare?.length && codigoComponenteCurricular;
    if (temComponente && (idDevolutiva || (idDevolutiva && numeroRegistros))) {
      obterPlanejamentosPorDevolutiva();
    } else {
      setExibirCampoDescricao(false);
      dispatch(limparDadosPlanejamento());
    }
  }, [
    listaComponenteCurriculare,
    codigoComponenteCurricular,
    idDevolutiva,
    numeroRegistros,
    obterPlanejamentosPorDevolutiva,
    dispatch,
  ]);

  useEffect(() => {
    if (listaComponenteCurriculare?.length && match?.params?.id) {
      obterDevolutiva(match.params.id);
    }
  }, [listaComponenteCurriculare, match, obterDevolutiva]);

  useEffect(() => {
    if (match.params.id) return;

    if (listaComponenteCurriculare?.length && codigoComponenteCurricular) {
      setarValoresIniciaisRegistroNovo(codigoComponenteCurricular);
    } else {
      if (refForm?.resetForm) {
        refForm.resetForm();
      }
      setValoresIniciais(inicial);
    }

  }, [
    codigoComponenteCurricular,
    listaComponenteCurriculare,
    setarValoresIniciaisRegistroNovo,
    match,
  ]);

  const obterComponentesCurriculares = useCallback(async () => {
    setCodigoComponenteCurricular(undefined);
    setCarregandoGeral(true);
    dispatch(limparDadosPlanejamento());
    const componentes = await ServicoDisciplina.obterDisciplinasPorTurma(
      turmaCodigo,
      false
    ).catch(e => erros(e));

    if (componentes?.data?.length) {
      setListaComponenteCurriculare(componentes.data);
      if (componentes.data.length === 1) {
        setCodigoComponenteCurricular(
          String(componentes.data[0].codigoComponenteCurricular)
        );
      }
    } else {
      setListaComponenteCurriculare([]);
    }

    setCarregandoGeral(false);
  }, [turmaCodigo, dispatch]);

  useEffect(() => {
    if (turmaCodigo && turmaInfantil) {
      obterComponentesCurriculares();
    } else {
      setListaComponenteCurriculare([]);
    }
  }, [turmaCodigo, obterComponentesCurriculares, turmaInfantil]);

  const onChangeDataInicio = async (periodoInicio, form) => {
    if (periodoInicio) {
      const paraHabilitar = await obterDatasFimParaHabilitar(periodoInicio);
      setDatasParaHabilitar(paraHabilitar);
    }
    form.setFieldValue('periodoFim', '');
    dispatch(limparDadosPlanejamento());
    setModoEdicao(true);
  };

  const obterDadosPlanejamento = useCallback(
    async (periodoFim, form, pagina, numero) => {
      const { periodoInicio } = form.values;
      setCarregandoGeral(true);
      const numeroEscolhido = numero || numeroRegistros || 4;
      const retorno = await ServicoDiarioBordo.obterPlanejamentosPorIntervalo(
        turmaCodigo,
        form?.values?.codigoComponenteCurricular,
        periodoInicio.format('YYYY-MM-DD'),
        periodoFim.format('YYYY-MM-DD'),
        pagina || 1,
        numeroEscolhido
      ).catch(e => erros(e));
      setCarregandoGeral(false);
      if (retorno && retorno.data && retorno.data.totalRegistros) {
        setExibirCampoDescricao(true);
        dispatch(setDadosPlanejamentos(retorno.data));
      } else {
        setExibirCampoDescricao(false);
        dispatch(setDadosPlanejamentos({}));
      }
    },
    [dispatch, numeroRegistros, turmaCodigo]
  );

  useEffect(() => {
    const { state } = refForm;
    if (!match?.params?.id && numeroRegistros && state?.values) {
      obterDadosPlanejamento(state?.values?.periodoFim, state);
    }
  }, [
    dispatch,
    idDevolutiva,
    match,
    numeroRegistros,
    obterDadosPlanejamento,
    refForm,
  ]);

  const onChangeDataFim = (data, form) => {
    form.setFieldValue('descricao', '');
    if (data) {
      obterDadosPlanejamento(data, form, null, 4);
    }
    dispatch(setAlterouCaixaSelecao(false));
    dispatch(setNumeroRegistros(null));
    dispatch(limparDadosPlanejamento());
    setModoEdicao(true);
  };

  const pergutarParaSalvar = () => {
    return confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
  };

  const onClickCancelar = async form => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );

      if (confirmou) {
        form.resetForm();
        setModoEdicao(false);
      }
    }
  };
  const salvarDevolutivas = async (valores, clicouBtnSalvar) => {
    setCarregandoGeral(true);

    const params = {
      turmaCodigo,
      descricao: valores.descricao,
    };

    if (!idDevolutiva) {
      params.codigoComponenteCurricular = valores.codigoComponenteCurricular;
      params.periodoInicio = valores.periodoInicio;
      params.periodoFim = valores.periodoFim;
    }
    if (idDevolutiva) {
      params.id = idDevolutiva;
    }
    const retorno = await ServicoDevolutivas.salvarAlterarDevolutiva(
      params,
      idDevolutiva
    ).catch(e => erros(e));

    setCarregandoGeral(false);
    let salvouComSucesso = false;
    if (retorno && retorno.status === 200) {
      sucesso(
        `Devolutiva ${idDevolutiva ? 'alterada' : 'inserida'} com sucesso`
      );
      if (clicouBtnSalvar) {
        setModoEdicao(false);
      }
      salvouComSucesso = true;
    }
    return salvouComSucesso;
  };

  const validaAntesDoSubmit = (form, clicouBtnSalvar) => {
    const arrayCampos = Object.keys(valoresIniciais);
    arrayCampos.forEach(campo => {
      refForm.setFieldTouched(campo, true, true);
    });
    return refForm.validateForm().then(() => {
      if (
        refForm.getFormikContext().isValid ||
        Object.keys(refForm.getFormikContext().errors).length === 0
      ) {
        return salvarDevolutivas(refForm?.state?.values, clicouBtnSalvar);
      }
      return false;
    });
  };

  const onClickVoltar = async form => {
    if (modoEdicao && turmaInfantil && !desabilitarCampos) {
      const confirmado = await pergutarParaSalvar();
      if (confirmado) {
        const salvou = await validaAntesDoSubmit(form);
        if (salvou) {
          history.push(RotasDto.DEVOLUTIVAS);
        }
      } else {
        history.push(RotasDto.DEVOLUTIVAS);
      }
    } else {
      history.push(RotasDto.DEVOLUTIVAS);
    }
  };

  const onClickExcluir = async () => {
    if (idDevolutiva) {
      const confirmado = await confirmar(
        'Excluir',
        '',
        'Você tem certeza que deseja excluir este registro?'
      );
      if (confirmado) {
        const deletou = await ServicoDevolutivas.deletarDevolutiva(
          idDevolutiva
        ).catch(e => erros(e));

        if (deletou && deletou.status === 200) {
          sucesso('Registro excluído com sucesso.');
          history.push(RotasDto.DEVOLUTIVAS);
        }
      }
    }
  };

  const onChangePage = (pagina, form) => {
    if (idDevolutiva) {
      obterPlanejamentosPorDevolutiva(pagina);
    } else {
      obterDadosPlanejamento(form.values.periodoFim, form, pagina);
    }
  };

  const setarValorNovoComponenteCurricular = descricao => {
    resetarTela();
    setValoresIniciais({});
    setCodigoComponenteCurricular(descricao);
  };

  const onChangeComponenteCurricular = async (form, descricao) => {
    if (modoEdicao && turmaInfantil && !desabilitarCampos) {
      const confirmado = await pergutarParaSalvar();
      if (confirmado) {
        const salvou = await validaAntesDoSubmit(form);
        if (salvou) {
          setarValorNovoComponenteCurricular(descricao);
        }
      } else {
        setarValorNovoComponenteCurricular(descricao);
      }
    } else {
      setarValorNovoComponenteCurricular(descricao);
    }
  };
  return (
    <Loader loading={carregandoGeral} className="w-100 my-2">
      {!turmaSelecionada.turma ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'devolutivas-selecione-turma',
            mensagem: 'Você precisa escolher uma turma',
          }}
          className="mb-2"
        />
      ) : (
        ''
      )}
      {turmaSelecionada.turma ? <AlertaPermiteSomenteTurmaInfantil /> : ''}

      <Formik
        enableReinitialize
        validationSchema={
          idDevolutiva ? validacoesRegistroEdicao : validacoesRegistroNovo
        }
        initialValues={valoresIniciais}
        validateOnBlur
        validateOnChange
        ref={refFormik => setRefForm(refFormik)}
      >
        {form => (
          <Form>
            <Cabecalho pagina="Devolutivas">
              <Row gutter={[8, 8]} type="flex">
                <Col>
                  <BotaoVoltarPadrao onClick={() => onClickVoltar(form)} />
                </Col>
                <Col>
                  <Button
                    id={SGP_BUTTON_CANCELAR}
                    label="Cancelar"
                    color={Colors.Roxo}
                    onClick={() => onClickCancelar(form)}
                    border
                    bold
                    disabled={
                      !turmaInfantil || !modoEdicao || desabilitarCampos
                    }
                  />
                </Col>
                <Col>
                  <BotaoExcluirPadrao
                    disabled={!idDevolutiva || !permissoesTela.podeExcluir}
                    onClick={onClickExcluir}
                  />
                </Col>
                <Col>
                  <Button
                    id={SGP_BUTTON_SALVAR_ALTERAR}
                    label={idDevolutiva ? 'Alterar' : 'Salvar'}
                    color={Colors.Roxo}
                    border
                    bold
                    onClick={async () => {
                      const salvou = await validaAntesDoSubmit(form, true);
                      if (salvou) {
                        history.push(RotasDto.DEVOLUTIVAS);
                      }
                    }}
                    disabled={
                      !turmaInfantil ||
                      desabilitarCampos ||
                      (idDevolutiva && !modoEdicao)
                    }
                  />
                </Col>
              </Row>
            </Cabecalho>
            <Card>
              <div className="col-md-12">
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-lg-6 col-xl-4 mb-2">
                    <SelectComponent
                      label="Componente curricular"
                      id="disciplina"
                      lista={listaComponenteCurriculare || []}
                      valueOption="codigoComponenteCurricular"
                      valueText="nomeComponenteInfantil"
                      placeholder="Selecione um componente curricular"
                      disabled={
                        !turmaInfantil ||
                        !turmaSelecionada.turma ||
                        listaComponenteCurriculare?.length === 1 ||
                        desabilitarCampos ||
                        idDevolutiva
                      }
                      onChange={descricao => {
                        onChangeComponenteCurricular(form, descricao);
                      }}
                      form={form}
                      name="codigoComponenteCurricular"
                      labelRequired
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-3 col-xl-2 mb-2">
                    <CampoData
                      label="Data início"
                      form={form}
                      name="periodoInicio"
                      onChange={data => {
                        onChangeDataInicio(data, form);
                      }}
                      placeholder="DD/MM/AAAA"
                      formatoData="DD/MM/YYYY"
                      desabilitado={
                        idDevolutiva ||
                        !turmaInfantil ||
                        !listaComponenteCurriculare ||
                        !form.values.codigoComponenteCurricular ||
                        desabilitarCampos
                      }
                      diasParaHabilitar={periodoLetivo}
                      labelRequired
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-3 col-xl-2 mb-5">
                    <CampoData
                      label="Data fim"
                      form={form}
                      name="periodoFim"
                      onChange={data => onChangeDataFim(data, form)}
                      placeholder="DD/MM/AAAA"
                      formatoData="DD/MM/YYYY"
                      desabilitado={
                        idDevolutiva ||
                        !turmaInfantil ||
                        !listaComponenteCurriculare ||
                        !form.values.periodoInicio ||
                        desabilitarCampos
                      }
                      diasParaHabilitar={datasParaHabilitar}
                      labelRequired
                    />
                  </div>

                  {(form.values.periodoInicio && form.values.periodoFim) ||
                  idDevolutiva ? (
                    <>
                      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <DadosPlanejamentoDiarioBordo
                          onChangePage={pagina => onChangePage(pagina, form)}
                        />
                      </div>
                      {exibirCampoDescricao ? (
                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mt-3">
                          <JoditEditor
                            label="Registre a sua devolutiva para este intervalo de datas"
                            form={form}
                            value={form.values.descricao}
                            name="descricao"
                            id="editor-devolutiva"
                            onChange={v => {
                              const campo = $(v);
                              if (
                                valoresIniciais?.descricao !== v &&
                                valoresIniciais?.descricao !== campo?.text()
                              ) {
                                setModoEdicao(true);
                              }
                            }}
                            desabilitar={desabilitarCampos}
                            labelRequired
                          />
                        </div>
                      ) : (
                        ''
                      )}
                      {form.values.auditoria ? (
                        <Auditoria
                          criadoEm={form.values.auditoria.criadoEm}
                          criadoPor={form.values.auditoria.criadoPor}
                          criadoRf={form.values.auditoria.criadoRF}
                          alteradoPor={form.values.auditoria.alteradoPor}
                          alteradoEm={form.values.auditoria.alteradoEm}
                          alteradoRf={form.values.auditoria.alteradoRF}
                        />
                      ) : (
                        ''
                      )}
                    </>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </Card>
          </Form>
        )}
      </Formik>
    </Loader>
  );
};

DevolutivasForm.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.object),
    PropTypes.any,
  ]),
};

DevolutivasForm.defaultProps = {
  match: {},
};

export default DevolutivasForm;
