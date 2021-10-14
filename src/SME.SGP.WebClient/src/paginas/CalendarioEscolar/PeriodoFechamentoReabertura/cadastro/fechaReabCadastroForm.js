import { Col, Row } from 'antd';
import { Form, Formik } from 'formik';
import * as moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { CampoData, Loader, momentSchema } from '~/componentes';
import { DreDropDown, UeDropDown } from '~/componentes-sgp';
import Auditoria from '~/componentes/auditoria';
import CampoTexto from '~/componentes/campoTexto';
import SelectComponent from '~/componentes/select';
import SelectAutocomplete from '~/componentes/select-autocomplete';
import modalidadeTipoCalendario from '~/dtos/modalidadeTipoCalendario';
import RotasDto from '~/dtos/rotasDto';
import { confirmar, erros, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';
import history from '~/servicos/history';
import ServicoCalendarios from '~/servicos/Paginas/Calendario/ServicoCalendarios';
import ServicoFechamentoReabertura from '~/servicos/Paginas/Calendario/ServicoFechamentoReabertura';
import FechaReabCadastroContext from './fechaReabCadastroContext';

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
    setExibirLoaderSalvar,
  } = useContext(FechaReabCadastroContext);

  const paramsRota = useParams();

  const novoRegistro = !paramsRota?.id;

  const usuarioStore = useSelector(store => store.usuario);

  const [listaTipoCalendarioEscolar, setListaTipoCalendarioEscolar] = useState(
    []
  );
  const [listaBimestres, setListaBimestres] = useState([]);
  const [desabilitarTipoCalendario, setDesabilitarTipoCalendario] = useState(
    false
  );
  let { anoLetivo } = usuarioStore.turmaSelecionada;

  if (!anoLetivo) {
    anoLetivo = new Date().getFullYear();
  }
  const [carregandoTipos, setCarregandoTipos] = useState(false);
  const [idFechamentoReabertura, setIdFechamentoReabertura] = useState(0);
  const [validacoes, setValidacoes] = useState({});

  const [valoresIniciais, setValoresIniciais] = useState(
    paramsRota?.id
      ? null
      : {
          ...valoresIniciaisPadrao,
          tipoCalendarioId: paramsRota?.tipoCalendarioId,
        }
  );

  // const [salvandoInformacoes, setSalvandoInformacoes] = useState(false);
  const [modalidadeTurma, setModalidadeTurma] = useState('');
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [valorTipoCalendario, setValorTipoCalendario] = useState('');
  const [pesquisaTipoCalendario, setPesquisaTipoCalendario] = useState('');
  const [urlDres, setUrlDres] = useState('');
  const [
    filtroInicialTipoCalendario,
    setfiltroInicialTipoCalendario,
  ] = useState(true);
  const montarListaBimestres = tipoModalidade => {
    const listaNova = [
      {
        valor: 1,
        descricao: 'Primeiro Bimestre',
      },
      {
        valor: 2,
        descricao: 'Segundo Bimestre',
      },
    ];

    if (tipoModalidade != modalidadeTipoCalendario.EJA) {
      listaNova.push(
        {
          valor: 3,
          descricao: 'Terceiro Bimestre',
        },
        {
          valor: 4,
          descricao: 'Quarto Bimestre',
        }
      );
    }

    listaNova.push({
      valor: 5,
      descricao: 'Todos',
    });
    setListaBimestres(listaNova);
  };

  const onChangeCampos = () => {
    if (!desabilitarCampos && !emEdicao) {
      setEmEdicao(true);
    }
  };

  useEffect(() => {
    async function consultaTipos() {
      setCarregandoTipos(true);
      if (filtroInicialTipoCalendario && paramsRota?.tipoCalendarioId?.trim()) {
        const tipoCalendario = await api.get(
          `v1/calendarios/tipos/${paramsRota.tipoCalendarioId}`
        );
        setPesquisaTipoCalendario(tipoCalendario?.data?.descricaoPeriodo);
        setfiltroInicialTipoCalendario(false);
        setValorTipoCalendario(
          `${tipoCalendario?.data?.anoLetivo} - ${tipoCalendario?.data?.nome}`
        );
        montarListaBimestres(tipoCalendario?.data?.modalidade);
      } else if (filtroInicialTipoCalendario)
        setfiltroInicialTipoCalendario(false);
      const listaTipo = await ServicoCalendarios.obterTiposCalendarioAutoComplete(
        pesquisaTipoCalendario
      );
      if (listaTipo && listaTipo.data && listaTipo.data.length) {
        setListaTipoCalendarioEscolar(listaTipo.data);
        if (listaTipo.data.length === 1) {
          setValorTipoCalendario(listaTipo.data[0].descricao);
          if (!paramsRota?.id) {
            const valores = {
              tipoCalendarioId: String(listaTipo.data[0].id),
              dreId: undefined,
              ueId: undefined,
              dataInicio: '',
              dataFim: '',
              descricao: '',
              bimestres: [],
            };
            setValoresIniciais(valores);
            // setNovoRegistro(true);
          }
          montarListaBimestres(listaTipo.data[0].modalidade);
        } else {
          const valores = {
            tipoCalendarioId: paramsRota?.tipoCalendarioId,
            dreId: undefined,
            ueId: undefined,
            dataInicio: '',
            dataFim: '',
            descricao: '',
            bimestres: [],
          };
          setValoresIniciais(valores);
          setDesabilitarTipoCalendario(false);
        }
      } else {
        setListaTipoCalendarioEscolar([]);
      }
      setCarregandoTipos(false);
    }
    consultaTipos();
  }, [paramsRota, pesquisaTipoCalendario]);

  useEffect(() => {
    const consultaPorId = async () => {
      if (paramsRota?.id && listaTipoCalendarioEscolar.length) {
        const cadastrado = await ServicoFechamentoReabertura.obterPorId(
          paramsRota?.id
        ).catch(e => erros(e));
        setIdFechamentoReabertura(paramsRota?.id);

        if (cadastrado && cadastrado.data) {
          const bimestres = [];
          for (var i = 0; i < cadastrado.data.bimestres.length; i++) {
            const bimestre = cadastrado.data.bimestres[i];
            if (bimestre) bimestres.push(i + 1);
          }
          cadastrado.data.bimestres = [...bimestres];
          const calendario = listaTipoCalendarioEscolar.find(
            item => item.id == cadastrado.data.tipoCalendarioId
          );
          if (calendario) {
            setValorTipoCalendario(calendario.descricao);
            montarListaBimestres(calendario.modalidade);
          }
          setValoresIniciais({
            tipoCalendarioId: String(cadastrado.data.tipoCalendarioId),
            dreId: cadastrado.data.dreCodigo || undefined,
            ueId: cadastrado.data.ueCodigo || undefined,
            dataInicio: moment(cadastrado.data.dataInicio),
            dataFim: moment(cadastrado.data.dataFim),
            descricao: cadastrado.data.descricao,
            bimestres: cadastrado.data.bimestres.map(item => String(item)),
          });

          setAuditoriaFechaReab({
            criadoPor: cadastrado.data.criadoPor,
            criadoRf: cadastrado.data.criadoRf,
            criadoEm: cadastrado.data.criadoEm,
            alteradoPor: cadastrado.data.alteradoPor,
            alteradoRf: cadastrado.data.alteradoRf,
            alteradoEm: cadastrado.data.alteradoEm,
          });
        }
      }
    };

    consultaPorId();
  }, [paramsRota, listaTipoCalendarioEscolar]);

  useEffect(() => {
    const montaValidacoes = () => {
      const val = {
        tipoCalendarioId: Yup.string().required('Calendário obrigatório'),
        descricao: Yup.string().required('Descrição obrigatória'),
        dataInicio: momentSchema.required('Data obrigatória'),
        dataFim: momentSchema.required('Data obrigatória'),
        bimestres: Yup.string().required('Bimestre obrigatório'),
      };

      if (!usuarioStore.possuiPerfilSme) {
        val.dreId = Yup.string().required('DRE obrigatória');
      }

      if (!usuarioStore.possuiPerfilSmeOuDre) {
        val.ueId = Yup.string().required('UE obrigatória');
      }

      setValidacoes(Yup.object(val));
    };

    montaValidacoes();
  }, [usuarioStore.possuiPerfilSme, usuarioStore.possuiPerfilSmeOuDre]);

  const resetarTela = () => {
    const initialValues = { ...refForm.initialValues };
    refForm.resetForm({});
    refForm.resetForm(initialValues);
    setEmEdicao(false);
    setValorTipoCalendario('');
    setListaBimestres([]);
  };

  useEffect(() => {
    if (executaResetarTela) {
      resetarTela();
      setExecutaResetarTela(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [executaResetarTela]);

  const obterBimestresSalvar = valoresForm => {
    const todosBimestres = valoresForm.bimestres.find(item => item == '5');
    if (todosBimestres) {
      const calendarioSelecionado = listaTipoCalendarioEscolar.find(
        item => item.id == valoresForm.tipoCalendarioId
      );
      if (
        calendarioSelecionado &&
        calendarioSelecionado.modalidade &&
        calendarioSelecionado.modalidade == modalidadeTipoCalendario.EJA
      ) {
        return ['1', '2'];
      }
      return ['1', '2', '3', '4'];
    }

    return valoresForm.bimestres;
  };
  const onClickCadastrar = async valoresForm => {
    const bimestres = obterBimestresSalvar(valoresForm);
    const {
      descricao,
      dreId,
      dataFim,
      dataInicio,
      tipoCalendarioId,
      ueId,
    } = valoresForm;
    const prametrosParaSalvar = {
      bimestres,
      descricao,
      dreCodigo: dreId,
      fim: dataFim,
      inicio: dataInicio,
      tipoCalendarioId,
      ueCodigo: ueId,
      id: idFechamentoReabertura,
    };
    setExibirLoaderSalvar(true);
    const cadastrado = await ServicoFechamentoReabertura.salvar(
      idFechamentoReabertura,
      prametrosParaSalvar
    )
      .catch(async e => {
        if (e && e.response && e.response.status == 602) {
          const mensagens =
            e && e.response && e.response.data && e.response.data.mensagens;
          if (mensagens) {
            const alteracaoConfirmacao = await confirmar(
              'Atenção',
              '',
              mensagens[0]
            );
            if (alteracaoConfirmacao) {
              const cadastradoAlteracao = await ServicoFechamentoReabertura.salvar(
                idFechamentoReabertura,
                prametrosParaSalvar,
                true
              );
              if (cadastradoAlteracao && cadastradoAlteracao.status == 200) {
                sucesso(cadastradoAlteracao.data);
                history.push(RotasDto.PERIODO_FECHAMENTO_REABERTURA);
              }
            }
          }
        } else {
          erros(e);
        }
      })
      .finally(() => {
        setExibirLoaderSalvar(false);
      });
    if (cadastrado && cadastrado.status == 200) {
      sucesso(cadastrado.data);
      history.push(RotasDto.PERIODO_FECHAMENTO_REABERTURA);
    }
  };

  const onChangeTipoCalendario = (valor, form) => {
    const tipo = listaTipoCalendarioEscolar?.find(t => t.descricao === valor);
    if (Number(tipo?.id) || !tipo?.id) {
      setValorTipoCalendario(valor);
      if (listaDres && listaDres.length > 1) form.setFieldValue('dreId', '');
      if (listaUes && listaUes.length > 1) form.setFieldValue('ueId', '');
      const modalidadeConsulta = ServicoCalendarios.converterModalidade(
        tipo?.modalidade
      );
      setUrlDres(
        tipo
          ? `/v1/abrangencias/false/dres?modalidade=${modalidadeConsulta}`
          : ''
      );
      montarListaBimestres(tipo?.modalidade);
    }
    form.setFieldValue('tipoCalendarioId', tipo?.id);
  };

  const handleSearch = descricao => {
    if (descricao.length > 3 || descricao.length === 0) {
      setPesquisaTipoCalendario(descricao);
    }
  };

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
                      <Loader loading={carregandoTipos} tip="">
                        <div style={{ maxWidth: '300px' }}>
                          <SelectAutocomplete
                            label="Calendário"
                            showList
                            isHandleSearch
                            className="col-md-12"
                            name="tipoCalendarioId"
                            id="tipoCalendarioId"
                            lista={listaTipoCalendarioEscolar}
                            valueField="id"
                            textField="descricao"
                            disabled={
                              !novoRegistro || desabilitarTipoCalendario
                            }
                            placeholder="Selecione um tipo de calendário"
                            onChange={valor =>
                              onChangeTipoCalendario(valor, form)
                            }
                            onSelect={valor =>
                              onChangeTipoCalendario(valor, form)
                            }
                            handleSearch={handleSearch}
                            value={valorTipoCalendario}
                          />
                        </div>
                      </Loader>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col md={24} xl={12}>
                      <DreDropDown
                        url={urlDres}
                        name="dreId"
                        label="Diretoria Regional de Educação (DRE)"
                        form={form}
                        desabilitado={desabilitarCampos || !novoRegistro}
                        onChange={(valor, dres) => {
                          setListaDres(dres);
                          if (novoRegistro) {
                            onChangeCampos();
                          }
                          const tipoSelecionado = listaTipoCalendarioEscolar.find(
                            item => item.id == form.values.tipoCalendarioId
                          );
                          if (tipoSelecionado && tipoSelecionado.modalidade) {
                            const modalidadeT = ServicoCalendarios.converterModalidade(
                              tipoSelecionado.modalidade
                            );
                            setModalidadeTurma(modalidadeT);
                          } else {
                            setModalidadeTurma('');
                          }
                        }}
                      />
                    </Col>
                    <Col md={24} xl={12}>
                      <UeDropDown
                        name="ueId"
                        dreId={form.values.dreId}
                        label="Unidade Escolar (UE)"
                        form={form}
                        url=""
                        desabilitado={desabilitarCampos || !novoRegistro}
                        onChange={(valor, ues) => {
                          setListaUes(ues);
                          if (novoRegistro) {
                            onChangeCampos();
                          }
                        }}
                        modalidade={modalidadeTurma}
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
                        desabilitado={desabilitarCampos || !novoRegistro}
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
                      />
                    </Col>
                    <Col sm={24} md={12} lg={12}>
                      <SelectComponent
                        form={form}
                        label="Bimestre"
                        name="bimestres"
                        id="bimestres"
                        lista={listaBimestres}
                        onChange={valor => {
                          if (valor.includes('5')) {
                            form.setFieldValue('bimestres', ['5']);
                            onChangeCampos();
                          }
                        }}
                        valueOption="valor"
                        valueText="descricao"
                        placeholder="Selecione bimestre(s)"
                        multiple
                        disabled={desabilitarCampos || !novoRegistro}
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
