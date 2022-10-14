import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Col, Radio, Row } from 'antd';
import Card from '~/componentes/card';
import Grid from '~/componentes/grid';
import Button from '~/componentes/button';
import { Colors, Base } from '~/componentes/colors';
import history from '~/servicos/history';
import SelectComponent from '~/componentes/select';
import api from '~/servicos/api';
import CampoTexto from '~/componentes/campoTexto';
import { sucesso, erro, confirmar, erros } from '~/servicos/alertas';
import servicoEvento from '~/servicos/Paginas/Calendario/ServicoTipoEvento';
import { Cabecalho } from '~/componentes-sgp';
import {
  SGP_BUTTON_ALTERAR_CADASTRAR,
  SGP_BUTTON_CANCELAR,
} from '~/componentes-sgp/filtro/idsCampos';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import { Label } from '~/componentes';

const TipoEventosForm = ({ match }) => {
  const botaoCadastrarRef = useRef();
  const campoDescricaoRef = useRef();

  const [idTipoEvento, setIdTipoEvento] = useState('');
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
  const [inseridoAlterado, setInseridoAlterado] = useState({
    alteradoEm: '',
    alteradoPor: '',
    criadoEm: '',
    criadoPor: '',
  });

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

  const InseridoAlterado = styled(Div)`
    color: ${Base.CinzaMako};
    font-size: 10px;
    font-weight: bold;
    p {
      margin: 0;
    }
  `;

  useEffect(() => {
    if (match && match.params && match.params.id) {
      setIdTipoEvento(match.params.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [possuiEventos, setPossuiEventos] = useState(false);

  useEffect(() => {
    if (idTipoEvento) {
      api.get(`v1/calendarios/eventos/tipos/${idTipoEvento}`).then(resposta => {
        if (resposta && resposta.data) {
          setDadosTipoEvento({
            descricao: resposta.data.descricao,
            letivo: resposta.data.letivo.toString(),
            localOcorrencia: resposta.data.localOcorrencia.toString(),
            concomitancia: resposta.data.concomitancia,
            tipoData: resposta.data.tipoData,
            dependencia: resposta.data.dependencia,
            ativo: resposta.data.ativo,
          });
          setInseridoAlterado({
            alteradoEm: resposta.data.alteradoEm,
            alteradoPor: `${resposta.data.alteradoPor} (${resposta.data.alteradoRF})`,
            criadoEm: resposta.data.alteradoEm,
            criadoPor: `${resposta.data.criadoPor} (${resposta.data.criadoRF})`,
          });
          setModoEdicao(true);
          setPossuiEventos(resposta.data.possuiEventos);
        }
      });
    }
  }, [idTipoEvento]);

  const onChangeCampos = () => {
    if (!modoEdicao) {
      setModoEdicao(true);
    }
  };

  const clicouBotaoVoltar = () => {
    history.push('/calendario-escolar/tipo-eventos');
  };

  const clicouBotaoCancelar = () => {
    setDadosTipoEvento({
      descricao: '',
      letivo: undefined,
      localOcorrencia: undefined,
      concomitancia: true,
      tipoData: 1,
      dependencia: true,
      ativo: true,
    });
    setModoEdicao(false);
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
          history.push('/calendario-escolar/tipo-eventos');
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

  const clicouBotaoCadastrar = (form, e) => {
    e.persist();
    form.validateForm().then(() => form.handleSubmit(e));
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
        history.push('/calendario-escolar/tipo-eventos');
      })
      .catch(() => {
        erro(
          `Erro ao ${modoEdicao ? 'atualizar' : 'cadastrar'} o tipo de evento!`
        );
      });
  };

  const aoDigitarDescricao = e => {
    campoDescricaoRef.current.value = e.target.value;
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
                <BotaoVoltarPadrao onClick={() => clicouBotaoVoltar()} />
              </Col>
              <Col>
                <Button
                  id={SGP_BUTTON_CANCELAR}
                  label="Cancelar"
                  color={Colors.Roxo}
                  onClick={clicouBotaoCancelar}
                  border
                  bold
                  disabled={idTipoEvento || !modoEdicao}
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
                  disabled={!modoEdicao}
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
            <Grid cols={12}>
              <InseridoAlterado className="mt-4">
                {inseridoAlterado.criadoPor && inseridoAlterado.criadoEm ? (
                  <p className="pt-2">
                    INSERIDO por {inseridoAlterado.criadoPor} em
                    {inseridoAlterado.criadoEm}
                  </p>
                ) : (
                  ''
                )}

                {inseridoAlterado.alteradoPor && inseridoAlterado.alteradoEm ? (
                  <p>
                    ALTERADO por {inseridoAlterado.alteradoPor} em{' '}
                    {inseridoAlterado.alteradoEm}
                  </p>
                ) : (
                  ''
                )}
              </InseridoAlterado>
            </Grid>
          </Card>
        </>
      )}
    </Formik>
  );
};

export default TipoEventosForm;
