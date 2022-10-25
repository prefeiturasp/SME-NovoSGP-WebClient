import React, { useState, useEffect, useRef, useCallback } from 'react';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import _ from 'lodash';
import { Col, Row } from 'antd';
import Card from '~/componentes/card';
import Grid from '~/componentes/grid';
import Button from '~/componentes/button';
import RadioGroupButton from '~/componentes/radioGroupButton';
import CampoTexto from '~/componentes/campoTexto';
import SelectComponent from '~/componentes/select';
import { Auditoria, Colors, Label, Loader } from '~/componentes';
import history from '~/servicos/history';
import { Div, Badge } from './avaliacao.css';
import RotasDTO from '~/dtos/rotasDto';
import ServicoAvaliacao from '~/servicos/Paginas/Calendario/ServicoAvaliacao';
import { erro, sucesso, confirmar } from '~/servicos/alertas';
import ModalCopiarAvaliacao from './componentes/ModalCopiarAvaliacao';
import Alert from '~/componentes/alert';

// Utils
import { valorNuloOuVazio } from '~/utils/funcoes/gerais';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import { Cabecalho } from '~/componentes-sgp';
import {
  SGP_BUTTON_ALTERAR_CADASTRAR,
  SGP_BUTTON_CANCELAR,
} from '~/constantes/ids/button';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';

const AvaliacaoForm = ({ match, location }) => {
  const [
    mostrarModalCopiarAvaliacao,
    setMostrarModalCopiarAvaliacao,
  ] = useState(false);
  const permissaoTela = useSelector(
    state => state.usuario.permissoes[RotasDTO.CADASTRO_DE_AVALIACAO]
  );
  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const botaoCadastrarRef = useRef(null);
  const [refForm, setRefForm] = useState({});

  const [desabilitarCampos, setDesabilitarCampos] = useState(false);
  const [podeEditarAvaliacao, setPodeEditarAvaliacao] = useState(true);
  const [importado, setImportado] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [dentroPeriodo, setDentroPeriodo] = useState(true);
  const [podeLancaNota, setPodeLancaNota] = useState(true);
  const [listaDisciplinas, setListaDisciplinas] = useState([]);
  const [carregandoTela, setCarregandoTela] = useState(false);
  const [temRegencia, setTemRegencia] = useState(false);

  const clicouBotaoVoltar = async () => {
    if (dentroPeriodo && modoEdicao) {
      const confirmado = await confirmar(
        'Atenção',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );
      if (confirmado) {
        if (botaoCadastrarRef.current) botaoCadastrarRef.current.click();
      } else {
        history.push(RotasDTO.CALENDARIO_PROFESSOR);
      }
    } else {
      history.push(RotasDTO.CALENDARIO_PROFESSOR);
    }
  };

  const [idAvaliacao, setIdAvaliacao] = useState('');
  const [auditoriaAvaliacao, setAuditoriaAvaliacao] = useState({});

  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(undefined);
  const mostrarDisciplinaRegencia = listaDisciplinas?.find?.(
    item =>
      Number(item?.codigoComponenteCurricular) === Number(disciplinaSelecionada)
  )?.regencia;

  const aoTrocarCampos = () => {
    if (!modoEdicao) {
      setModoEdicao(true);
    }
  };

  const onChangeDisciplina = disciplinaId => {
    aoTrocarCampos();
    if (
      disciplinaId &&
      disciplinaId.length === 1 &&
      !Array.isArray(disciplinaId)
    ) {
      const componenteSelecionado = listaDisciplinas.find(
        item => String(item.codigoComponenteCurricular) === String(disciplinaId)
      );
      setPodeLancaNota(
        !componenteSelecionado ? true : componenteSelecionado?.lancaNota
      );
    } else {
      setPodeLancaNota(true);
    }
  };

  const clicouBotaoExcluir = async () => {
    const confirmado = await confirmar(
      'Atenção',
      'Você tem certeza que deseja excluir este registro?'
    );
    if (confirmado) {
      setCarregandoTela(true);
      const exclusao = await ServicoAvaliacao.excluir(idAvaliacao);
      if (exclusao && exclusao.status === 200) {
        setCarregandoTela(false);
        sucesso('Atividade avaliativa excluída com sucesso!');
        history.push(RotasDTO.CALENDARIO_PROFESSOR);
      } else {
        erro(exclusao);
        setCarregandoTela(false);
      }
    }
  };

  const clicouBotaoCadastrar = (form, e) => {
    e.persist();
    form.validateForm().then(() => form.handleSubmit(e));
  };

  const eventoAulaCalendarioEdicao = useSelector(
    store => store.calendarioProfessor.eventoAulaCalendarioEdicao
  );

  const diaAvaliacao = useSelector(
    store => store.calendarioProfessor.diaSelecionado
  );

  const [descricao, setDescricao] = useState('');
  const [copias, setCopias] = useState([]);
  const [listaDisciplinasRegencia, setListaDisciplinasRegencia] = useState([]);
  const [
    listaDisciplinasRegenciaSelecionadas,
    setListaDisciplinasRegenciaSelecionadas,
  ] = useState([]);
  const [
    listaDisciplinasSelecionadas,
    setListaDisciplinasSelecionadas,
  ] = useState([]);
  const [desabilitarCopiarAvaliacao, setDesabilitarCopiarAvaliacao] = useState(
    false
  );
  const [atividadesRegencia, setAtividadesRegencia] = useState([]);

  const usuario = useSelector(store => store.usuario);

  const { turmaSelecionada } = usuario;
  const turmaId = turmaSelecionada ? turmaSelecionada.turma : 0;

  const [dataAvaliacao, setDataAvaliacao] = useState();

  const removerTagsHtml = texto => texto?.replace(/<\/?[^>]+(>|$)/g, '');

  const tamanhoTextoDescricao = textoComHtml => {
    const textoLimpo = removerTagsHtml(textoComHtml);
    const textoComEspacos = textoLimpo?.replaceAll('&nbsp;', ' ');
    return textoComEspacos.length + 1 - textoComEspacos.split(' ').length;
  };

  const validaTamanhoCaracteres = () => {
    return importado ? true : tamanhoTextoDescricao(descricao) <= 500;
  };

  const cadastrarAvaliacao = async dados => {
    const avaliacao = {};
    setCarregandoTela(true);
    if (Object.entries(eventoAulaCalendarioEdicao)?.length) {
      avaliacao.dreId = eventoAulaCalendarioEdicao.dre;
      avaliacao.turmaId = eventoAulaCalendarioEdicao.turma;
      avaliacao.ueId = eventoAulaCalendarioEdicao.unidadeEscolar;
    } else if (Object.entries(turmaSelecionada)?.length) {
      avaliacao.dreId = turmaSelecionada.dre;
      avaliacao.turmaId = turmaSelecionada.turma;
      avaliacao.ueId = turmaSelecionada.unidadeEscolar;
    }

    if (mostrarDisciplinaRegencia && temRegencia) {
      const disciplinas = [];
      listaDisciplinasRegenciaSelecionadas.forEach(disciplina => {
        if (
          !disciplinas.includes(disciplina.codigoComponenteCurricular) &&
          disciplina.selecionada
        )
          disciplinas.push(`${disciplina.codigoComponenteCurricular}`);
      });
      if (disciplinas?.length) {
        avaliacao.disciplinaContidaRegenciaId = disciplinas;
      } else {
        erro('É necessário informar as disciplinas da regência');
        setCarregandoTela(false);
        return;
      }
    }

    avaliacao.dataAvaliacao = window.moment(dataAvaliacao).format();
    avaliacao.descricao = descricao;

    dados.disciplinasId = Array.isArray(dados.disciplinasId)
      ? [...dados.disciplinasId]
      : [dados.disciplinasId];

    const dadosValidacao = {
      ...dados,
      ...avaliacao,
      turmasParaCopiar: copias.map(z => ({
        turmaId: z.turmaId,
        dataAtividadeAvaliativa: z.dataAvaliacao,
      })),
    };

    delete dadosValidacao.categoriaId;
    delete dadosValidacao.descricao;

    if (validaTamanhoCaracteres()) {
      const validacao = await ServicoAvaliacao.validar(dadosValidacao);

      if (validacao && validacao.status === 200) {
        const salvar = await ServicoAvaliacao.salvar(idAvaliacao, {
          ...dados,
          ...avaliacao,
          turmasParaCopiar: copias.map(z => ({
            turmaId: z.turmaId,
            dataAtividadeAvaliativa: z.dataAvaliacao,
          })),
        });

        if (salvar && salvar.status === 200) {
          if (salvar.data && salvar.data.length) {
            salvar.data.forEach(item => {
              if (item.mensagem.includes('Erro')) {
                setCarregandoTela(false);
                erro(item.mensagem);
              } else {
                setCarregandoTela(false);
                sucesso(item.mensagem);
              }
            });
          } else {
            setCarregandoTela(false);
            sucesso(
              `Avaliação ${
                idAvaliacao ? 'atualizada' : 'cadastrada'
              } com sucesso.`
            );
          }
          setCarregandoTela(false);
          history.push(RotasDTO.CALENDARIO_PROFESSOR);
        } else {
          setCarregandoTela(false);
          erro(salvar);
        }
      } else {
        setCarregandoTela(false);
        erro(validacao);
      }
    } else {
      setCarregandoTela(false);
      erro('A descrição não deve ter mais de 500 caracteres');
    }
  };

  const categorias = { NORMAL: 1, INTERDISCIPLINAR: 2 };
  const [validacoes, setValidacoes] = useState(undefined);

  const montaValidacoes = categoria => {
    const ehInterdisciplinar = categoria === categorias.INTERDISCIPLINAR;
    const val = {
      categoriaId: Yup.string().required('Selecione a categoria'),
      disciplinasId: Yup.string()
        .required('Selecione o componente curricular')
        .test({
          name: 'quantidadeDisciplinas',
          exclusive: true,
          message:
            'Para categoria Interdisciplinar informe mais que um componente curricular',
          test: value => (ehInterdisciplinar ? value?.length > 1 : true),
        }),
      tipoAvaliacaoId: Yup.string().required(
        'Selecione o tipo de atividade avaliativa'
      ),
      nome: Yup.string().required('Preencha o nome da atividade avaliativa'),
      descricao: Yup.string()
        .required('Campo obrigatório')
        .test(
          'len',
          'A descrição não deve ter mais de 500 caracteres',
          texto => {
            return texto === undefined || validaTamanhoCaracteres();
          }
        ),
    };
    setValidacoes(Yup.object(val));
  };

  const [listaCategorias, setListaCategorias] = useState([
    { label: 'Normal', value: categorias.NORMAL },
    {
      label: 'Interdisciplinar',
      value: categorias.INTERDISCIPLINAR,
      disabled: true,
    },
  ]);

  const campoNomeRef = useRef(null);

  const aoTrocarTextEditor = valor => {
    setDescricao(valor);
    aoTrocarCampos();
  };

  const [dadosAvaliacao, setDadosAvaliacao] = useState();
  const inicial = {
    categoriaId: 1,
    disciplinasId: undefined,
    disciplinaContidaRegenciaId: [],
    nome: '',
    tipoAvaliacaoId: undefined,
    importado: false,
    descricao: '',
  };

  const obterDisciplinas = async () => {
    try {
      setCarregandoTela(true);
      const { data } = await ServicoAvaliacao.listarDisciplinas(
        usuario.rf,
        turmaId
      );
      if (data) {
        setListaDisciplinas(data);
        if (data.length > 1) {
          listaCategorias.forEach(categoria => {
            if (categoria.value === categorias.INTERDISCIPLINAR) {
              categoria.disabled = false;
            }
          });
          setListaCategorias([...listaCategorias]);
        }
        setCarregandoTela(false);
      }
    } catch (error) {
      setCarregandoTela(false);
      erro(`Não foi possível obter o componente curricular do EOL.`);
    }
  };

  const montarListaDisciplinasRegenciaExibicao = useCallback(
    (listaDisciplinasReg, atividadesReg) => {
      if (mostrarDisciplinaRegencia) {
        atividadesReg.forEach(atividade => {
          listaDisciplinasReg.forEach(disciplina => {
            if (
              Number(atividade.disciplinaContidaRegenciaId) ===
              Number(disciplina.codigoComponenteCurricular)
            ) {
              disciplina.selecionada = true;
            }
          });
          setListaDisciplinasRegenciaSelecionadas([...listaDisciplinasReg]);
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [mostrarDisciplinaRegencia]
  );

  useEffect(() => {
    if (listaDisciplinasRegencia?.length && atividadesRegencia?.length) {
      montarListaDisciplinasRegenciaExibicao(
        _.cloneDeep(listaDisciplinasRegencia),
        atividadesRegencia
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    montarListaDisciplinasRegenciaExibicao,
    atividadesRegencia,
    listaDisciplinasRegencia,
  ]);

  const obterDisciplinasRegencia = async () => {
    try {
      setCarregandoTela(true);
      const { data, status } = await ServicoAvaliacao.listarDisciplinasRegencia(
        turmaId,
        true
      );
      if (data && status === 200) {
        setListaDisciplinasRegenciaSelecionadas(_.cloneDeep(data));
        setListaDisciplinasRegencia(_.cloneDeep(data));
        setTemRegencia(true);
        setCarregandoTela(false);
      }
    } catch (error) {
      setCarregandoTela(false);
      erro(`Não foi possivel obter os componentes de regência.`);
    }
  };

  useEffect(() => {
    if (!match?.params?.id && listaDisciplinas?.length === 1) {
      setDadosAvaliacao({
        ...dadosAvaliacao,
        disciplinasId: listaDisciplinas[0].codigoComponenteCurricular.toString(),
      });
      setPodeLancaNota(listaDisciplinas[0].lancaNota);
      setDisciplinaSelecionada(listaDisciplinas[0].codigoComponenteCurricular);
    }
    if (mostrarDisciplinaRegencia) {
      setTemRegencia(true);
      obterDisciplinasRegencia();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listaDisciplinas, mostrarDisciplinaRegencia, match]);

  const [listaTiposAvaliacao, setListaTiposAvaliacao] = useState([]);

  const obterlistaTiposAvaliacao = async () => {
    const tipos = await ServicoAvaliacao.listarTipos();
    if (tipos.data && tipos.data.items) {
      const lista = [];
      tipos.data.items.forEach(tipo => {
        lista.push({ nome: tipo.nome, id: tipo.id });
      });
      setListaTiposAvaliacao(lista);
    }
  };

  const validaF5 = () => {
    // TODO
    // Manter enquanto não é realizado o refactor da tela e do calendário!
    // Somente quando for novo registro, ao dar F5 a página perde a data selecionada no calendário do professor!
    setCarregandoTela(true);
    setTimeout(() => {
      setCarregandoTela(false);
      history.push(RotasDTO.CALENDARIO_PROFESSOR);
    }, 2000);
  };

  useEffect(() => {
    montaValidacoes(categorias.NORMAL);
    obterDisciplinas();
    obterlistaTiposAvaliacao();

    if (!idAvaliacao) setDadosAvaliacao(inicial);

    if (match?.params?.id) {
      setIdAvaliacao(match.params.id);
    } else if (diaAvaliacao) {
      setDataAvaliacao(window.moment(diaAvaliacao));
    } else if (!valorNuloOuVazio(location.search)) {
      const query = queryString.parse(location.search);
      setDataAvaliacao(window.moment(query.diaAvaliacao));
    } else {
      validaF5();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validaInterdisciplinar = categoriaSelecionada => {
    if (Number(categoriaSelecionada) === categorias.INTERDISCIPLINAR) {
      setCopias([]);
      setDesabilitarCopiarAvaliacao(true);
    } else {
      setDesabilitarCopiarAvaliacao(false);
    }
  };

  const obterAvaliacao = async () => {
    try {
      setCarregandoTela(true);
      const avaliacao = await ServicoAvaliacao.buscar(idAvaliacao);
      if (avaliacao && avaliacao.data) {
        setDataAvaliacao(window.moment(avaliacao.data.dataAvaliacao));
        setListaDisciplinasSelecionadas(avaliacao.data.disciplinasId);
        setDisciplinaSelecionada(avaliacao.data.disciplinasId[0]);
        validaInterdisciplinar(avaliacao.data.categoriaId);
        const tipoAvaliacaoId = avaliacao.data.tipoAvaliacaoId.toString();
        setImportado(avaliacao.data.importado);
        setDadosAvaliacao({ ...avaliacao.data, tipoAvaliacaoId, importado });
        setDescricao(avaliacao.data.descricao);
        setAuditoriaAvaliacao(avaliacao.data);
        setDentroPeriodo(avaliacao.data.dentroPeriodo);
        setPodeEditarAvaliacao(avaliacao.data.podeEditarAvaliacao);
        setAtividadesRegencia(avaliacao.data.atividadesRegencia);
        setCarregandoTela(false);
      }
    } catch (error) {
      setCarregandoTela(false);
      erro(`Não foi possível obter avaliação!`);
    }
  };

  useEffect(() => {
    if (
      idAvaliacao &&
      !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada)
    )
      obterAvaliacao();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idAvaliacao]);

  useEffect(() => {
    const turmaInfantil = ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );
    setDesabilitarCampos(turmaInfantil || !podeEditarAvaliacao);

    if (turmaInfantil && refForm && refForm.resetForm) {
      refForm.resetForm();
      setDescricao('');
      setModoEdicao(false);
    }
  }, [
    turmaSelecionada,
    modalidadesFiltroPrincipal,
    refForm,
    inicial,
    podeEditarAvaliacao,
  ]);

  const selecionarDisciplina = indice => {
    const disciplinas = _.cloneDeep(listaDisciplinasRegenciaSelecionadas);
    disciplinas[indice].selecionada = !disciplinas[indice].selecionada;
    setListaDisciplinasRegenciaSelecionadas([...disciplinas]);
    aoTrocarCampos();
  };

  const resetDisciplinasSelecionadas = form => {
    setListaDisciplinasSelecionadas([]);
    form.values.disciplinasId = [];
  };

  const renderDataAvaliacao = useCallback(() => {
    return `${dataAvaliacao?.format('dddd')}, ${dataAvaliacao?.format(
      'DD/MM/YYYY'
    )}`;
  }, [dataAvaliacao]);

  const clicouBotaoCancelar = async form => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        form.resetForm();
        aoTrocarTextEditor('');
        setModoEdicao(false);
        if (idAvaliacao) {
          montarListaDisciplinasRegenciaExibicao(
            _.cloneDeep(listaDisciplinasRegencia),
            atividadesRegencia
          );
        } else {
          setListaDisciplinasRegenciaSelecionadas(
            _.cloneDeep(listaDisciplinasRegencia)
          );
        }
      }
    }
  };

  return (
    <>
      <Div className="col-12">
        {!podeLancaNota ? (
          <Alert
            alerta={{
              tipo: 'warning',
              id: 'cadastro-aula-nao-lanca-nota',
              mensagem:
                'Este componente curricular não permite cadastrar avaliação.',
            }}
          />
        ) : (
          <></>
        )}
        {!dentroPeriodo ? (
          <Alert
            alerta={{
              tipo: 'warning',
              id: 'alerta-perido-fechamento',
              mensagem:
                'Apenas é possível consultar este registro pois o período não está em aberto.',
            }}
          />
        ) : (
          <></>
        )}
        {mostrarModalCopiarAvaliacao ? (
          <ModalCopiarAvaliacao
            show={mostrarModalCopiarAvaliacao}
            onClose={() => setMostrarModalCopiarAvaliacao(false)}
            disciplina={disciplinaSelecionada}
            onSalvarCopias={copiasAvaliacoes => {
              setCopias(copiasAvaliacoes);
              setModoEdicao(true);
            }}
          />
        ) : (
          ''
        )}
        <AlertaModalidadeInfantil />
        <Loader loading={carregandoTela} tip="Carregando...">
          <Formik
            enableReinitialize
            ref={r => setRefForm(r)}
            initialValues={dadosAvaliacao}
            onSubmit={dados => cadastrarAvaliacao(dados)}
            validationSchema={validacoes}
            validateOnBlur
            validateOnChange
          >
            {form => (
              <>
                <Cabecalho
                  pagina={`Cadastro de avaliação - ${renderDataAvaliacao()}`}
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
                        onClick={() => clicouBotaoCancelar(form)}
                        border
                        bold
                        disabled={
                          desabilitarCampos || !dentroPeriodo || !modoEdicao
                        }
                      />
                    </Col>
                    <Col>
                      <BotaoExcluirPadrao
                        disabled={
                          desabilitarCampos ||
                          !idAvaliacao ||
                          (permissaoTela && !permissaoTela.podeAlterar) ||
                          !dentroPeriodo
                        }
                        onClick={clicouBotaoExcluir}
                      />
                    </Col>
                    <Col>
                      <Button
                        id={SGP_BUTTON_ALTERAR_CADASTRAR}
                        label={idAvaliacao ? 'Alterar' : 'Cadastrar'}
                        color={Colors.Roxo}
                        onClick={e => clicouBotaoCadastrar(form, e)}
                        ref={botaoCadastrarRef}
                        disabled={
                          desabilitarCampos ||
                          (permissaoTela &&
                            (!permissaoTela.podeIncluir ||
                              !permissaoTela.podeAlterar)) ||
                          !dentroPeriodo ||
                          (idAvaliacao && !modoEdicao) ||
                          !podeLancaNota
                        }
                        border
                        bold
                      />
                    </Col>
                  </Row>
                </Cabecalho>
                <Card>
                  <Form className="col-md-12">
                    <Div className="row">
                      <Grid cols={12} className="mb-4">
                        <RadioGroupButton
                          id="categoriaId"
                          name="categoriaId"
                          label="Categoria"
                          opcoes={listaCategorias}
                          form={form}
                          onChange={e => {
                            aoTrocarCampos();
                            resetDisciplinasSelecionadas(form);
                            montaValidacoes(e.target.value);
                            validaInterdisciplinar(e.target.value);
                          }}
                          desabilitado={desabilitarCampos || !dentroPeriodo}
                          labelRequired
                        />
                      </Grid>
                    </Div>
                    <Div className="row">
                      <Grid cols={4} className="mb-4">
                        {listaDisciplinas?.length > 1 &&
                        form.values.categoriaId ===
                          categorias.INTERDISCIPLINAR ? (
                          <SelectComponent
                            id="disciplinasId"
                            name="disciplinasId"
                            label="Componente curricular"
                            lista={listaDisciplinas}
                            valueOption="codigoComponenteCurricular"
                            valueText="nome"
                            disabled={
                              desabilitarCampos ||
                              !dentroPeriodo ||
                              listaDisciplinas?.length === 1
                            }
                            placeholder="Selecione um componente curricular"
                            form={form}
                            multiple
                            onChange={onChangeDisciplina}
                            valueSelect={listaDisciplinasSelecionadas}
                            labelRequired
                          />
                        ) : (
                          <SelectComponent
                            id="disciplinasId"
                            name="disciplinasId"
                            label="Componente curricular"
                            lista={listaDisciplinas}
                            valueOption="codigoComponenteCurricular"
                            valueText="nome"
                            disabled={
                              desabilitarCampos ||
                              !dentroPeriodo ||
                              listaDisciplinas?.length === 1
                            }
                            placeholder="Selecione um componente curricular"
                            form={form}
                            onChange={valor => {
                              setDisciplinaSelecionada(valor);
                              onChangeDisciplina(valor);
                            }}
                            valueSelect={disciplinaSelecionada}
                            labelRequired
                          />
                        )}
                      </Grid>
                      <Grid cols={4} className="mb-4">
                        <SelectComponent
                          id="tipoAvaliacaoId"
                          name="tipoAvaliacaoId"
                          label="Tipo de atividade avaliativa"
                          lista={listaTiposAvaliacao}
                          valueOption="id"
                          valueText="nome"
                          placeholder="Atividade avaliativa"
                          form={form}
                          onChange={aoTrocarCampos}
                          disabled={desabilitarCampos || !dentroPeriodo}
                          labelRequired
                        />
                      </Grid>
                      <Grid cols={4} className="mb-4">
                        <CampoTexto
                          label="Nome da atividade avaliativa"
                          name="nome"
                          id="nome"
                          maxlength={50}
                          placeholder="Nome"
                          type="input"
                          form={form}
                          ref={campoNomeRef}
                          onChange={e => {
                            form.setFieldValue('nome', e.target.value);
                            aoTrocarCampos();
                          }}
                          desabilitado={desabilitarCampos || !dentroPeriodo}
                          labelRequired
                        />
                      </Grid>
                    </Div>
                    {temRegencia &&
                      listaDisciplinasRegenciaSelecionadas &&
                      mostrarDisciplinaRegencia && (
                        <Div className="row">
                          <Grid cols={12} className="mb-4">
                            <Label isRequired text="Componentes da regência" />
                            {listaDisciplinasRegenciaSelecionadas.map(
                              (disciplina, indice) => {
                                return (
                                  <Badge
                                    key={disciplina.codigoComponenteCurricular}
                                    role="button"
                                    onClick={e => {
                                      e.preventDefault();
                                      selecionarDisciplina(indice);
                                    }}
                                    aria-pressed={
                                      disciplina.selecionada && true
                                    }
                                    alt={disciplina.nome}
                                    className="badge badge-pill border text-dark bg-white font-weight-light px-2 py-1 mr-2"
                                  >
                                    {disciplina.nome}
                                  </Badge>
                                );
                              }
                            )}
                          </Grid>
                        </Div>
                      )}
                    <Div className="row">
                      <Grid cols={12}>
                        <JoditEditor
                          label="Descrição"
                          form={form}
                          value={form.values.descricao}
                          name="descricao"
                          id="descricao"
                          onChange={aoTrocarTextEditor}
                          desabilitar={desabilitarCampos || !dentroPeriodo}
                          permiteInserirArquivo={false}
                          labelRequired
                        />
                      </Grid>
                    </Div>
                    <Div className="row" style={{ marginTop: '14px' }}>
                      <Grid
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                        }}
                        cols={12}
                      >
                        <Button
                          label="Copiar avaliação"
                          icon="clipboard"
                          color={Colors.Azul}
                          border
                          className="btnGroupItem"
                          onClick={() => setMostrarModalCopiarAvaliacao(true)}
                          disabled={
                            desabilitarCampos ||
                            !dentroPeriodo ||
                            desabilitarCopiarAvaliacao
                          }
                        />
                        {copias?.length > 0 && (
                          <div style={{ marginLeft: '14px' }}>
                            <span>Avaliação será copiada para: </span>
                            <br />
                            {copias.map(x => (
                              <span style={{ display: 'block' }}>
                                <strong>Turma:</strong> &nbsp;
                                {x.turma[0].desc} <strong>Data: &nbsp;</strong>
                                {window
                                  .moment(x.dataAvaliacao)
                                  .format('DD/MM/YYYY')}
                              </span>
                            ))}
                          </div>
                        )}
                      </Grid>
                    </Div>
                  </Form>
                  <Div className="row">
                    <Grid cols={12}>
                      <Auditoria
                        criadoPor={auditoriaAvaliacao?.criadoPor}
                        criadoEm={auditoriaAvaliacao?.criadoEm}
                        alteradoPor={auditoriaAvaliacao?.alteradoPor}
                        alteradoEm={auditoriaAvaliacao?.alteradoEm}
                        alteradoRf={auditoriaAvaliacao?.alteradoRF}
                        criadoRf={auditoriaAvaliacao?.criadoRF}
                      />
                    </Grid>
                  </Div>
                </Card>
              </>
            )}
          </Formik>
        </Loader>
      </Div>
    </>
  );
};

AvaliacaoForm.propTypes = {
  match: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  location: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

AvaliacaoForm.defaultProps = {
  match: {},
  location: {},
};

export default AvaliacaoForm;
