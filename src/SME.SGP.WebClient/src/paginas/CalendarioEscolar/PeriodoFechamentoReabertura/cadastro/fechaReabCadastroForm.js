import { Col, Row } from 'antd';
import { Form, Formik } from 'formik';
import * as moment from 'moment';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import { CampoData, momentSchema } from '~/componentes';
import Auditoria from '~/componentes/auditoria';
import CampoTexto from '~/componentes/campoTexto';
import { OPCAO_TODOS } from '~/constantes';
import RotasDto from '~/dtos/rotasDto';
import { ServicoCalendarios, setBreadcrumbManual } from '~/servicos';
import { erros, sucesso } from '~/servicos/alertas';
import history from '~/servicos/history';
import ServicoFechamentoReabertura from '~/servicos/Paginas/Calendario/ServicoFechamentoReabertura';
import BimestreReabertura from './campos/bimestreReabertura';
import DreReabertura from './campos/dreReabertura';
import TipoCalendarioReabertura from './campos/tipoCalendarioReabertura';
import UeReabertura from './campos/ueReabertura';
import FechaReabCadastroContext from './fechaReabCadastroContext';

export const ContainerDataHoraUsuarioAprovador = styled.div`
  object-fit: contain;
  font-family: Roboto;
  font-size: 9px;
  font-weight: bold;
  color: #42474a;
  width: 100%;
  margin-top: 0.5rem !important;
`;

const FechaReabCadastroForm = () => {
  const {
    valoresIniciaisPadrao,
    setRefForm,
    refForm,
    auditoriaFechaReab,
    setAuditoriaFechaReab,
    executaResetarTela,
    setExecutaResetarTela,
    emEdicao,
    setEmEdicao,
    desabilitarCampos,
    setExibirLoaderReabertura,
    listaTipoCalendarioEscolar,
    setCalendarioSelecionado,
    calendarioSelecionado,
    listaBimestres,
    setCarregandoCalendarios,
    setListaTipoCalendarioEscolar,
  } = useContext(FechaReabCadastroContext);

  const paramsRota = useParams();
  const paramsLocation = useLocation();

  setBreadcrumbManual(
    paramsLocation?.pathname,
    'Períodos',
    RotasDto.PERIODO_FECHAMENTO_REABERTURA
  );

  const usuarioStore = useSelector(store => store.usuario);

  let { anoLetivo } = usuarioStore.turmaSelecionada;

  if (!anoLetivo) {
    anoLetivo = new Date().getFullYear();
  }

  const [validacoes, setValidacoes] = useState({});
  const [dataHoraUsuarioAprovador, setDataHoraUsuarioAprovador] = useState();

  const [valoresIniciais, setValoresIniciais] = useState(
    paramsRota?.id
      ? null
      : {
          ...valoresIniciaisPadrao,
          tipoCalendarioId: paramsRota?.tipoCalendarioId,
        }
  );

  const onChangeCampos = () => {
    if (!desabilitarCampos && !emEdicao) {
      setEmEdicao(true);
    }
  };

  const resetarTela = () => {
    const initialValues = { ...refForm.initialValues };
    refForm.resetForm({});
    refForm.resetForm(initialValues);
    setEmEdicao(false);
    if (paramsRota?.tipoCalendarioId) {
      const calAtual = listaTipoCalendarioEscolar.find(
        item => item.id === Number(paramsRota?.tipoCalendarioId)
      );
      if (calAtual) {
        setCalendarioSelecionado(calAtual);
      }
    } else if (!paramsRota?.id) {
      setCalendarioSelecionado();
    }
  };

  useEffect(() => {
    if (executaResetarTela) {
      resetarTela();
      setExecutaResetarTela(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [executaResetarTela]);

  const obterBimestresConsultaPorId = dados => {
    const bimestres = [];
    dados.forEach((temBimestre, index) => {
      if (temBimestre) {
        bimestres.push(index + 1);
      }
    });

    return bimestres;
  };

  const setarValoresIniciaisConsultaPorId = dados => {
    const valoresAtuais = {
      tipoCalendarioId: String(dados.tipoCalendarioId),
      dreCodigo: dados.dreCodigo ? dados.dreCodigo : OPCAO_TODOS,
      ueCodigo: dados.ueCodigo ? dados.ueCodigo : OPCAO_TODOS,
      dataInicio: moment(dados.dataInicio),
      dataFim: moment(dados.dataFim),
      descricao: dados.descricao,
      bimestres: dados.bimestres.map(item => String(item)),
    };

    setValoresIniciais(valoresAtuais);
  };

  const montarDataHoraUsuarioAprovador = dados => {
    const dataFormatada = dados?.aprovadoEm
      ? `${moment?.(dados?.aprovadoEm)?.format('DD/MM/YYYY')}  às ${moment?.(
          dados?.aprovadoEm
        )?.format('HH:mm')}`
      : '';

    if (dataFormatada && dados.aprovadoPor) {
      setDataHoraUsuarioAprovador(
        `Aprovado por ${dados.aprovadoPor} em ${dataFormatada}`
      );
    } else {
      setDataHoraUsuarioAprovador('');
    }
  };

  const setarAuditorioConsultaPorId = dados => {
    const auditoriaAtual = {
      criadoPor: dados.criadoPor,
      criadoRf: dados.criadoRf,
      criadoEm: dados.criadoEm,
      alteradoPor: dados.alteradoPor,
      alteradoRf: dados.alteradoRf,
      alteradoEm: dados.alteradoEm,
    };

    setAuditoriaFechaReab(auditoriaAtual);
  };

  const consultaPorId = useCallback(async () => {
    setExibirLoaderReabertura(true);

    const retorno = await ServicoFechamentoReabertura.obterPorId(paramsRota?.id)
      .catch(e => erros(e))
      .finally(() => setExibirLoaderReabertura(false));

    if (retorno?.data?.id) {
      const bimestres = obterBimestresConsultaPorId(retorno.data.bimestres);
      retorno.data.bimestres = [...bimestres];

      const calendarioAtual = listaTipoCalendarioEscolar.find(
        item => item.id === retorno.data.tipoCalendarioId
      );
      if (calendarioAtual) {
        setCalendarioSelecionado(calendarioAtual);
      }

      montarDataHoraUsuarioAprovador(retorno.data);
      setarValoresIniciaisConsultaPorId(retorno.data);
      setarAuditorioConsultaPorId(retorno.data);
    } else {
      resetarTela();
    }
  }, [paramsRota, listaTipoCalendarioEscolar]);

  useEffect(() => {
    if (paramsRota?.id && listaTipoCalendarioEscolar?.length) {
      consultaPorId();
    }
  }, [paramsRota, listaTipoCalendarioEscolar, consultaPorId]);

  const textCampoObrigatorio = 'Campo obrigatório';

  const montaValidacoes = () => {
    const val = {
      descricao: Yup.string().required(textCampoObrigatorio),
      dataInicio: momentSchema
        .required(textCampoObrigatorio)
        .test(
          'validaInicio',
          'Data inicial maior que final',
          function validar() {
            const { dataInicio, dataFim } = this.parent;
            if (dataInicio && dataFim && dataInicio.isAfter(dataFim, 'date'))
              return false;
            return true;
          }
        ),
      dataFim: momentSchema.required(textCampoObrigatorio),
      bimestres: Yup.array().of(Yup.string()).required(textCampoObrigatorio),
      dreCodigo: Yup.string().required(textCampoObrigatorio),
      ueCodigo: Yup.string().required(textCampoObrigatorio),
    };
    setValidacoes(Yup.object(val));
  };

  useEffect(() => {
    montaValidacoes();
  }, []);

  const obterBimestresSalvar = valoresForm => {
    const todosBimestres = valoresForm.bimestres.find(
      item => item === OPCAO_TODOS
    );

    if (todosBimestres && listaBimestres?.length) {
      return listaBimestres
        ?.filter(bim => bim?.valor !== OPCAO_TODOS)
        ?.map(b => b?.valor);
    }

    return valoresForm.bimestres;
  };

  const onClickCadastrar = async valoresForm => {
    const bimestres = obterBimestresSalvar(valoresForm);

    const { descricao, dreCodigo, dataFim, dataInicio, ueCodigo } = valoresForm;

    const prametrosParaSalvar = {
      bimestres,
      descricao,
      ueCodigo: ueCodigo === OPCAO_TODOS ? '' : ueCodigo,
      dreCodigo: dreCodigo === OPCAO_TODOS ? '' : dreCodigo,
      fim: dataFim,
      inicio: dataInicio,
      tipoCalendarioId: calendarioSelecionado?.id,
      id: paramsRota?.id,
    };

    setExibirLoaderReabertura(true);
    const retorno = await ServicoFechamentoReabertura.salvar(
      prametrosParaSalvar
    )
      .catch(e => {
        erros(e);
      })
      .finally(() => {
        setExibirLoaderReabertura(false);
      });

    if (retorno?.status === 200) {
      sucesso(retorno.data);
      history.push(RotasDto.PERIODO_FECHAMENTO_REABERTURA);
    }
  };

  const onChangeDre = form => {
    form.setFieldValue('ueCodigo', undefined);
    onChangeCampos();
  };

  const obterTiposCalendarios = useCallback(async descricao => {
    setCarregandoCalendarios(true);

    const resposta = await ServicoCalendarios.obterTiposCalendarioAutoComplete(
      descricao
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoCalendarios(false));

    if (resposta?.data) {
      setListaTipoCalendarioEscolar(resposta.data);
    } else {
      setListaTipoCalendarioEscolar([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    obterTiposCalendarios();
  }, [obterTiposCalendarios]);

  return (
    <>
      {valoresIniciais ? (
        <>
          <Formik
            ref={f => setRefForm(f)}
            enableReinitialize
            initialValues={valoresIniciais}
            validationSchema={validacoes}
            onSubmit={valores => onClickCadastrar(valores)}
            validateOnChange
            validateOnBlur
          >
            {form => (
              <Form>
                <Col span={24}>
                  <Row gutter={[16, 16]}>
                    <Col sm={24} md={12} xl={8}>
                      <TipoCalendarioReabertura
                        form={form}
                        onChangeCampos={() => {
                          onChangeCampos();
                        }}
                        obterTiposCalendarios={obterTiposCalendarios}
                      />
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col md={24} xl={12}>
                      <DreReabertura
                        form={form}
                        onChangeCampos={() => {
                          onChangeDre(form);
                        }}
                      />
                    </Col>
                    <Col md={24} xl={12}>
                      <UeReabertura
                        form={form}
                        onChangeCampos={() => {
                          onChangeCampos();
                        }}
                      />
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <CampoTexto
                        label="Descrição"
                        name="descricao"
                        id="descricao"
                        type="textarea"
                        form={form}
                        onChange={onChangeCampos}
                        desabilitado={desabilitarCampos}
                        labelRequired
                      />
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col sm={24} md={12} lg={6}>
                      <CampoData
                        label="Início"
                        form={form}
                        name="dataInicio"
                        placeholder="DD/MM/AAAA"
                        formatoData="DD/MM/YYYY"
                        onChange={onChangeCampos}
                        desabilitado={desabilitarCampos}
                        labelRequired
                      />
                    </Col>
                    <Col sm={24} md={12} lg={6}>
                      <CampoData
                        label="Fim"
                        form={form}
                        name="dataFim"
                        placeholder="DD/MM/AAAA"
                        formatoData="DD/MM/YYYY"
                        onChange={onChangeCampos}
                        desabilitado={desabilitarCampos}
                        labelRequired
                      />
                    </Col>
                    <Col sm={24} md={12} lg={12}>
                      <BimestreReabertura
                        form={form}
                        onChangeCampos={() => {
                          onChangeCampos();
                        }}
                      />
                    </Col>
                  </Row>
                  {auditoriaFechaReab?.criadoEm ? (
                    <Auditoria
                      className="ant-col ant-col-24"
                      criadoEm={auditoriaFechaReab.criadoEm}
                      criadoPor={auditoriaFechaReab.criadoPor}
                      criadoRf={auditoriaFechaReab.criadoRf}
                      alteradoPor={auditoriaFechaReab.alteradoPor}
                      alteradoEm={auditoriaFechaReab.alteradoEm}
                      alteradoRf={auditoriaFechaReab.alteradoRf}
                    />
                  ) : (
                    <></>
                  )}
                  {dataHoraUsuarioAprovador ? (
                    <ContainerDataHoraUsuarioAprovador className="ant-col ant-col-24">
                      {dataHoraUsuarioAprovador}
                    </ContainerDataHoraUsuarioAprovador>
                  ) : (
                    <></>
                  )}
                </Col>
              </Form>
            )}
          </Formik>
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default FechaReabCadastroForm;
