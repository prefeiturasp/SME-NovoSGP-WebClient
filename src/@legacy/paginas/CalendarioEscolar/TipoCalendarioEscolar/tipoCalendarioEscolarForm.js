import React, { useEffect, useState, useCallback } from 'react';
import { Form, Formik } from 'formik';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Col, Row } from 'antd';
import {
  Auditoria,
  Button,
  CampoTexto,
  Card,
  Colors,
  Loader,
  RadioGroupButton,
  SelectComponent,
} from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';

import { RotasDto } from '~/dtos';

import {
  AbrangenciaServico,
  api,
  confirmar,
  erro,
  erros,
  setBreadcrumbManual,
  sucesso,
  verificaSomenteConsulta,
} from '~/servicos';
import {
  SGP_BUTTON_ALTERAR_CADASTRAR,
  SGP_BUTTON_CANCELAR,
} from '~/constantes/ids/button';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ModalidadeTipoCalendarioEnum,
  ModalidadeTipoCalendarioEnumDisplay,
} from '@/core/enum/modalidade-tipo-calendario-enum';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';

const TipoCalendarioEscolarForm = () => {
  const usuario = useSelector(store => store.usuario);
  const navigate = useNavigate();
  const location = useLocation();
  const paramsRoute = useParams();

  const idTipoCalendario = paramsRoute?.id;

  const permissoesTela = usuario.permissoes[RotasDto.TIPO_CALENDARIO_ESCOLAR];

  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [desabilitarCampos, setDesabilitarCampos] = useState(false);
  const [auditoria, setAuditoria] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [novoRegistro, setNovoRegistro] = useState(true);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [semestre, setSemestre] = useState();
  const [carregandoSemestres, setCarregandoSemestres] = useState(false);
  const [semestreRequerido, setSemestreRequerido] = useState(undefined);
  const [destativarPeriodo, setDestativarPeriodo] = useState(false);

  const anoAtual = window.moment().format('YYYY');

  const [anoLetivo, setAnoLetivo] = useState(anoAtual);
  const [exibirAuditoria, setExibirAuditoria] = useState(false);
  const valoresIniciaisForm = {
    situacao: true,
    nome: '',
    modalidade: '',
    periodo: '',
    semestre: '',
  };
  const [valoresIniciais, setValoresIniciais] = useState(valoresIniciaisForm);
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [carregandoAnos, setCarregandoAnos] = useState(false);
  const [carregandoBotoesAcao, setCarregandoBotoesAcao] = useState(false);

  const [validacoes] = useState(
    Yup.object({
      nome: Yup.string()
        .required('Nome obrigatório')
        .max(50, 'Máximo 50 caracteres'),
      periodo: Yup.string().required('Período obrigatório'),
      modalidade: Yup.string().required('Modalidade obrigatória'),
      situacao: Yup.string().required('Situação obrigatória'),
    })
  );
  const opcoesPeriodo = [
    { label: 'Anual', value: 1 },
    { label: 'Semestral', value: 2 },
  ];

  const opcoesModalidade = [
    {
      label: ModalidadeTipoCalendarioEnumDisplay[1],
      value: ModalidadeTipoCalendarioEnum.FundamentalMedio,
    },
    {
      label: ModalidadeTipoCalendarioEnumDisplay[2],
      value: ModalidadeTipoCalendarioEnum.EJA,
    },
    {
      label: ModalidadeTipoCalendarioEnumDisplay[3],
      value: ModalidadeTipoCalendarioEnum.Infantil,
    },
    {
      label: ModalidadeTipoCalendarioEnumDisplay[4],
      value: ModalidadeTipoCalendarioEnum.CELP,
    },
  ];

  const opcoesSituacao = [
    { label: 'Ativo', value: true },
    { label: 'Inativo', value: false },
  ];

  useEffect(() => {
    const desabilitar = novoRegistro
      ? somenteConsulta || !permissoesTela.podeIncluir
      : somenteConsulta || !permissoesTela.podeAlterar;
    setDesabilitarCampos(desabilitar);
  }, [somenteConsulta, novoRegistro]);

  const verificarSeSemestreEhRequerido = valor => {
    if (valor === undefined) {
      return false;
    }
    const informarSemestre =
      Number(valor) === ModalidadeTipoCalendarioEnum.CELP ||
      Number(valor) === ModalidadeTipoCalendarioEnum.EJA;
    return informarSemestre;
  };

  const [possuiEventos, setPossuiEventos] = useState(false);

  const desabilitarBotaoExcluir =
    somenteConsulta ||
    !permissoesTela.podeExcluir ||
    novoRegistro ||
    possuiEventos;

  const consultaPorId = async id => {
    const tipoCalendadio = await api
      .get(`v1/calendarios/tipos/${id}`)
      .catch(e => erros(e));

    if (tipoCalendadio && tipoCalendadio.data) {
      setValoresIniciais({
        nome: tipoCalendadio.data.nome,
        periodo: tipoCalendadio.data.periodo,
        situacao: tipoCalendadio.data.situacao,
        modalidade: String(tipoCalendadio.data.modalidade),
        semestre: tipoCalendadio.data.semestre,
      });
      setSemestre(tipoCalendadio.data.semestre);
      setAnoLetivo(tipoCalendadio.data.anoLetivo);
      setAuditoria({
        criadoPor: tipoCalendadio.data.criadoPor,
        criadoRf:
          tipoCalendadio.data.criadoRF > 0 ? tipoCalendadio.data.criadoRF : '',
        criadoEm: tipoCalendadio.data.criadoEm,
        alteradoPor: tipoCalendadio.data.alteradoPor,
        alteradoRf:
          tipoCalendadio.data.alteradoRF > 0
            ? tipoCalendadio.data.alteradoRF
            : '',
        alteradoEm: tipoCalendadio.data.alteradoEm,
      });
      setNovoRegistro(false);
      setExibirAuditoria(true);
      setPossuiEventos(tipoCalendadio.data.possuiEventos);
    }
  };

  useEffect(() => {
    if (idTipoCalendario) {
      setBreadcrumbManual(
        location.pathname,
        'Alterar Tipo de Calendário Escolar',
        RotasDto.TIPO_CALENDARIO_ESCOLAR
      );
      consultaPorId(idTipoCalendario);
    } else if (usuario.turmaSelecionada && usuario.turmaSelecionada.anoLetivo) {
      setAnoLetivo(usuario.turmaSelecionada.anoLetivo);
    }
    setSomenteConsulta(verificaSomenteConsulta(permissoesTela));
  }, [idTipoCalendario, location]);

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

  const onClickCadastrar = async valoresForm => {
    const EjaOuCelp =
      Number(valoresForm.modalidade) === ModalidadeTipoCalendarioEnum.EJA ||
      Number(valoresForm.modalidade) === ModalidadeTipoCalendarioEnum.CELP;

    if (!valoresForm.semestre && EjaOuCelp) {
      erro('Informe o Semestre');
      return;
    }
    valoresForm.id = idTipoCalendario || 0;
    valoresForm.anoLetivo = anoLetivo;
    valoresForm.semestre = EjaOuCelp ? valoresForm.semestre : null;
    valoresForm.periodo = EjaOuCelp ? 2 : valoresForm.periodo;
    /*
    const metodo = idTipoCalendario ? 'put' : 'post';
    let url = 'v1/calendarios/tipos';
    if (idTipoCalendario) url += `/${idTipoCalendario}`;

    setCarregandoBotoesAcao(true);
    const cadastrado = await api[metodo](url, valoresForm).catch(e => erros(e));
    if (cadastrado) {
      sucesso('Suas informações foram salvas com sucesso.');
      navigate(RotasDto.TIPO_CALENDARIO_ESCOLAR);
    }
    setCarregandoBotoesAcao(false);
    */
  };

  const onChangeCampos = () => {
    if (!modoEdicao) {
      setModoEdicao(true);
    }
  };
  const changeModalidade = (valor, form) => {
    setSemestre(undefined);
    setListaSemestres([]);
    form.setFieldValue('semestre', undefined);
    setSemestreRequerido(false);
    form.setFieldValue('periodo', undefined);
    form.setFieldTouched('periodo', false, false);
    setDestativarPeriodo(false);
    obterSemestres(valor, form);
    onChangeCampos();
  };
  const onClickExcluir = async () => {
    if (!desabilitarBotaoExcluir) {
      const confirmado = await confirmar(
        'Excluir tipo de calendário escolar',
        '',
        'Deseja realmente excluir este calendário?',
        'Excluir',
        'Cancelar'
      );
      if (confirmado) {
        const parametrosDelete = { data: [idTipoCalendario] };
        const excluir = await api
          .delete('v1/calendarios/tipos', parametrosDelete)
          .catch(e => erros(e));
        if (excluir) {
          sucesso('Tipo de calendário excluído com sucesso.');
          navigate(RotasDto.TIPO_CALENDARIO_ESCOLAR);
        }
      }
    }
  };

  const validaAntesDoSubmit = form => {
    const arrayCampos = Object.keys(valoresIniciaisForm);
    arrayCampos.forEach(campo => {
      form.setFieldTouched(campo, true, true);
    });
    form.validateForm().then(() => {
      if (form.isValid || Object.keys(form.errors).length === 0) {
        form.handleSubmit(e => e);
      }
    });
    setCarregandoBotoesAcao(false);
  };

  const onClickVoltar = async form => {
    if (modoEdicao) {
      const confirmado = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );
      if (confirmado) {
        validaAntesDoSubmit(form);
      } else {
        navigate(RotasDto.TIPO_CALENDARIO_ESCOLAR);
      }
    } else {
      navigate(RotasDto.TIPO_CALENDARIO_ESCOLAR);
    }
  };

  const onChangeAnoLetivo = async valor => {
    setAnoLetivo(valor);
  };

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnos(true);

    const anosLetivo = await AbrangenciaServico.buscarTodosAnosLetivos().catch(
      e => {
        erros(e);
        setCarregandoAnos(false);
      }
    );

    const valorAnos = anosLetivo?.data.map(ano => ({ desc: ano, valor: ano }));
    const valor = valorAnos ? valorAnos[0]?.valor : [];

    setAnoLetivo(valor);
    setListaAnosLetivo(valorAnos);
    setCarregandoAnos(false);
  }, []);
  const onChangeSemestre = valor => {
    setSemestre(valor);
  };
  const obterSemestres = useCallback(
    async (valor, form) => {
      if (valor === undefined || Number(valor) === 0) return;
      const semestreEhRequerido = verificarSeSemestreEhRequerido(valor);
      setSemestreRequerido(semestreEhRequerido);
      if (!semestreEhRequerido) {
        form.setFieldValue('periodo', undefined);
        form.setFieldTouched('periodo', false, false);
        setDestativarPeriodo(false);
        return;
      }
      let modalidadeInformada = ModalidadeEnum.EJA;
      setCarregandoSemestres(true);
      if (Number(valor) === ModalidadeTipoCalendarioEnum.CELP) {
        modalidadeInformada = ModalidadeEnum.CELP;
      }
      form.setFieldValue('periodo', 2);
      form.setFieldTouched('periodo', true, true);
      setDestativarPeriodo(true);
      const retorno = await AbrangenciaServico.obterSemestres(
        false,
        anoLetivo,
        modalidadeInformada,
        '',
        ''
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoSemestres(false));

      if (retorno?.data?.length) {
        const lista = retorno.data.map(periodo => {
          return { desc: periodo, valor: periodo };
        });

        if (lista?.length === 1) {
          setSemestre(lista[0].valor);
        }
        setListaSemestres(lista);
      }
    },
    [anoLetivo]
  );

  useEffect(() => {
    obterAnosLetivos();
    verificarSeSemestreEhRequerido();
  }, [obterAnosLetivos]);

  return (
    <Loader loading={carregandoBotoesAcao} tooltip="">
      <Formik
        enableReinitialize
        initialValues={valoresIniciais}
        validationSchema={validacoes}
        onSubmit={valores => {
          console.log(valores);
          onClickCadastrar(valores);
        }}
        validateOnChange
        validateOnBlur
      >
        {form => (
          <>
            <Cabecalho
              pagina={`${
                idTipoCalendario > 0 ? 'Alterar' : 'Cadastro do'
              } Tipo de Calendário Escolar`}
            >
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
                    onClick={() => onClickCancelar(form)}
                    disabled={!modoEdicao}
                  />
                </Col>
                <Col>
                  <BotaoExcluirPadrao
                    disabled={desabilitarBotaoExcluir}
                    onClick={onClickExcluir}
                  />
                </Col>
                <Col>
                  <Button
                    id={SGP_BUTTON_ALTERAR_CADASTRAR}
                    label={idTipoCalendario > 0 ? 'Alterar' : 'Cadastrar'}
                    color={Colors.Roxo}
                    border
                    bold
                    disabled={idTipoCalendario && !modoEdicao}
                    onClick={() => validaAntesDoSubmit(form)}
                  />
                </Col>
              </Row>
            </Cabecalho>

            <Card>
              <Form className="col-md-12 mb-4">
                <div className="row">
                  <div className="col-sm-4 col-md-2 col-lg-2 col-xl-2 mb-2">
                    <Loader loading={carregandoAnos} tip="">
                      <SelectComponent
                        id="drop-ano-letivo-rel-pendencias"
                        label="Ano"
                        lista={listaAnosLetivo}
                        valueOption="valor"
                        valueText="desc"
                        disabled={
                          listaAnosLetivo && listaAnosLetivo.length === 1
                        }
                        onChange={onChangeAnoLetivo}
                        valueSelect={anoLetivo}
                        placeholder="Ano"
                        allowClear={false}
                        labelRequired
                      />
                    </Loader>
                  </div>

                  <div className="col-sm-12 col-md-10 col-lg-10 col-xl-7 mb-2">
                    <CampoTexto
                      form={form}
                      label="Nome do calendário"
                      placeholder="Nome do calendário"
                      name="nome"
                      onChange={onChangeCampos}
                      desabilitado={desabilitarCampos}
                      labelRequired
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-2">
                    <RadioGroupButton
                      label="Situação"
                      form={form}
                      opcoes={opcoesSituacao}
                      name="situacao"
                      valorInicial
                      onChange={onChangeCampos}
                      desabilitado={desabilitarCampos}
                      labelRequired
                    />
                  </div>
                  <div className="col-sm-4 col-md-2 col-lg-2 col-xl-2 mb-2">
                    <RadioGroupButton
                      label="Período"
                      form={form}
                      opcoes={opcoesPeriodo}
                      name="periodo"
                      onChange={onChangeCampos}
                      desabilitado={
                        desabilitarCampos || possuiEventos || destativarPeriodo
                      }
                      labelRequired
                    />
                  </div>
                  <div className="col-sm-4 col-md-2 col-lg-2 col-xl-2 mb-2">
                    <Loader loading={carregandoSemestres} ignorarTip>
                      <SelectComponent
                        lista={listaSemestres}
                        valueOption="valor"
                        valueText="desc"
                        label="Semestre"
                        name="semestre"
                        form={form}
                        valueSelect={semestre}
                        onChange={onChangeSemestre}
                        allowClear={true}
                        placeholder="Semestre"
                        labelRequired={semestreRequerido}
                        disabled={!semestreRequerido}
                      />
                    </Loader>
                  </div>
                  <div className="col-sm-12  col-md-12 col-lg-6 col-xl-5 mb-2">
                    <SelectComponent
                      id="modalidade"
                      name="modalidade"
                      lista={opcoesModalidade}
                      label="Modalidade"
                      valueOption="value"
                      valueText="label"
                      placeholder="Selecione uma modalidade"
                      form={form}
                      onChange={async valor => {
                        changeModalidade(valor, form);
                      }}
                      disabled={desabilitarCampos || possuiEventos}
                      labelRequired
                    />
                  </div>
                </div>
              </Form>
              {exibirAuditoria ? (
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
    </Loader>
  );
};

export default TipoCalendarioEscolarForm;
