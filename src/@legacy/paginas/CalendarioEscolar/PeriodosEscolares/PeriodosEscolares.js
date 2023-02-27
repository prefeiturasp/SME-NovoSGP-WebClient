import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { Col, Row } from 'antd';
import {
  Button,
  CampoData,
  Card,
  Colors,
  Label,
  Loader,
  momentSchema,
  SelectAutocomplete,
  Auditoria,
} from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';

import { URL_HOME } from '~/constantes';

import { periodo, RotasDto } from '~/dtos';

import {
  api,
  confirmar,
  erros,
  history,
  ServicoCalendarios,
  sucesso,
  verificaSomenteConsulta,
} from '~/servicos';

import { BoxTextoBimetre, CaixaBimestre } from './PeriodosEscoladres.css';
import {
  SGP_BUTTON_ALTERAR_CADASTRAR,
  SGP_BUTTON_CANCELAR,
} from '~/constantes/ids/button';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';

const PeriodosEscolares = () => {
  const [
    calendarioEscolarSelecionado,
    setCalendarioEscolarSelecionado,
  ] = useState('');
  const [isTipoCalendarioAnual, setIsTipoCalendarioAnual] = useState(true);
  const [validacoes, setValidacoes] = useState();
  const [modoEdicao, setModoEdicao] = useState(false);
  const [periodoEscolarEdicao, setPeriodoEscolarEdicao] = useState({});
  const valoresFormInicial = {
    primeiroBimestreDataInicial: '',
    primeiroBimestreDataFinal: '',
    segundoBimestreDataInicial: '',
    segundoBimestreDataFinal: '',
    terceiroBimestreDataInicial: '',
    terceiroBimestreDataFinal: '',
    quartoBimestreDataInicial: '',
    quartoBimestreDataFinal: '',
  };
  const [valoresIniciais, setValoresIniciais] = useState(valoresFormInicial);
  const usuario = useSelector(store => store.usuario);
  const permissoesTela = usuario.permissoes[RotasDto.PERIODOS_ESCOLARES];
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [desabilitaCampos, setDesabilitaCampos] = useState(false);
  const [listaTipoCalendario, setListaTipoCalendario] = useState([]);
  const [valorTipoCalendario, setValorTipoCalendario] = useState('');
  const [pesquisaTipoCalendario, setPesquisaTipoCalendario] = useState('');
  const [carregandoTipos, setCarregandoTipos] = useState(false);
  const [auditoria, setAuditoria] = useState({});

  const labelBotaoCadastrar = auditoria?.criadoEm ? 'Alterar' : 'Cadastrar';

  const validacaoPrimeiroBim = {
    primeiroBimestreDataInicial: momentSchema.required(
      'Data inicial obrigatória'
    ),
    primeiroBimestreDataFinal: momentSchema
      .required('Data final obrigatória')
      .dataMenorQue(
        'primeiroBimestreDataInicial',
        'primeiroBimestreDataFinal',
        'Data inválida'
      ),
  };

  const validacaoSegundoBim = {
    segundoBimestreDataInicial: momentSchema
      .required('Data inicial obrigatória')
      .dataMenorIgualQue(
        'primeiroBimestreDataFinal',
        'segundoBimestreDataInicial',
        'Data inválida'
      ),
    segundoBimestreDataFinal: momentSchema
      .required('Data final obrigatória')
      .dataMenorQue(
        'segundoBimestreDataInicial',
        'segundoBimestreDataFinal',
        'Data inválida'
      ),
  };

  const validacaoTerceiroBim = {
    terceiroBimestreDataInicial: momentSchema
      .required('Data inicial obrigatória')
      .dataMenorIgualQue(
        'segundoBimestreDataFinal',
        'terceiroBimestreDataInicial',
        'Data inválida'
      ),
    terceiroBimestreDataFinal: momentSchema
      .required('Data final obrigatória')
      .dataMenorQue(
        'terceiroBimestreDataInicial',
        'terceiroBimestreDataFinal',
        'Data inválida'
      ),
  };

  const validacaoQuartoBim = {
    quartoBimestreDataInicial: momentSchema
      .required('Data inicial obrigatória')
      .dataMenorIgualQue(
        'terceiroBimestreDataFinal',
        'quartoBimestreDataInicial',
        'Data inválida'
      ),
    quartoBimestreDataFinal: momentSchema
      .required('Data final obrigatória')
      .dataMenorQue(
        'quartoBimestreDataInicial',
        'quartoBimestreDataFinal',
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

  const consultarPeriodoPorId = async id => {
    const periodoAtual = await api.get('v1/periodo-escolar', {
      params: { codigoTipoCalendario: id },
    });

    const bimestresValorInicial = {};
    if (
      periodoAtual.data &&
      periodoAtual.data.periodos &&
      periodoAtual.data.periodos.length
    ) {
      setDesabilitaCampos(!permissoesTela.podeAlterar || somenteConsulta);
      periodoAtual.data.periodos.forEach(item => {
        switch (item.bimestre) {
          case 1:
            bimestresValorInicial.primeiroBimestreDataInicial = window.moment(
              item.periodoInicio
            );
            bimestresValorInicial.primeiroBimestreDataFinal = window.moment(
              item.periodoFim
            );
            break;
          case 2:
            bimestresValorInicial.segundoBimestreDataInicial = window.moment(
              item.periodoInicio
            );
            bimestresValorInicial.segundoBimestreDataFinal = window.moment(
              item.periodoFim
            );
            break;
          case 3:
            bimestresValorInicial.terceiroBimestreDataInicial = window.moment(
              item.periodoInicio
            );
            bimestresValorInicial.terceiroBimestreDataFinal = window.moment(
              item.periodoFim
            );
            break;
          case 4:
            bimestresValorInicial.quartoBimestreDataInicial = window.moment(
              item.periodoInicio
            );
            bimestresValorInicial.quartoBimestreDataFinal = window.moment(
              item.periodoFim
            );
            break;
          default:
            break;
        }
      });
    } else {
      setDesabilitaCampos(!permissoesTela.podeIncluir || somenteConsulta);
    }

    setAuditoria({
      criadoEm: periodoAtual.data.criadoEm,
      criadoPor: periodoAtual.data.criadoPor,
      criadoRf: periodoAtual.data.criadoRF,
      alteradoPor: periodoAtual.data.alteradoPor,
      alteradoEm: periodoAtual.data.alteradoEm,
      alteradoRf: periodoAtual.data.alteradoRF,
    });
    setPeriodoEscolarEdicao(periodoAtual.data);
    setValoresIniciais(bimestresValorInicial);
  };

  const onSubmit = async (dadosForm, voltar) => {
    if (periodoEscolarEdicao) {
      periodoEscolarEdicao.periodos.forEach(item => {
        switch (item.bimestre) {
          case 1:
            item.periodoInicio = dadosForm.primeiroBimestreDataInicial.toDate();
            item.periodoFim = dadosForm.primeiroBimestreDataFinal.toDate();
            break;
          case 2:
            item.periodoInicio = dadosForm.segundoBimestreDataInicial.toDate();
            item.periodoFim = dadosForm.segundoBimestreDataFinal.toDate();
            break;
          case 3:
            item.periodoInicio = dadosForm.terceiroBimestreDataInicial.toDate();
            item.periodoFim = dadosForm.terceiroBimestreDataFinal.toDate();
            break;
          case 4:
            item.periodoInicio = dadosForm.quartoBimestreDataInicial.toDate();
            item.periodoFim = dadosForm.quartoBimestreDataFinal.toDate();
            break;
          default:
            break;
        }
      });
      const editado = await api
        .post('v1/periodo-escolar', periodoEscolarEdicao)
        .catch(e => erros(e));
      if (editado?.status === 200) {
        setModoEdicao(false);
        consultarPeriodoPorId(periodoEscolarEdicao.tipoCalendario);
        sucesso('Suas informações foram editadas com sucesso.');
        if (voltar) history.push(URL_HOME);
      }
    } else {
      const calendarioParaCadastrar = listaTipoCalendario.find(item => {
        return String(item.id) === String(calendarioEscolarSelecionado);
      });
      const paramsCadastrar = {
        periodos: [
          {
            id: 0,
            bimestre: 1,
            periodoInicio: dadosForm.primeiroBimestreDataInicial.toDate(),
            periodoFim: dadosForm.primeiroBimestreDataFinal.toDate(),
          },
          {
            id: 0,
            bimestre: 2,
            periodoInicio: dadosForm.segundoBimestreDataInicial.toDate(),
            periodoFim: dadosForm.segundoBimestreDataFinal.toDate(),
          },
        ],
        tipoCalendario: calendarioParaCadastrar.id,
        anoBase: calendarioParaCadastrar.anoLetivo,
      };

      if (isTipoCalendarioAnual) {
        paramsCadastrar.periodos.push(
          {
            id: 0,
            bimestre: 3,
            periodoInicio: dadosForm.terceiroBimestreDataInicial.toDate(),
            periodoFim: dadosForm.terceiroBimestreDataFinal.toDate(),
          },
          {
            id: 0,
            bimestre: 4,
            periodoInicio: dadosForm.quartoBimestreDataInicial.toDate(),
            periodoFim: dadosForm.quartoBimestreDataFinal.toDate(),
          }
        );
      }
      const cadastrado = await api
        .post('v1/periodo-escolar', paramsCadastrar)
        .catch(e => erros(e));
      if (cadastrado?.status === 200) {
        setModoEdicao(false);
        consultarPeriodoPorId(calendarioParaCadastrar.id);
        sucesso('Suas informações foram salvas com sucesso.');
        if (voltar) history.push(URL_HOME);
      }
    }
  };

  const resetarTela = form => {
    form.resetForm();
    setModoEdicao(false);
  };

  const onClickCancelar = async form => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        resetarTela(form);
      }
    }
  };

  const touchedFields = form => {
    const arrayCampos = Object.keys(valoresFormInicial);
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

  const primeiroBimestre = form => {
    return (
      <div className="row">
        <div className="col-sm-4 col-md-4 col-lg-2 col-xl-2 mb-2">
          <Label text="Bimestre" control="bimestre" />
          <CaixaBimestre>
            <BoxTextoBimetre>1 ° Bimestre</BoxTextoBimetre>
          </CaixaBimestre>
        </div>
        <div className="col-sm-4 col-md-4 col-lg-3 col-xl-3">
          <CampoData
            form={form}
            placeholder="Início do Bimestre"
            formatoData="DD/MM/YYYY"
            label="Início do Bimestre"
            name="primeiroBimestreDataInicial"
            onChange={() => onChangeCamposData(form)}
            desabilitado={desabilitaCampos}
          />
        </div>
        <div className="col-sm-4 col-md-4 col-lg-3 col-xl-3">
          <CampoData
            form={form}
            placeholder="Início do Bimestre"
            formatoData="DD/MM/YYYY"
            label="Fim do Bimestre"
            name="primeiroBimestreDataFinal"
            onChange={() => onChangeCamposData(form)}
            desabilitado={desabilitaCampos}
          />
        </div>
      </div>
    );
  };

  const segundoBimestre = form => {
    return (
      <div className="row">
        <div className="col-sm-4 col-md-4 col-lg-2 col-xl-2 mb-2">
          <CaixaBimestre>
            <BoxTextoBimetre>2 ° Bimestre</BoxTextoBimetre>
          </CaixaBimestre>
        </div>
        <div className="col-sm-4 col-md-4 col-lg-3 col-xl-3">
          <CampoData
            form={form}
            placeholder="Início do Bimestre"
            formatoData="DD/MM/YYYY"
            name="segundoBimestreDataInicial"
            onChange={() => onChangeCamposData(form)}
            desabilitado={desabilitaCampos}
          />
        </div>
        <div className="col-sm-4 col-md-4 col-lg-3 col-xl-3">
          <CampoData
            form={form}
            placeholder="Início do Bimestre"
            formatoData="DD/MM/YYYY"
            name="segundoBimestreDataFinal"
            onChange={() => onChangeCamposData(form)}
            desabilitado={desabilitaCampos}
          />
        </div>
      </div>
    );
  };

  const terceiroBimestre = form => {
    return (
      <div className="row">
        <div className="col-sm-4 col-md-4 col-lg-2 col-xl-2 mb-2">
          <CaixaBimestre>
            <BoxTextoBimetre>3 ° Bimestre</BoxTextoBimetre>
          </CaixaBimestre>
        </div>
        <div className="col-sm-4 col-md-4 col-lg-3 col-xl-3">
          <CampoData
            form={form}
            placeholder="Início do Bimestre"
            formatoData="DD/MM/YYYY"
            name="terceiroBimestreDataInicial"
            onChange={() => onChangeCamposData(form)}
            desabilitado={desabilitaCampos}
          />
        </div>
        <div className="col-sm-4 col-md-4 col-lg-3 col-xl-3">
          <CampoData
            form={form}
            placeholder="Início do Bimestre"
            formatoData="DD/MM/YYYY"
            name="terceiroBimestreDataFinal"
            onChange={() => onChangeCamposData(form)}
            desabilitado={desabilitaCampos}
          />
        </div>
      </div>
    );
  };

  const quartoBimestre = form => {
    return (
      <div className="row">
        <div className="col-sm-4 col-md-4 col-lg-2 col-xl-2 mb-2">
          <CaixaBimestre>
            <BoxTextoBimetre>4 ° Bimestre</BoxTextoBimetre>
          </CaixaBimestre>
        </div>
        <div className="col-sm-4 col-md-4 col-lg-3 col-xl-3">
          <CampoData
            form={form}
            placeholder="Início do Bimestre"
            formatoData="DD/MM/YYYY"
            name="quartoBimestreDataInicial"
            onChange={() => onChangeCamposData(form)}
            desabilitado={desabilitaCampos}
          />
        </div>
        <div className="col-sm-4 col-md-4 col-lg-3 col-xl-3">
          <CampoData
            form={form}
            placeholder="Início do Bimestre"
            formatoData="DD/MM/YYYY"
            name="quartoBimestreDataFinal"
            onChange={() => onChangeCamposData(form)}
            desabilitado={desabilitaCampos}
          />
        </div>
      </div>
    );
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
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );

      if (confirmou) {
        validaAntesDoSubmit(form, true);
      } else {
        history.push(URL_HOME);
      }
    } else {
      history.push(URL_HOME);
    }
  };

  const selecionaTipoCalendario = (descricao, form, foiSelecionado = false) => {
    const tipo = listaTipoCalendario?.find(t => t.descricao === descricao);
    if (Number(tipo?.id) || !tipo?.id) {
      const isPeriodoAnual = tipo?.periodo === periodo?.Anual;
      setIsTipoCalendarioAnual(isPeriodoAnual);
      setValorTipoCalendario(descricao);
    }
    if (foiSelecionado) {
      resetarTela(form);
      setValoresIniciais({});
      consultarPeriodoPorId(tipo?.id);
    }
    setCalendarioEscolarSelecionado(tipo?.id);
  };

  const handleSearch = descricao => {
    if (descricao.length > 3 || descricao.length === 0) {
      setPesquisaTipoCalendario(descricao);
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      setCarregandoTipos(true);

      const {
        data,
      } = await ServicoCalendarios.obterTiposCalendarioAutoComplete(
        pesquisaTipoCalendario
      );

      if (isSubscribed) {
        setListaTipoCalendario(data);
        setCarregandoTipos(false);
      }
    })();
    setSomenteConsulta(verificaSomenteConsulta(permissoesTela));

    return () => {
      isSubscribed = false;
    };

  }, [pesquisaTipoCalendario]);

  return (
    <Formik
      enableReinitialize
      initialValues={valoresIniciais}
      validationSchema={validacoes}
      validateOnChange
      validateOnBlur
    >
      {form => (
        <>
          <Cabecalho pagina="Cadastro do período escolar">
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
                  onClick={() => onClickCancelar(form)}
                  disabled={!modoEdicao || desabilitaCampos}
                />
              </Col>
              <Col>
                <Button
                  id={SGP_BUTTON_ALTERAR_CADASTRAR}
                  label={labelBotaoCadastrar}
                  color={Colors.Roxo}
                  border
                  bold
                  onClick={() => validaAntesDoSubmit(form)}
                  disabled={
                    !calendarioEscolarSelecionado ||
                    desabilitaCampos ||
                    (auditoria?.criadoEm && !modoEdicao)
                  }
                />
              </Col>
            </Row>
          </Cabecalho>
          <Card>
            <Form className="col-md-12">
              <div className="row">
                <div className="col-sm-12 col-md-5 col-lg-4 col-xl-4 mb-4">
                  <Loader loading={carregandoTipos} tip="">
                    <SelectAutocomplete
                      showList
                      isHandleSearch
                      placeholder="Selecione um tipo de calendário"
                      className="col-md-12"
                      name="calEscolar"
                      id="calEscolar"
                      lista={listaTipoCalendario}
                      valueField="id"
                      textField="descricao"
                      onSelect={id => selecionaTipoCalendario(id, form, true)}
                      onChange={id => selecionaTipoCalendario(id, form)}
                      handleSearch={handleSearch}
                      value={valorTipoCalendario}
                      label="Calendário"
                      temErro={modoEdicao && !calendarioEscolarSelecionado}
                      mensagemErro="Campo obrigatório"
                      labelRequired
                    />
                  </Loader>
                </div>
              </div>
              {listaTipoCalendario &&
              listaTipoCalendario.length &&
              calendarioEscolarSelecionado ? (
                <>
                  {primeiroBimestre(form)}
                  {segundoBimestre(form)}

                  {isTipoCalendarioAnual ? (
                    <>
                      {terceiroBimestre(form)}
                      {quartoBimestre(form)}
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
            </Form>

            {valorTipoCalendario && auditoria?.criadoEm ? (
              <Auditoria
                criadoEm={auditoria.criadoEm}
                criadoPor={auditoria.criadoPor}
                criadoRf={auditoria.criadoRf}
                alteradoPor={auditoria.alteradoPor}
                alteradoEm={auditoria.alteradoEm}
                alteradoRf={auditoria.alteradoRf}
              />
            ) : (
              <></>
            )}
          </Card>
        </>
      )}
    </Formik>
  );
};

export default PeriodosEscolares;
