import { Col, Radio, Row } from 'antd';
import { Form, Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import { Auditoria, Label } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import Button from '~/componentes/button';
import CampoTexto from '~/componentes/campoTexto';
import Card from '~/componentes/card';
import { Base, Colors } from '~/componentes/colors';
import Grid from '~/componentes/grid';
import SelectComponent from '~/componentes/select';
import {
  SGP_BUTTON_ALTERAR_CADASTRAR,
  SGP_BUTTON_CANCELAR,
} from '~/constantes/ids/button';
import { setBreadcrumbManual } from '~/servicos';
import servicoEvento from '~/servicos/Paginas/Calendario/ServicoTipoEvento';
import { confirmar, erro, erros, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';

const TipoEventosForm = () => {
  const botaoCadastrarRef = useRef();
  const campoDescricaoRef = useRef();

  const navigate = useNavigate();
  const paramsRoute = useParams();
  const location = useLocation();

  const idTipoEvento = paramsRoute?.id;

  const [valoresIniciais, setValoresIniciais] = useState({});
  const [dadosTipoEvento, setDadosTipoEvento] = useState({
    descricao: '',
    letivo: undefined,
    localOcorrencia: undefined,
    concomitancia: true,
    tipoData: 1,
    dependencia: true,
    ativo: true,
  });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [inseridoAlterado, setInseridoAlterado] = useState({});

  const listaLetivo = [
    { valor: 1, descricao: 'Sim' },
    { valor: 2, descricao: 'Não' },
    { valor: 3, descricao: 'Opcional' },
  ];

  const listaLocalOcorrencia = [
    { valor: 1, descricao: 'UE' },
    { valor: 2, descricao: 'DRE' },
    { valor: 3, descricao: 'SME' },
    { valor: 4, descricao: 'SME/UE' },
    { valor: 5, descricao: 'Todos' },
  ];

  const Div = styled.div`
    .ant-radio-checked .ant-radio-inner {
      border-color: ${Base.Roxo};
    }
    .ant-radio-inner::after {
      background-color: ${Base.Roxo};
    }
  `;

  const [possuiEventos, setPossuiEventos] = useState(false);

  useEffect(() => {
    if (idTipoEvento) {
      api.get(`v1/calendarios/eventos/tipos/${idTipoEvento}`).then(resposta => {
        if (resposta?.data) {
          const data = {
            descricao: resposta.data.descricao,
            letivo: resposta.data.letivo.toString(),
            localOcorrencia: resposta.data.localOcorrencia.toString(),
            concomitancia: resposta.data.concomitancia,
            tipoData: resposta.data.tipoData,
            dependencia: resposta.data.dependencia,
            ativo: resposta.data.ativo,
          };
          setDadosTipoEvento(data);
          setInseridoAlterado({ ...resposta.data });
          setPossuiEventos(resposta.data.possuiEventos);
          setValoresIniciais({ ...data });
        }
      });
    }
  }, [idTipoEvento]);

  useEffect(() => {
    if (idTipoEvento) {
      setBreadcrumbManual(
        location.pathname,
        'Alteração de Tipo de Eventos',
        `${ROUTES.TIPO_EVENTOS}`
      );
    }
  }, [idTipoEvento, location]);

  const onChangeCampos = () => {
    if (!modoEdicao) {
      setModoEdicao(true);
    }
  };

  const resetarTela = form => {
    if (idTipoEvento) {
      form.resetForm();
      setDadosTipoEvento({ ...valoresIniciais });
    } else {
      form.resetForm();
      setDadosTipoEvento({
        descricao: '',
        letivo: undefined,
        localOcorrencia: undefined,
        concomitancia: true,
        tipoData: 1,
        dependencia: true,
        ativo: true,
      });
    }
    setModoEdicao(false);
  };

  const clicouBotaoCancelar = async form => {
    const confirmou = await confirmar(
      'Atenção',
      'Você não salvou as informações preenchidas.',
      'Deseja realmente cancelar as alterações?'
    );
    if (confirmou) {
      resetarTela(form);
    }
  };

  const clicouBotaoExcluir = async () => {
    if (idTipoEvento) {
      const confirmado = await confirmar(
        'Excluir tipo de calendário escolar',
        '',
        'Deseja realmente excluir este calendário?',
        'Excluir',
        'Cancelar'
      );
      if (confirmado) {
        const parametrosDelete = { data: [idTipoEvento] };
        const excluir = await api
          .delete('v1/calendarios/eventos/tipos', parametrosDelete)
          .catch(e => erros(e));
        if (excluir) {
          sucesso('Tipos de evento deletados com sucesso!');
          navigate(ROUTES.TIPO_EVENTOS);
        }
      }
    }
  };

  const [validacoes] = useState(
    Yup.object({
      descricao: Yup.string().required('Digite o nome do tipo de evento'),
      localOcorrencia: Yup.string().required(
        'Selecione um local de ocorrência'
      ),
      letivo: Yup.string().required('Selecione um letivo'),
    })
  );

  const clicouBotaoCadastrar = form => {
    form.validateForm().then(() => form.handleSubmit());
  };

  const clicouBotaoVoltar = async form => {
    if (modoEdicao) {
      const confirmado = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );
      if (confirmado) {
        clicouBotaoCadastrar(form);
      } else {
        navigate(ROUTES.TIPO_EVENTOS);
      }
    } else {
      navigate(ROUTES.TIPO_EVENTOS);
    }
  };

  const cadastrarTipoEvento = async dados => {
    servicoEvento
      .salvar(idTipoEvento, dados)
      .then(() => {
        sucesso(
          `Tipo de evento ${
            modoEdicao ? 'atualizado' : 'cadastrado'
          } com sucesso!`
        );
        navigate(ROUTES.TIPO_EVENTOS);
      })
      .catch(() => {
        erro(
          `Erro ao ${modoEdicao ? 'atualizar' : 'cadastrar'} o tipo de evento!`
        );
      });
  };

  const aoDigitarDescricao = e => {
    campoDescricaoRef.current.value = e.target.value;
    onChangeCampos();
  };

  const aoSelecionarLocalOcorrencia = local => {
    onChangeCampos();
    setDadosTipoEvento({
      ...dadosTipoEvento,
      localOcorrencia: local,
      descricao: campoDescricaoRef.current.value,
    });
  };

  const aoSelecionarLetivo = letivo => {
    onChangeCampos();
    setDadosTipoEvento({
      ...dadosTipoEvento,
      letivo,
      descricao: campoDescricaoRef.current.value,
    });
  };

  const aoSelecionarConcomitancia = concomitancia => {
    onChangeCampos();
    setDadosTipoEvento({
      ...dadosTipoEvento,
      concomitancia: concomitancia.target.value,
      descricao: campoDescricaoRef.current.value,
    });
  };

  const aoSelecionarTipoData = tipoData => {
    onChangeCampos();
    setDadosTipoEvento({
      ...dadosTipoEvento,
      tipoData: tipoData.target.value,
      descricao: campoDescricaoRef.current.value,
    });
  };

  const aoSelecionarDependencia = dependencia => {
    onChangeCampos();
    setDadosTipoEvento({
      ...dadosTipoEvento,
      dependencia: dependencia.target.value,
      descricao: campoDescricaoRef.current.value,
    });
  };

  const aoSelecionarSituacao = situacao => {
    onChangeCampos();
    setDadosTipoEvento({
      ...dadosTipoEvento,
      ativo: situacao.target.value,
      descricao: campoDescricaoRef.current.value,
    });
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        descricao: dadosTipoEvento.descricao,
        letivo: dadosTipoEvento.letivo,
        localOcorrencia: dadosTipoEvento.localOcorrencia,
        concomitancia: dadosTipoEvento.concomitancia,
        tipoData: dadosTipoEvento.tipoData,
        dependencia: dadosTipoEvento.dependencia,
        ativo: dadosTipoEvento.ativo,
      }}
      onSubmit={dados => cadastrarTipoEvento(dados)}
      validationSchema={validacoes}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {form => (
        <>
          <Cabecalho
            pagina={`${
              idTipoEvento ? 'Alteração' : 'Cadastro'
            } de Tipo de Eventos`}
          >
            <Row gutter={[8, 8]} type="flex">
              <Col>
                <BotaoVoltarPadrao onClick={() => clicouBotaoVoltar(form)} />
              </Col>
              <Col>
                <Button
                  id={SGP_BUTTON_CANCELAR}
                  label="Cancelar"
                  color={Colors.Roxo}
                  onClick={() => clicouBotaoCancelar(form)}
                  border
                  bold
                  disabled={!modoEdicao}
                />
              </Col>
              <Col>
                <BotaoExcluirPadrao
                  disabled={possuiEventos || !idTipoEvento}
                  onClick={clicouBotaoExcluir}
                />
              </Col>
              <Col>
                <Button
                  id={SGP_BUTTON_ALTERAR_CADASTRAR}
                  label={idTipoEvento ? 'Alterar' : 'Cadastrar'}
                  color={Colors.Roxo}
                  onClick={e => clicouBotaoCadastrar(form, e)}
                  border
                  bold
                  ref={botaoCadastrarRef}
                  disabled={idTipoEvento && !modoEdicao}
                />
              </Col>
            </Row>
          </Cabecalho>

          <Card>
            <Grid cols={12}>
              <Form>
                <Div className="row mb-4">
                  <Div className="col-6">
                    <CampoTexto
                      form={form}
                      ref={campoDescricaoRef}
                      name="descricao"
                      id="descricao"
                      maxlength={100}
                      placeholder="Nome do evento"
                      type="input"
                      onChange={aoDigitarDescricao}
                      desabilitado={possuiEventos}
                      icon
                      label="Nome do tipo de evento"
                      labelRequired
                    />
                  </Div>
                  <Div className="col-4">
                    <SelectComponent
                      form={form}
                      name="localOcorrencia"
                      id="localOcorrencia"
                      placeholder="Local de ocorrência"
                      valueOption="valor"
                      valueText="descricao"
                      lista={listaLocalOcorrencia}
                      onChange={aoSelecionarLocalOcorrencia}
                      disabled={possuiEventos}
                      label="Local de ocorrência"
                      labelRequired
                    />
                  </Div>
                  <Div className="col-2">
                    <SelectComponent
                      form={form}
                      name="letivo"
                      id="letivo"
                      placeholder="Tipo"
                      valueOption="valor"
                      valueText="descricao"
                      lista={listaLetivo}
                      onChange={aoSelecionarLetivo}
                      disabled={possuiEventos}
                      label="Letivo"
                      labelRequired
                    />
                  </Div>
                </Div>
                <Div className="row">
                  <Div className="col-3">
                    <Label isRequired text="Permite concomitância" />
                  </Div>
                  <Div className="col-3">
                    <Label isRequired text="Tipo de data" />
                  </Div>
                  <Div className="col-3">
                    <Label isRequired text="Dependência" />
                  </Div>
                  <Div className="col-3">
                    <Label isRequired text="Situação" />
                  </Div>
                </Div>
                <Div className="row">
                  <Div className="col-3">
                    <Radio.Group
                      form={form}
                      value={dadosTipoEvento.concomitancia}
                      onChange={aoSelecionarConcomitancia}
                      disabled={possuiEventos}
                    >
                      <Div className="form-check form-check-inline">
                        <Radio value>Sim</Radio>
                      </Div>
                      <Div className="form-check form-check-inline">
                        <Radio value={false}>Não</Radio>
                      </Div>
                    </Radio.Group>
                  </Div>
                  <Div className="col-3">
                    <Radio.Group
                      form={form}
                      value={dadosTipoEvento.tipoData}
                      onChange={aoSelecionarTipoData}
                      disabled={possuiEventos}
                    >
                      <Div className="form-check form-check-inline">
                        <Radio value={1}>Única</Radio>
                      </Div>
                      <Div className="form-check form-check-inline">
                        <Radio value={2}>Início e fim</Radio>
                      </Div>
                    </Radio.Group>
                  </Div>
                  <Div className="col-3">
                    <Radio.Group
                      form={form}
                      value={dadosTipoEvento.dependencia}
                      onChange={aoSelecionarDependencia}
                      disabled={possuiEventos}
                    >
                      <Div className="form-check form-check-inline">
                        <Radio value>Sim</Radio>
                      </Div>
                      <Div className="form-check form-check-inline">
                        <Radio value={false}>Não</Radio>
                      </Div>
                    </Radio.Group>
                  </Div>
                  <Div className="col-3">
                    <Radio.Group
                      form={form}
                      value={dadosTipoEvento.ativo}
                      onChange={aoSelecionarSituacao}
                    >
                      <Div className="form-check form-check-inline">
                        <Radio value>Ativo</Radio>
                      </Div>
                      <Div className="form-check form-check-inline">
                        <Radio value={false}>Inativo</Radio>
                      </Div>
                    </Radio.Group>
                  </Div>
                </Div>
              </Form>
            </Grid>
            <Auditoria
              {...inseridoAlterado}
              criadoRf={inseridoAlterado?.criadoRF}
              alteradoRf={inseridoAlterado?.alteradoRF}
            />
          </Card>
        </>
      )}
    </Formik>
  );
};

export default TipoEventosForm;
