import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Col, Row } from 'antd';
import { useRouteMatch } from 'react-router-dom';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Auditoria from '~/componentes/auditoria';
import Button from '~/componentes/button';
import { CampoData, momentSchema } from '~/componentes/campoData/campoData';
import CampoTexto from '~/componentes/campoTexto';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import RadioGroupButton from '~/componentes/radioGroupButton';
import SelectComponent from '~/componentes/select';
import { confirmar, erros, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';
import { setBreadcrumbManual } from '~/servicos/breadcrumb-services';
import history from '~/servicos/history';
import tipoFeriado from '~/dtos/tipoFeriado';
import { store } from '~/redux';
import RotasDto from '~/dtos/rotasDto';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import {
  SGP_BUTTON_ALTERAR_CADASTRAR,
  SGP_BUTTON_CANCELAR,
} from '~/constantes/ids/button';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';

const TipoFeriadoForm = () => {
  const [auditoria, setAuditoria] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [novoRegistro, setNovoRegistro] = useState(true);
  const [exibirAuditoria, setExibirAuditoria] = useState(false);
  const [idTipoFeriadoEdicao, setIdTipoFeriadoEdicao] = useState(0);
  const [isTipoMovel, setIsTipoMovel] = useState(false);

  const routeMatch = useRouteMatch();
  const { usuario } = store.getState();
  const permissoesTela = usuario.permissoes[RotasDto.TIPO_FERIADO];

  const valoresIniciaisForm = {
    nome: '',
    abrangencia: undefined,
    tipo: 1,
    dataFeriado: '',
    situacao: true,
  };
  const [valoresIniciais, setValoresIniciais] = useState(valoresIniciaisForm);

  const listaDropdownAbrangencia = [
    { id: 1, nome: 'Nacional' },
    { id: 2, nome: 'Estadual' },
    { id: 3, nome: 'Municipal' },
  ];

  const [validacoes] = useState(
    Yup.object({
      nome: Yup.string()
        .required('Nome obrigatório')
        .max(50, 'Máximo 50 caracteres'),
      abrangencia: Yup.string().required('Abrangência obrigatória'),
      tipo: Yup.string().required('Tipo obrigatória'),
      dataFeriado: momentSchema.required('Data obrigatória'),
      situacao: Yup.string().required('Situação obrigatória'),
    })
  );

  const opcoesTipo = [
    { label: 'Fixo', value: 1 },
    { label: 'Móvel', value: 2 },
  ];

  const opcoesSituacao = [
    { label: 'Ativo', value: true },
    { label: 'Inativo', value: false },
  ];

  const [possuiEventos, setPossuiEventos] = useState(false);

  const temPermissao = novoRegistro
    ? permissoesTela.podeIncluir
    : permissoesTela.podeAlterar;

  const botaoAlterarCadastrarEstaDesabilitado =
    !temPermissao || (!novoRegistro && !modoEdicao);

  useEffect(() => {
    verificaSomenteConsulta(permissoesTela);

    const consultaPorId = async () => {
      if (routeMatch?.params?.id) {
        setBreadcrumbManual(
          routeMatch.url,
          'Alterar Tipo de Feriado',
          RotasDto.TIPO_FERIADO
        );
        setIdTipoFeriadoEdicao(routeMatch.params.id);

        const cadastrado = await api
          .get(`v1/calendarios/feriados/${routeMatch.params.id}`)
          .catch(e => erros(e));

        if (cadastrado && cadastrado.data) {
          setIsTipoMovel(Number(cadastrado.data.tipo) === tipoFeriado.Movel);
          setValoresIniciais({
            abrangencia: String(cadastrado.data.abrangencia),
            nome: cadastrado.data.nome,
            tipo: cadastrado.data.tipo,
            dataFeriado: window.moment(cadastrado.data.dataFeriado),
            situacao: cadastrado.data.ativo,
          });
          setAuditoria({
            criadoPor: cadastrado.data.criadoPor,
            criadoRf: cadastrado.data.criadoRF,
            criadoEm: cadastrado.data.criadoEm,
            alteradoPor: cadastrado.data.alteradoPor,
            alteradoRf: cadastrado.data.alteradoRF,
            alteradoEm: cadastrado.data.alteradoEm,
          });
          setExibirAuditoria(true);
          setPossuiEventos(cadastrado.data.possuiEventos);
        }
        setNovoRegistro(false);
      }
    };

    consultaPorId();

  }, []);

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
    if (novoRegistro && !permissoesTela.podeIncluir) return;
    if (!novoRegistro && !permissoesTela.podeAlterar) return;

    let paramas = valoresForm;
    if (isTipoMovel) {
      paramas = valoresIniciais;
    }
    if (novoRegistro) {
      paramas.tipo = tipoFeriado.Fixo;
    }
    paramas.ativo = valoresForm.situacao;
    paramas.id = idTipoFeriadoEdicao;

    const cadastrado = await api
      .post('v1/calendarios/feriados', paramas)
      .catch(e => erros(e));

    if (cadastrado?.status === 200) {
      if (idTipoFeriadoEdicao) {
        sucesso('Tipo de feriado alterado com sucesso.');
      } else {
        sucesso('Novo tipo de feriado criado com sucesso.');
      }
      history.push(RotasDto.TIPO_FERIADO);
    }
  };

  const onChangeCampos = () => {
    if (!modoEdicao) {
      setModoEdicao(true);
    }
  };

  const onClickExcluir = async () => {
    if (!permissoesTela.podeExcluir) return;

    if (!novoRegistro) {
      const confirmado = await confirmar(
        'Excluir tipo de feriado',
        '',
        'Deseja realmente excluir este feriado?',
        'Excluir',
        'Cancelar'
      );
      if (confirmado) {
        const parametrosDelete = { data: [idTipoFeriadoEdicao] };
        const excluir = await api
          .delete('v1/calendarios/feriados', parametrosDelete)
          .catch(e => erros(e));

        if (excluir?.status === 200) {
          sucesso('Tipo de feriado excluído com sucesso.');
          history.push(RotasDto.TIPO_FERIADO);
        }
      }
    }
  };

  const tipoCampoDataFeriado = form => {
    let formato = 'DD/MM/YYYY';
    if (Number(form.values.tipo) === tipoFeriado.Fixo) {
      formato = 'DD/MM';
    }
    return (
      <CampoData
        form={form}
        label="Data do feriado"
        placeholder="Data do feriado"
        formatoData={formato}
        name="dataFeriado"
        onChange={onChangeCampos}
        desabilitado={
          isTipoMovel ||
          (novoRegistro && !permissoesTela.podeIncluir) ||
          (!novoRegistro && !permissoesTela.podeAlterar) ||
          possuiEventos
        }
        labelRequired
      />
    );
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
        history.push(RotasDto.TIPO_FERIADO);
      }
    } else {
      history.push(RotasDto.TIPO_FERIADO);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={valoresIniciais}
        validationSchema={validacoes}
        onSubmit={valores => onClickCadastrar(valores)}
        validateOnChange
        validateOnBlur
      >
        {form => (
          <>
            <Cabecalho
              pagina={`${
                idTipoFeriadoEdicao > 0 ? 'Alterar' : 'Cadastro de'
              } Tipo de Feriado`}
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
                    disabled={
                      novoRegistro ||
                      !permissoesTela.podeExcluir ||
                      possuiEventos
                    }
                    onClick={onClickExcluir}
                  />
                </Col>
                <Col>
                  <Button
                    id={SGP_BUTTON_ALTERAR_CADASTRAR}
                    label={`${
                      idTipoFeriadoEdicao > 0 ? 'Alterar' : 'Cadastrar'
                    }`}
                    color={Colors.Roxo}
                    border
                    bold
                    disabled={botaoAlterarCadastrarEstaDesabilitado}
                    onClick={() => validaAntesDoSubmit(form)}
                  />
                </Col>
              </Row>
            </Cabecalho>
            <Card>
              <Form className="col-md-12 mb-4">
                <div className="row">
                  <div className="col-sm-12 col-md-8 col-lg-8 col-xl-8 mb-2">
                    <CampoTexto
                      form={form}
                      label="Nome do feriado"
                      placeholder="Meu novo feriado"
                      name="nome"
                      onChange={onChangeCampos}
                      desabilitado={
                        isTipoMovel ||
                        (novoRegistro && !permissoesTela.podeIncluir) ||
                        (!novoRegistro && !permissoesTela.podeAlterar) ||
                        possuiEventos
                      }
                      labelRequired
                    />
                  </div>

                  <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                    <SelectComponent
                      form={form}
                      label="Abrangência"
                      name="abrangencia"
                      lista={listaDropdownAbrangencia}
                      valueOption="id"
                      valueText="nome"
                      onChange={onChangeCampos}
                      placeholder="Abrangência do feriado"
                      disabled={
                        isTipoMovel ||
                        (novoRegistro && !permissoesTela.podeIncluir) ||
                        (!novoRegistro && !permissoesTela.podeAlterar) ||
                        possuiEventos
                      }
                      labelRequired
                    />
                  </div>

                  <div className="col-sm-12 col-md-4 col-lg-3 col-xl-2 mb-2">
                    <RadioGroupButton
                      label="Tipo"
                      form={form}
                      opcoes={opcoesTipo}
                      name="tipo"
                      desabilitado
                      labelRequired
                    />
                  </div>

                  <div className="col-sm-12 col-md-4 col-lg-4 col-xl-3">
                    {tipoCampoDataFeriado(form)}
                  </div>

                  <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2">
                    <RadioGroupButton
                      label="Situação"
                      form={form}
                      opcoes={opcoesSituacao}
                      name="situacao"
                      valorInicial
                      desabilitado={
                        (novoRegistro && !permissoesTela.podeIncluir) ||
                        (!novoRegistro && !permissoesTela.podeAlterar)
                      }
                      onChange={onChangeCampos}
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
    </>
  );
};

export default TipoFeriadoForm;
