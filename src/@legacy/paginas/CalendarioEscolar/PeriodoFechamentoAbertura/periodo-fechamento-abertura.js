import { Col, Row } from 'antd';
import { FieldArray, Form, Formik } from 'formik';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import * as Yup from 'yup';
import {
  Auditoria,
  Button,
  CampoData,
  Card,
  Colors,
  Loader,
  momentSchema,
  SelectAutocomplete,
} from '~/componentes';
import { Cabecalho, RegistroMigrado } from '~/componentes-sgp';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_ALTERAR_CADASTRAR,
  SGP_BUTTON_CANCELAR,
} from '~/constantes/ids/button';
import { URL_HOME } from '~/constantes';
import { periodo, RotasDto } from '~/dtos';
import { ContainerColumnReverse } from '~/paginas/Planejamento/Anual/planoAnual.css';
import {
  confirmar,
  erros,
  ServicoCalendarios,
  ServicoPeriodoFechamento,
  sucesso,
  verificaSomenteConsulta,
} from '~/servicos';
import {
  BoxTextoBimestre,
  CaixaBimestre,
} from './periodo-fechamento-abertura.css';
import { useNavigate } from 'react-router-dom';

const PeriodoFechamentoAbertura = () => {
  const navigate = useNavigate();

  const usuarioLogado = useSelector(store => store.usuario);
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const permissoesTela =
    usuarioLogado.permissoes[ROUTES.PERIODO_FECHAMENTO_ABERTURA];
  const [tipoCalendarioSelecionado, setTipoCalendarioSelecionado] =
    useState('');

  const [emProcessamento, setEmprocessamento] = useState(false);
  const [registroMigrado, setRegistroMigrado] = useState(false);
  const [carregandoTipos, setCarregandoTipos] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [desabilitarCampos, setDesabilitarCampos] = useState(false);
  const [idFechamentoAbertura, setIdFechamentoAbertura] = useState(0);
  const [ehRegistroExistente, setEhRegistroExistente] = useState(false);

  const obtemPeriodosIniciais = () => {
    return {
      tipoCalendarioId: null,
      periodoEscolarId: null,
      migrado: false,
      id: 0,
      fechamentosBimestres: [],
      bimestre1InicioDoFechamento: '',
      bimestre1FinalDoFechamento: '',
      bimestre2InicioDoFechamento: '',
      bimestre2FinalDoFechamento: '',
      bimestre3InicioDoFechamento: '',
      bimestre3FinalDoFechamento: '',
      bimestre4InicioDoFechamento: '',
      bimestre4FinalDoFechamento: '',
    };
  };
  const [fechamento, setFechamento] = useState(obtemPeriodosIniciais());
  const [auditoria, setAuditoria] = useState({});
  const [isTipoCalendarioAnual, setIsTipoCalendarioAnual] = useState(true);
  const [validacoes, setValidacoes] = useState();
  const [listaTipoCalendario, setListaTipoCalendario] = useState([]);
  const [valorTipoCalendario, setValorTipoCalendario] = useState('');
  const [pesquisaTipoCalendario, setPesquisaTipoCalendario] = useState('');

  const validacaoPrimeiroBim = {
    bimestre1InicioDoFechamento: momentSchema.required(
      'Data inicial obrigatória'
    ),
    bimestre1FinalDoFechamento: momentSchema
      .required('Data final obrigatória')
      .dataMenorQue(
        'bimestre1InicioDoFechamento',
        'bimestre1FinalDoFechamento',
        'Data inválida'
      ),
  };

  const validacaoSegundoBim = {
    bimestre2InicioDoFechamento: momentSchema
      .required('Data inicial obrigatória')
      .dataMenorIgualQue(
        'bimestre1FinalDoFechamento',
        'bimestre2InicioDoFechamento',
        'Data inválida'
      ),
    bimestre2FinalDoFechamento: momentSchema
      .required('Data final obrigatória')
      .dataMenorQue(
        'bimestre2InicioDoFechamento',
        'bimestre2FinalDoFechamento',
        'Data inválida'
      ),
  };

  const validacaoTerceiroBim = {
    bimestre3InicioDoFechamento: momentSchema
      .required('Data inicial obrigatória')
      .dataMenorIgualQue(
        'bimestre2FinalDoFechamento',
        'bimestre3InicioDoFechamento',
        'Data inválida'
      ),
    bimestre3FinalDoFechamento: momentSchema
      .required('Data final obrigatória')
      .dataMenorQue(
        'bimestre3InicioDoFechamento',
        'bimestre3FinalDoFechamento',
        'Data inválida'
      ),
  };

  const validacaoQuartoBim = {
    bimestre4InicioDoFechamento: momentSchema
      .required('Data inicial obrigatória')
      .dataMenorIgualQue(
        'bimestre3FinalDoFechamento',
        'bimestre4InicioDoFechamento',
        'Data inválida'
      ),
    bimestre4FinalDoFechamento: momentSchema
      .required('Data final obrigatória')
      .dataMenorQue(
        'bimestre4InicioDoFechamento',
        'bimestre4FinalDoFechamento',
        'Data inválida'
      ),
  };

  useEffect(() => {
    let periodos = {};
    if (isTipoCalendarioAnual) {
      periodos = Object.assign(
        {},
        validacaoPrimeiroBim,
        validacaoSegundoBim,
        validacaoTerceiroBim,
        validacaoQuartoBim
      );
    } else {
      periodos = Object.assign({}, validacaoPrimeiroBim, validacaoSegundoBim);
    }
    setValidacoes(Yup.object().shape(periodos));
  }, [isTipoCalendarioAnual]);

  useEffect(() => {
    const somenteConsultarFrequencia = verificaSomenteConsulta(permissoesTela);
    setSomenteConsulta(somenteConsultarFrequencia);
  }, [permissoesTela]);

  useEffect(() => {
    const desabilitar =
      idFechamentoAbertura > 0
        ? somenteConsulta || !permissoesTela.podeAlterar
        : somenteConsulta || !permissoesTela.podeIncluir;
    setDesabilitarCampos(desabilitar);
  }, [
    idFechamentoAbertura,
    permissoesTela.podeAlterar,
    permissoesTela.podeIncluir,
    somenteConsulta,
  ]);

  const obterDataMoment = data => {
    return data ? moment(data) : null;
  };

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      setCarregandoTipos(true);

      const { data } =
        await ServicoCalendarios.obterTiposCalendarioAutoComplete(
          pesquisaTipoCalendario
        );

      if (isSubscribed) {
        setListaTipoCalendario(data);
        setCarregandoTipos(false);
      }
    })();

    return () => {
      isSubscribed = false;
    };
  }, [pesquisaTipoCalendario]);

  const carregaDados = useCallback(() => {
    setModoEdicao(false);
    if (tipoCalendarioSelecionado) {
      setEmprocessamento(true);
      ServicoPeriodoFechamento.obterPorTipoCalendario(tipoCalendarioSelecionado)
        .then(resposta => {
          if (resposta?.data?.fechamentosBimestres) {
            const montarDataInicio = item => {
              return item.inicioDoFechamento
                ? obterDataMoment(item.inicioDoFechamento)
                : '';
            };

            const montarDataFim = item => {
              return item.finalDoFechamento
                ? obterDataMoment(item.finalDoFechamento)
                : '';
            };

            resposta.data.fechamentosBimestres.forEach(item => {
              switch (item.bimestre) {
                case 1:
                  resposta.data.bimestre1InicioDoFechamento =
                    montarDataInicio(item);
                  resposta.data.bimestre1FinalDoFechamento =
                    montarDataFim(item);
                  break;
                case 2:
                  resposta.data.bimestre2InicioDoFechamento =
                    montarDataInicio(item);
                  resposta.data.bimestre2FinalDoFechamento =
                    montarDataFim(item);
                  break;
                case 3:
                  resposta.data.bimestre3InicioDoFechamento =
                    montarDataInicio(item);
                  resposta.data.bimestre3FinalDoFechamento =
                    montarDataFim(item);
                  break;
                case 4:
                  resposta.data.bimestre4InicioDoFechamento =
                    montarDataInicio(item);
                  resposta.data.bimestre4FinalDoFechamento =
                    montarDataFim(item);
                  break;
                default:
                  break;
              }
              item.inicioMinimo = obterDataMoment(item.inicioMinimo);
              item.finalMaximo = obterDataMoment(item.finalMaximo);
            });
            setEhRegistroExistente(resposta.data.id);
            setFechamento(resposta.data);
            setRegistroMigrado(resposta.data.migrado);
            setAuditoria({
              criadoEm: resposta.data.criadoEm,
              criadoPor: resposta.data.criadoPor,
              criadoRf: resposta.data.criadoRF,
              alteradoPor: resposta.data.alteradoPor,
              alteradoEm: resposta.data.alteradoEm,
              alteradoRf: resposta.data.alteradoRF,
            });
            setIdFechamentoAbertura(resposta.data.id);
          } else {
            setFechamento(obtemPeriodosIniciais());
          }
        })
        .catch(e => {
          setFechamento(obtemPeriodosIniciais());
          erros(e);
        })
        .finally(() => setEmprocessamento(false));
    } else {
      setFechamento(obtemPeriodosIniciais());
    }
  }, [tipoCalendarioSelecionado]);

  useEffect(() => {
    carregaDados();
  }, [carregaDados, tipoCalendarioSelecionado]);

  const touchedFields = form => {
    const arrayCampos = Object.keys(fechamento);
    arrayCampos.forEach(campo => {
      form.setFieldTouched(campo, true, true);
    });
  };

  const onChangeCamposData = form => {
    if (!modoEdicao) {
      touchedFields(form);
      setModoEdicao(true);
    }
  };

  const resetarTela = form => {
    form.resetForm();
    setModoEdicao(false);
    setFechamento(obtemPeriodosIniciais());
    carregaDados();
  };

  const onClickCancelar = async form => {
    if (modoEdicao) {
      const confirmado = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmado) {
        resetarTela(form);
      }
    }
  };

  const onSubmit = async (form, voltar) => {
    form.fechamentosBimestres.forEach(item => {
      switch (item.bimestre) {
        case 1:
          item.inicioDoFechamento = form.bimestre1InicioDoFechamento.toDate();
          item.finalDoFechamento = form.bimestre1FinalDoFechamento.toDate();
          break;
        case 2:
          item.inicioDoFechamento = form.bimestre2InicioDoFechamento.toDate();
          item.finalDoFechamento = form.bimestre2FinalDoFechamento.toDate();
          break;
        case 3:
          item.inicioDoFechamento = form.bimestre3InicioDoFechamento.toDate();
          item.finalDoFechamento = form.bimestre3FinalDoFechamento.toDate();
          break;
        case 4:
          item.inicioDoFechamento = form.bimestre4InicioDoFechamento.toDate();
          item.finalDoFechamento = form.bimestre4FinalDoFechamento.toDate();
          break;
        default:
          break;
      }
    });

    setEmprocessamento(true);
    ServicoPeriodoFechamento.salvar({
      ...form,
      confirmouAlteracaoHierarquica: false,
    })
      .then(() => {
        sucesso('Períodos salvos com sucesso.');
        carregaDados();
        setModoEdicao(false);
        if (voltar) navigate(URL_HOME);
      })
      .catch(e => erros(e))
      .finally(() => setEmprocessamento(false));
  };

  const validaAntesDoSubmit = (form, voltar) => {
    setModoEdicao(true);
    touchedFields(form);
    form.validateForm().then(() => {
      if (
        form.isValid ||
        (Object.keys(form.errors).length === 0 &&
          Object.keys(form.values).length > 0)
      ) {
        onSubmit(form?.values, voltar);
      }
    });
  };

  const onClickVoltar = async form => {
    if (modoEdicao) {
      const confirmado = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?',
        'Sim',
        'Não'
      );

      if (confirmado) {
        validaAntesDoSubmit(form, true);
      } else {
        navigate(URL_HOME);
      }
    } else {
      navigate(URL_HOME);
    }
  };

  const obterDatasParaHabilitar = (inicio, fim) => {
    const dias = [];
    let diaInicial = inicio;

    while (diaInicial <= fim) {
      dias.push(diaInicial.format('YYYY-MM-DD'));
      diaInicial = diaInicial.clone().add(1, 'd');
    }
    return dias;
  };

  const criaBimestre = (
    form,
    descricao,
    chaveDataInicial,
    chaveDataFinal,
    diasParaHabilitar,
    indice
  ) => {
    return (
      <div className="row" key={`key-${indice}`}>
        <div className="col-md-6 mb-2">
          <CaixaBimestre>
            <BoxTextoBimestre>{descricao}</BoxTextoBimestre>
          </CaixaBimestre>
        </div>
        <div className="col-md-3 mb-2">
          <CampoData
            form={form}
            placeholder="Início do Bimestre"
            formatoData="DD/MM/YYYY"
            name={chaveDataInicial}
            onChange={() => onChangeCamposData(form)}
            diasParaHabilitar={diasParaHabilitar}
            desabilitado={desabilitarCampos}
          />
        </div>
        <div className="col-md-3 mb-2">
          <CampoData
            form={form}
            placeholder="Fim do Bimestre"
            formatoData="DD/MM/YYYY"
            name={chaveDataFinal}
            onChange={() => onChangeCamposData(form)}
            diasParaHabilitar={diasParaHabilitar}
            desabilitado={desabilitarCampos}
          />
        </div>
      </div>
    );
  };

  const selecionaTipoCalendario = descricao => {
    const tipo = listaTipoCalendario?.find(t => t?.descricao === descricao);
    if (Number(tipo?.id) || !tipo?.id) {
      const isPeriodoAnual = tipo?.periodo === periodo?.Anual;
      setIsTipoCalendarioAnual(isPeriodoAnual);
      setValorTipoCalendario(descricao);
    }
    setTipoCalendarioSelecionado(tipo?.id);
  };

  const handleSearch = descricao => {
    if (descricao.length > 3 || descricao.length === 0) {
      setPesquisaTipoCalendario(descricao);
    }
  };

  return (
    <Loader loading={emProcessamento}>
      <Formik
        enableReinitialize
        initialValues={fechamento}
        validationSchema={validacoes}
        validateOnChange
        validateOnBlur
        id={shortid.generate()}
      >
        {form => (
          <>
            <Cabecalho pagina="Período de Fechamento (Abertura)">
              <Row gutter={[8, 8]} type="flex">
                <Col>
                  <BotaoVoltarPadrao onClick={() => onClickVoltar(form)} />
                </Col>
                <Col>
                  <Button
                    id={SGP_BUTTON_CANCELAR}
                    label="Cancelar"
                    color={Colors.Roxo}
                    border
                    bold
                    disabled={desabilitarCampos || !modoEdicao}
                    onClick={() => onClickCancelar(form)}
                  />
                </Col>
                <Col>
                  <Button
                    id={SGP_BUTTON_ALTERAR_CADASTRAR}
                    label={ehRegistroExistente ? 'Alterar' : 'Cadastrar'}
                    color={Colors.Roxo}
                    border
                    bold
                    disabled={
                      desabilitarCampos ||
                      (ehRegistroExistente && !modoEdicao) ||
                      !valorTipoCalendario
                    }
                    onClick={() => validaAntesDoSubmit(form)}
                  />
                </Col>
              </Row>
            </Cabecalho>
            <Card>
              <Form className="col-md-12">
                <ContainerColumnReverse className="row mb-4">
                  <div className="col-sm-12 col-md-8 col-lg-6 col-xl-4 mb-2">
                    <Loader loading={carregandoTipos} tip="">
                      <SelectAutocomplete
                        showList
                        isHandleSearch
                        placeholder="Selecione um tipo de calendário"
                        name="tipoCalendarioId"
                        id="tipoCalendarioId"
                        lista={listaTipoCalendario}
                        valueField="id"
                        textField="descricao"
                        onSelect={valor => selecionaTipoCalendario(valor)}
                        onChange={valor => selecionaTipoCalendario(valor)}
                        handleSearch={handleSearch}
                        value={valorTipoCalendario}
                        label="Calendário"
                        labelRequired
                        temErro={modoEdicao && !valorTipoCalendario}
                        mensagemErro="Campo obrigatório"
                      />
                    </Loader>
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-6 col-xl-8 pt-2 pb-2 d-flex justify-content-end">
                    {registroMigrado ? (
                      <RegistroMigrado>Registro Migrado</RegistroMigrado>
                    ) : (
                      <></>
                    )}
                  </div>
                </ContainerColumnReverse>

                <FieldArray
                  name="fechamentosBimestres"
                  render={() => (
                    <>
                      {fechamento.fechamentosBimestres.map((c, indice) =>
                        criaBimestre(
                          form,
                          `${c.bimestre}° Bimestre`,
                          `bimestre${c.bimestre}InicioDoFechamento`,
                          `bimestre${c.bimestre}FinalDoFechamento`,
                          obterDatasParaHabilitar(
                            c.inicioMinimo,
                            c.finalMaximo
                          ),
                          indice
                        )
                      )}
                    </>
                  )}
                />
                <div className="row">
                  {tipoCalendarioSelecionado &&
                  ehRegistroExistente &&
                  auditoria?.criadoEm ? (
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
                    <></>
                  )}
                </div>
              </Form>
            </Card>
          </>
        )}
      </Formik>
    </Loader>
  );
};

export default PeriodoFechamentoAbertura;
