import { Col, Row } from 'antd';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import * as Yup from 'yup';
import {
  Auditoria,
  Base,
  Button,
  CampoData,
  CampoTexto,
  Card,
  Colors,
  DataTable,
  Label,
  ModalConteudoHtml,
  momentSchema,
  SelectComponent,
} from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_ALTERAR_CADASTRAR,
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_IMPRIMIR,
} from '~/constantes/ids/button';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import { RotasDto } from '~/dtos';
import {
  ServicoOcorrencias,
  history,
  erros,
  setBreadcrumbManual,
  sucesso,
  confirmar,
  erro,
  verificaSomenteConsulta,
} from '~/servicos';
import { ordenarPor } from '~/utils/funcoes/gerais';

// eslint-disable-next-line react/prop-types
const CadastroOcorrencias = ({ match }) => {
  const [dataOcorrencia, setDataOcorrencia] = useState();
  const [horaOcorrencia, setHoraOcorrencia] = useState();
  const [refForm, setRefForm] = useState({});
  const [listaTiposOcorrencias, setListaTiposOcorrencias] = useState();
  const [modalCriancasVisivel, setModalCriancasVisivel] = useState(false);
  const [listaCriancas, setListaCriancas] = useState([]);
  const [criancasSelecionadas, setCriancasSelecionadas] = useState([]);
  const [criancasSelecionadasEdicao, setCriancasSelecionadasEdicao] = useState(
    []
  );
  const [
    codigosCriancasSelecionadas,
    setCodigosCriancasSelecionadas,
  ] = useState([]);
  const [valoresIniciais, setValoresIniciais] = useState({
    dataOcorrencia: window.moment(),
    descricao: '',
    ocorrenciaTipoId: '',
    titulo: '',
    alunos: [],
  });
  const [auditoria, setAuditoria] = useState();
  const [idOcorrencia, setIdOcorrencia] = useState();
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);

  const usuario = useSelector(state => state.usuario);
  const { turmaSelecionada, permissoes } = usuario;
  const { podeExcluir, podeAlterar, podeIncluir } = permissoes[
    RotasDto.OCORRENCIAS
  ];

  useEffect(() => {
    setSomenteConsulta(
      verificaSomenteConsulta(permissoes[RotasDto.OCORRENCIAS])
    );
  }, [permissoes]);

  useEffect(() => {
    ServicoOcorrencias.buscarTiposOcorrencias().then(resp => {
      if (resp?.data) {
        setListaTiposOcorrencias(resp.data);
      }
    });
    ServicoOcorrencias.buscarCriancas(turmaSelecionada?.id).then(resp => {
      if (resp?.data) {
        setListaCriancas(resp.data);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (match?.params?.id) {
      setIdOcorrencia(match?.params?.id);
    }
  }, [match]);

  useEffect(() => {
    async function obterPorId(id) {
      setBreadcrumbManual(
        match?.url,
        'Alterar ocorrência',
        RotasDto.OCORRENCIAS
      );
      const ocorrencia = await ServicoOcorrencias.buscarOcorrencia(id);
      if (ocorrencia && Object.entries(ocorrencia).length) {
        ocorrencia.data.dataOcorrencia = window.moment(
          new Date(ocorrencia.data.dataOcorrencia)
        );
        const data = new Date(ocorrencia.data.dataOcorrencia);
        const horaMin = ocorrencia.data.horaOcorrencia.split(':');
        data.setHours(ocorrencia.data.horaOcorrencia ? horaMin[0] : '00');
        data.setMinutes(ocorrencia.data.horaOcorrencia ? horaMin[1] : '00');
        ocorrencia.data.horaOcorrencia = window.moment(new Date(data));
        setValoresIniciais({
          ...ocorrencia.data,
          descricao: ocorrencia.data.descricao,
        });
        refForm.setFieldValue(
          'ocorrenciaTipoId',
          ocorrencia.data.ocorrenciaTipoId
        );
        const criancas = ocorrencia.data.alunos.map(crianca => {
          return {
            nome: crianca.nome,
            codigoEOL: crianca.codigoAluno.toString(),
          };
        });
        setAuditoria(ocorrencia.data.auditoria);
        setCriancasSelecionadas(criancas);
        setCriancasSelecionadasEdicao(criancas);
      }
    }
    if (idOcorrencia) {
      obterPorId(idOcorrencia);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idOcorrencia]);

  const validacoes = Yup.object({
    dataOcorrencia: momentSchema.required('Campo obrigatório'),
    ocorrenciaTipoId: Yup.string().required('Campo obrigatório'),
    titulo: Yup.string()
      .required('Campo obrigatório')
      .min(10, 'O título deve ter pelo menos 10 caracteres'),
    descricao: Yup.string().required('Campo obrigatório'),
  });

  const validaAntesDoSubmit = form => {
    const arrayCampos = Object.keys(valoresIniciais);
    arrayCampos.forEach(campo => {
      form.setFieldTouched(campo, true, true);
    });
    form.validateForm().then(() => {
      if (form.isValid || Object.keys(form.errors).length === 0) {
        form.submitForm(form);
      }
    });
  };

  const onSubmitFormulario = valores => {
    valores.turmaId = turmaSelecionada.id;
    valores.horaOcorrencia = valores.horaOcorrencia
      ? valores.horaOcorrencia.format('HH:mm').toString()
      : null;
    valores.codigosAlunos = criancasSelecionadas.map(a => {
      return a.codigoEOL;
    });
    if (match?.params?.id) {
      valores.id = match?.params?.id;
      ServicoOcorrencias.alterar(valores)
        .then(() => {
          sucesso('Ocorrência alterada com sucesso');
          history.push(RotasDto.OCORRENCIAS);
        })
        .catch(e => erros(e));
    } else {
      ServicoOcorrencias.incluir(valores)
        .then(() => {
          sucesso('Ocorrência salva com sucesso');
          history.push(RotasDto.OCORRENCIAS);
        })
        .catch(e => erros(e));
    }
  };

  const onClickExcluir = async () => {
    const confirmado = await confirmar(
      'Atenção',
      'Você tem certeza que deseja excluir este registro?'
    );
    if (confirmado) {
      const parametros = { data: [match?.params?.id] };
      const exclusao = await ServicoOcorrencias.excluir(parametros);
      if (exclusao && exclusao.status === 200) {
        sucesso('Registro excluído com sucesso');
        history.push(RotasDto.OCORRENCIAS);
      } else {
        erro(exclusao);
      }
    }
  };

  const confirmarAntesDeVoltar = async form => {
    const confirmado = await confirmar(
      'Atenção',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
    if (confirmado) {
      validaAntesDoSubmit(form);
    } else {
      history.push(RotasDto.OCORRENCIAS);
    }
  };

  const modificouCriancasSelecionadas = () => {
    let modificou = false;
    if (idOcorrencia) {
      valoresIniciais.alunos.forEach(aluno => {
        const alunoExistente = criancasSelecionadas?.find?.(
          c => c?.codigoEOL?.toString?.() === aluno?.codigoAluno?.toString?.()
        );
        if (!alunoExistente) {
          modificou = true;
        }
      });
    }
    if (criancasSelecionadas.length !== valoresIniciais.alunos.length) {
      modificou = true;
    } else {
      modificou = false;
    }
    return modificou;
  };

  useEffect(() => {
    if (criancasSelecionadas) setModoEdicao(modificouCriancasSelecionadas());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criancasSelecionadas]);

  const onClickVoltar = async form => {
    let existeDivergencia = modificouCriancasSelecionadas();
    if (existeDivergencia) {
      confirmarAntesDeVoltar(form);
    }
    if (form.values) {
      const campos = Object.keys(form.values);
      campos.forEach(key => {
        if (valoresIniciais[key] !== form.values[key]) {
          existeDivergencia = true;
          confirmarAntesDeVoltar(form);
        }
      });
    }
    if (!existeDivergencia) history.push(RotasDto.OCORRENCIAS);
  };

  const onClickEditarCriancas = () => {
    setModalCriancasVisivel(true);
    setCodigosCriancasSelecionadas(
      criancasSelecionadas?.length
        ? criancasSelecionadas.map(c => {
            return c.codigoEOL;
          })
        : []
    );
  };

  const onClickCancelar = async () => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );

      if (confirmou) {
        refForm.resetForm();
        setCriancasSelecionadas(criancasSelecionadasEdicao);
        if (!idOcorrencia) {
          setCriancasSelecionadas([]);
        }
        setModoEdicao(false);
      }
    }
  };

  const onChangeDataOcorrencia = valor => {
    setDataOcorrencia(valor);
    setModoEdicao(true);
  };

  const onChangeHoraOcorrencia = valor => {
    setHoraOcorrencia(valor);
    setModoEdicao(true);
  };

  const desabilitarData = current => {
    if (current) {
      return (
        current < window.moment().startOf('year') || current >= window.moment()
      );
    }
    return false;
  };

  const colunas = [
    {
      title: 'Criança',
      dataIndex: 'nome',
      width: '100%',
      render: (text, row) => (
        <span>
          {row.nome} ({row.codigoEOL})
        </span>
      ),
    },
  ];

  const onSelectLinhaAluno = codigos => {
    setCodigosCriancasSelecionadas(codigos);
  };

  const onConfirmarModal = async () => {
    const criancas = [];
    codigosCriancasSelecionadas.forEach(codigo => {
      const crianca = listaCriancas.find(c => c.codigoEOL === codigo);
      criancas.push(crianca);
    });
    const criancasOrdenadas = await ordenarPor(criancas, 'nome');
    setCriancasSelecionadas([...criancasOrdenadas]);
    setModalCriancasVisivel(false);
  };

  const ehTurmaAnoAnterior = () => {
    return (
      turmaSelecionada?.anoLetivo.toString() !== window.moment().format('YYYY')
    );
  };

  const getNomeTurma = () => {
    return turmaSelecionada?.desc.split('-')[1].trim();
  };

  const naoPodeIncluirOuAlterar = () => {
    return idOcorrencia ? !podeAlterar : !podeIncluir;
  };

  const desabilitarCampos = () => {
    return (
      !criancasSelecionadas?.length > 0 ||
      ehTurmaAnoAnterior() ||
      somenteConsulta ||
      naoPodeIncluirOuAlterar()
    );
  };

  const onClickGerar = async () => {
    const params = {
      dreCodigo: turmaSelecionada?.dre,
      ueCodigo: turmaSelecionada?.unidadeEscolar,
      turmaId: turmaSelecionada?.id,
      OcorrenciasIds: [idOcorrencia],
    };
    const retorno = await ServicoOcorrencias.gerar(params).catch(e => erros(e));

    if (retorno?.status === 200) {
      sucesso(
        'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
      );
    }
  };

  return (
    <>
      <ModalConteudoHtml
        titulo={`Selecione a(s) criança(s) envolvida(s) nesta ocorrência - ${getNomeTurma()}`}
        visivel={modalCriancasVisivel}
        onClose={() => {
          setModalCriancasVisivel(false);
        }}
        onConfirmacaoSecundaria={() => {
          setModalCriancasVisivel(false);
        }}
        onConfirmacaoPrincipal={() => {
          onConfirmarModal();
        }}
        labelBotaoPrincipal="Confirmar"
        labelBotaoSecundario="Cancelar"
        closable
        width="50%"
        fecharAoClicarFora
        fecharAoClicarEsc
        desabilitarBotaoPrincipal={
          ehTurmaAnoAnterior() || somenteConsulta || naoPodeIncluirOuAlterar()
        }
      >
        <div className="col-md-12 pt-2">
          <DataTable
            id="lista-criancas"
            idLinha="codigoEOL"
            selectedRowKeys={codigosCriancasSelecionadas}
            onSelectRow={codigo =>
              ehTurmaAnoAnterior() || somenteConsulta
                ? {}
                : onSelectLinhaAluno(codigo)
            }
            onClickRow={() => {}}
            columns={colunas}
            dataSource={listaCriancas}
            selectMultipleRows
            pagination={false}
            scroll={{ y: 500 }}
          />
        </div>
      </ModalConteudoHtml>
      <Formik
        enableReinitialize
        initialValues={valoresIniciais}
        validationSchema={validacoes}
        onSubmit={valores => onSubmitFormulario(valores)}
        validateOnBlur
        validateOnChange
        ref={refFormik => setRefForm(refFormik)}
      >
        {form => (
          <>
            <Cabecalho pagina="Cadastro de ocorrência">
              <Row gutter={[8, 8]} type="flex">
                <Col>
                  <BotaoVoltarPadrao onClick={() => onClickVoltar(form)} />
                </Col>
                <Col>
                  <Button
                    id={SGP_BUTTON_IMPRIMIR}
                    icon="print"
                    color={Colors.Azul}
                    semMargemDireita
                    border
                    onClick={onClickGerar}
                    disabled={!idOcorrencia}
                  />
                </Col>
                <Col>
                  <Button
                    id={SGP_BUTTON_CANCELAR}
                    label="Cancelar"
                    color={Colors.Azul}
                    border
                    onClick={onClickCancelar}
                    disabled={
                      !modoEdicao ||
                      ehTurmaAnoAnterior() ||
                      somenteConsulta ||
                      naoPodeIncluirOuAlterar()
                    }
                  />
                </Col>
                {match?.params?.id ? (
                  <Col>
                    <BotaoExcluirPadrao
                      onClick={onClickExcluir}
                      disabled={
                        ehTurmaAnoAnterior() || somenteConsulta || !podeExcluir
                      }
                    />
                  </Col>
                ) : (
                  <></>
                )}
                <Col>
                  <Button
                    id={SGP_BUTTON_ALTERAR_CADASTRAR}
                    label={idOcorrencia ? 'Alterar' : 'Cadastrar'}
                    color={Colors.Roxo}
                    border
                    bold
                    onClick={() => validaAntesDoSubmit(form)}
                    disabled={
                      ehTurmaAnoAnterior() ||
                      somenteConsulta ||
                      naoPodeIncluirOuAlterar() ||
                      (match?.params?.id && !modoEdicao)
                    }
                  />
                </Col>
              </Row>
            </Cabecalho>
            <Card>
              <Form className="col-md-12 mb-4">
                <div className="p-0 col-12 font-weight-bold">
                  <Label text="Crianças envolvidas na ocorrência" isRequired />
                </div>
                <div className="p-0 col-12">
                  {criancasSelecionadas.slice(0, 3).map((crianca, index) => {
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <div className="mb-3" key={`crianca-${index}`}>
                        <span>
                          {crianca.nome} ({crianca.codigoEOL})
                        </span>
                        <br />
                      </div>
                    );
                  })}
                </div>
                {criancasSelecionadas?.length > 3 ? (
                  <div>
                    <span style={{ color: Base.CinzaBotao, fontSize: '12px' }}>
                      Mais {criancasSelecionadas.length - 3}{' '}
                      {criancasSelecionadas.length > 4 ? 'crianças' : 'criança'}
                    </span>
                  </div>
                ) : (
                  ''
                )}
                <div className="p-0 col-12 mt-2">
                  <Button
                    id={shortid.generate()}
                    label={
                      ehTurmaAnoAnterior() ||
                      somenteConsulta ||
                      naoPodeIncluirOuAlterar()
                        ? 'Consultar crianças envolvidas'
                        : 'Editar crianças envolvidas'
                    }
                    color={Colors.Azul}
                    border
                    className="mr-2"
                    onClick={() => onClickEditarCriancas()}
                    icon="user-edit"
                  />
                </div>
                <div className="row mt-3">
                  <div className="col-md-3 col-sm-12 col-lg-3">
                    <CampoData
                      label="Data da ocorrência"
                      name="dataOcorrencia"
                      form={form}
                      valor={dataOcorrencia}
                      onChange={onChangeDataOcorrencia}
                      placeholder="Selecione a data"
                      formatoData="DD/MM/YYYY"
                      desabilitarData={desabilitarData}
                      desabilitado={desabilitarCampos()}
                      labelRequired
                    />
                  </div>
                  <div className="col-md-3 col-sm-12 col-lg-3">
                    <CampoData
                      label="Hora da ocorrência"
                      name="horaOcorrencia"
                      form={form}
                      valor={horaOcorrencia}
                      onChange={onChangeHoraOcorrencia}
                      placeholder="Selecione a hora"
                      formatoData="HH:mm"
                      somenteHora
                      campoOpcional
                      desabilitado={desabilitarCampos()}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 col-lg-6">
                    <SelectComponent
                      form={form}
                      id="tipoOcorrenciaId"
                      placeholder="Situação"
                      label="Tipo de ocorrência"
                      name="ocorrenciaTipoId"
                      valueOption="id"
                      valueText="descricao"
                      lista={listaTiposOcorrencias}
                      value={form.values.ocorrenciaTipoId}
                      onChange={() => setModoEdicao(true)}
                      disabled={desabilitarCampos()}
                      labelRequired
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 col-lg-6 mt-2">
                    <CampoTexto
                      form={form}
                      name="titulo"
                      id="tituloOcorrencia"
                      label="Título da ocorrência"
                      placeholder="Situação"
                      maxLength={50}
                      desabilitado={desabilitarCampos()}
                      onChange={() => setModoEdicao(true)}
                      labelRequired
                    />
                  </div>
                  <div className="col-12 mt-2">
                    <JoditEditor
                      label="Descrição"
                      form={form}
                      value={form?.values?.descricao}
                      name="descricao"
                      id="descricao"
                      permiteInserirArquivo
                      desabilitar={desabilitarCampos()}
                      onChange={() => setModoEdicao(true)}
                      labelRequired
                    />
                  </div>
                </div>
                {auditoria?.criadoEm ? (
                  <div className="row">
                    <Auditoria
                      criadoEm={auditoria.criadoEm}
                      criadoPor={auditoria.criadoPor}
                      criadoRf={auditoria.criadoRf}
                      alteradoPor={auditoria.alteradoPor}
                      alteradoEm={auditoria.alteradoEm}
                      alteradoRf={auditoria.alteradoRf}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </Form>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default CadastroOcorrencias;
