import { ROUTES } from '@/core/enum/routes';
import { Form, Formik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import {
  Auditoria,
  CampoData,
  Loader,
  MarcadorSituacao,
  PainelCollapse,
} from '~/componentes';
import AlertaPermiteSomenteTurmaInfantil from '~/componentes-sgp/AlertaPermiteSomenteTurmaInfantil/alertaPermiteSomenteTurmaInfantil';
import AlertaPeriodoEncerrado from '~/componentes-sgp/Calendario/componentes/MesCompleto/componentes/Dias/componentes/DiaCompleto/componentes/AlertaPeriodoEncerrado';
import DadosMuralGoogleSalaAula from '~/componentes-sgp/MuralGoogleSalaAula/dadosMuralGoogleSalaAula';
import ServicoObservacoesUsuario from '~/componentes-sgp/ObservacoesUsuario/ServicoObservacoesUsuario';
import ObservacoesUsuario from '~/componentes-sgp/ObservacoesUsuario/observacoesUsuario';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Alert from '~/componentes/alert';
import Card from '~/componentes/card';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import ModalMultiLinhas from '~/componentes/modalMultiLinhas';
import SelectComponent from '~/componentes/select';
import {
  limparDadosObservacoesUsuario,
  setDadosObservacoesUsuario,
} from '~/redux/modulos/observacoesUsuario/actions';
import { setBreadcrumbManual } from '~/servicos';
import ServicoDiarioBordo from '~/servicos/Paginas/DiarioClasse/ServicoDiarioBordo';
import ServicoFrequencia from '~/servicos/Paginas/DiarioClasse/ServicoFrequencia';
import ServicoDisciplina from '~/servicos/Paginas/ServicoDisciplina';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import { confirmar, erros, sucesso } from '~/servicos/alertas';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import { removerTagsHtml } from '~/utils';
import BotoesAcoesDiarioBordo from './botoesAcoesDiarioBordo';
import ModalSelecionarAula from './modalSelecionarAula';

const DiarioBordo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paramsRoute = useParams();

  const usuario = useSelector(state => state.usuario);
  const { turmaSelecionada } = usuario;
  const permissoesTela = usuario.permissoes[ROUTES.DIARIO_BORDO];
  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );
  const turmaId = turmaSelecionada ? turmaSelecionada.turma : 0;

  const listaUsuarios = useSelector(
    store => store.observacoesUsuario.listaUsuariosNotificacao
  );

  const [listaComponenteCurriculares, setListaComponenteCurriculares] =
    useState();
  const [componenteCurricularSelecionado, setComponenteCurricularSelecionado] =
    useState();

  const valorComponenteAExibir =
    listaComponenteCurriculares?.length === 1
      ? listaComponenteCurriculares[0].nomeComponenteInfantil != null
        ? 'nomeComponenteInfantil'
        : 'nome'
      : 'nomeComponenteInfantil';

  const [codDisciplinaPai, setCodDisciplinaPai] = useState();
  const [dataSelecionada, setDataSelecionada] = useState();
  const [carregandoGeral, setCarregandoGeral] = useState(false);
  const [carregandoData, setCarregandoData] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [listaDatasAulas, setListaDatasAulas] = useState([]);
  const [diasParaHabilitar, setDiasParaHabilitar] = useState();
  const [errosValidacao, setErrosValidacao] = useState([]);
  const [mostrarErros, setMostarErros] = useState(false);
  const [auditoria, setAuditoria] = useState('');
  const [turmaInfantil, setTurmaInfantil] = useState(false);
  const [refForm, setRefForm] = useState({});
  const [dadosDiarioBordo, setDadosDiarioBordo] = useState();
  const [aulaSelecionada, setAulaSelecionada] = useState();
  const [aulasParaSelecionar, setAulasParaSelecionar] = useState([]);
  const [exibirModalSelecionarAula, setExibirModalSelecionarAula] =
    useState(false);
  const [desabilitarCampos, setDesabilitarCampos] = useState(false);
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const dispatch = useDispatch();

  const aulaId = paramsRoute?.aulaId;
  const diarioBordoId = paramsRoute?.diarioBordoId;
  const componenteCurricularId = paramsRoute?.componenteCurricularId;

  const inicial = {
    aulaId: 0,
    planejamento: '',
    reflexoesReplanejamento: '',
    devolutivas: '',
    componenteCurricularId: null,
    codDisciplinaPai: null,
    diarioBordoId: null,
    planejamentoIrmao: '',
  };
  const [valoresIniciais, setValoresIniciais] = useState(inicial);

  const validacoes = Yup.object({
    planejamento: Yup.string()
      .required('Campo planejamento é obrigatório')
      .test(
        'len',
        'Você precisa preencher o planejamento com no mínimo 200 caracteres',
        val => {
          const length = removerTagsHtml(val)
            ?.replaceAll(/\s/g, '')
            ?.replace(/&nbsp;/g, '')?.length;

          return length > 200;
        }
      ),
  });

  useEffect(() => {
    const naoSetarSomenteConsultaNoStore = !ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );

    const soConsulta = verificaSomenteConsulta(
      permissoesTela,
      naoSetarSomenteConsultaNoStore
    );
    setSomenteConsulta(soConsulta);
    const desabilitar =
      auditoria && auditoria.id > 0
        ? soConsulta || !permissoesTela.podeAlterar
        : soConsulta || !permissoesTela.podeIncluir;
    setDesabilitarCampos(desabilitar);

    if (!dadosDiarioBordo?.temPeriodoAberto) {
      setDesabilitarCampos(true);
    }
  }, [
    auditoria,
    permissoesTela,
    dadosDiarioBordo?.temPeriodoAberto,
    modalidadesFiltroPrincipal,
    turmaSelecionada,
  ]);

  const resetarTela = useCallback(
    form => {
      setValoresIniciais(inicial);
      if (form && form.resetForm) {
        form.resetForm();
      }
      setDataSelecionada('');
      setAulaSelecionada();
      setModoEdicao(false);
      setAuditoria();
      setDadosDiarioBordo();
    },
    [inicial]
  );

  useEffect(() => {
    const infantil = ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );
    setTurmaInfantil(infantil);

    if (!turmaInfantil) {
      resetarTela(refForm);
    }
  }, [turmaSelecionada, modalidadesFiltroPrincipal, turmaInfantil]);

  useEffect(() => {
    setListaDatasAulas();
    setDiasParaHabilitar();
    resetarTela(refForm);
  }, [turmaSelecionada.turma]);

  const obterComponentesCurriculares = useCallback(async () => {
    setComponenteCurricularSelecionado(undefined);
    setCarregandoGeral(true);
    const componentes = await ServicoDisciplina.obterDisciplinasPorTurma(
      turmaId,
      false,
      false
    ).catch(e => erros(e));
    if (componentes?.data?.length) {
      setListaComponenteCurriculares(componentes.data);

      if (componentes.data.length === 1) {
        const componente = componentes.data[0];
        setComponenteCurricularSelecionado(
          String(componente.codigoComponenteCurricular)
        );
        const codDisciplina = componente?.codDisciplinaPai || componente?.id;
        setCodDisciplinaPai(String(codDisciplina));
      }
    }

    setCarregandoGeral(false);
  }, [turmaId]);

  useEffect(() => {
    if (turmaId && turmaInfantil) {
      obterComponentesCurriculares();
    } else {
      setListaComponenteCurriculares([]);
      setComponenteCurricularSelecionado(undefined);
      setCodDisciplinaPai(undefined);
      resetarTela();
    }
  }, [turmaId, obterComponentesCurriculares, turmaInfantil]);

  const obterDadosObservacoes = async diarioBordoIdSel => {
    dispatch(limparDadosObservacoesUsuario());
    setCarregandoGeral(true);
    const retorno = await ServicoDiarioBordo.obterDadosObservacoes(
      diarioBordoIdSel
    ).catch(e => {
      erros(e);
      setCarregandoGeral(false);
    });

    if (retorno && retorno.data) {
      const dadosObservacoes =
        ServicoObservacoesUsuario.obterUsuarioPorObservacao(retorno.data);
      dispatch(setDadosObservacoesUsuario([...dadosObservacoes]));
    } else {
      dispatch(setDadosObservacoesUsuario([]));
    }

    setCarregandoGeral(false);
  };

  const obterDiarioBordo = async (aulaIdEnviada, componenteCurricular) => {
    setCarregandoGeral(true);
    const retorno = await ServicoDiarioBordo.obterDiarioBordo(
      aulaIdEnviada,
      componenteCurricular
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoGeral(false));

    if (retorno?.data) {
      const compCurricularSelecionado = String(
        retorno.data.componenteCurricularId
      );
      const codDisciplinaPaiSelecionado = String(retorno.data.codDisciplinaPai);

      const valInicial = {
        aulaId: aulaIdEnviada || 0,
        planejamento: retorno.data.planejamento || '',
        reflexoesReplanejamento: retorno.data.reflexoesReplanejamento || '',
        devolutivas: retorno.data.devolutivas || '',
        componenteCurricularId: compCurricularSelecionado,
        codDisciplinaPai: codDisciplinaPaiSelecionado,
        planejamentoIrmao: retorno.data.planejamentoIrmao || '',
      };
      setDadosDiarioBordo(retorno.data);
      setValoresIniciais(valInicial);
      if (retorno?.data?.auditoria?.id) {
        setAuditoria(retorno.data.auditoria);
        obterDadosObservacoes(retorno.data.auditoria.id);
      }
    }
  };

  const obterDatasDeAulasDisponiveis = useCallback(
    async codDiscipPai => {
      setCarregandoData(true);
      const datasDeAulas =
        turmaId && codDiscipPai
          ? await ServicoFrequencia.obterDatasDeAulasPorCalendarioTurmaEComponenteCurricular(
              turmaId,
              codDiscipPai
            )
              .catch(e => {
                setCarregandoGeral(false);
                erros(e);
              })
              .finally(() => {
                setCarregandoData(false);
              })
          : [];

      const codigoComponenteCurricular = componenteCurricularId || codDiscipPai;

      if (datasDeAulas?.data?.length && codigoComponenteCurricular) {
        setListaDatasAulas(datasDeAulas.data);
        const habilitar = datasDeAulas.data.map(item => {
          if (aulaId && !dataSelecionada && item.aulas) {
            const dataEncontrada = item.aulas.find(
              a => a.aulaId.toString() === aulaId.toString()
            );
            if (dataEncontrada) {
              setDataSelecionada(window.moment(item.data));
              obterDiarioBordo(aulaId, codigoComponenteCurricular);
            }
          }
          return window.moment(item.data).format('YYYY-MM-DD');
        });

        setDiasParaHabilitar(habilitar);
      } else {
        setListaDatasAulas([]);
        setDiasParaHabilitar();
      }
    },

    [turmaId]
  );

  useEffect(() => {
    if (turmaId && codDisciplinaPai) {
      obterDatasDeAulasDisponiveis(codDisciplinaPai);
    }
  }, [turmaId, codDisciplinaPai, obterDatasDeAulasDisponiveis]);

  const onChangeComponenteCurricular = valor => {
    if (!valor) {
      setDiasParaHabilitar([]);
    }
    setDataSelecionada('');
    setComponenteCurricularSelecionado(valor);

    const valorCodDisciplinaPai = listaComponenteCurriculares.find(
      item => String(item.codigoComponenteCurricular) === valor
    );
    setCodDisciplinaPai(valorCodDisciplinaPai?.codDisciplinaPai);
  };

  const pergutarParaSalvar = () => {
    return confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
  };

  useEffect(() => {
    if (componenteCurricularId && listaComponenteCurriculares?.length) {
      const valorCodDisciplinaPai = listaComponenteCurriculares.find(
        item =>
          String(item.codigoComponenteCurricular) === componenteCurricularId
      );
      const codDisciplina =
        valorCodDisciplinaPai?.codDisciplinaPai || valorCodDisciplinaPai?.id;
      setCodDisciplinaPai(String(codDisciplina));
      setComponenteCurricularSelecionado(componenteCurricularId);
    }
  }, [componenteCurricularId, listaComponenteCurriculares]);

  useEffect(() => {
    if (aulaId) {
      setBreadcrumbManual(location.pathname, 'Alterar', ROUTES.DIARIO_BORDO);
    }
  }, [location, aulaId]);

  const salvarDiarioDeBordo = async (valores, form, clicouBtnSalvar) => {
    setCarregandoGeral(true);
    let aulaIdSelecionada = aulaSelecionada?.aulaId;
    let voltarParaListagem = false;
    if (!aulaIdSelecionada && aulaId) {
      aulaIdSelecionada = aulaId;
      voltarParaListagem = true;
    }

    const params = {
      aulaId: aulaIdSelecionada,
      planejamento: valores.planejamento,
      reflexoesReplanejamento: valores.reflexoesReplanejamento,
      componenteCurricularId: componenteCurricularSelecionado,
    };

    const retorno = await ServicoDiarioBordo.salvarDiarioBordo(
      params,
      auditoria ? auditoria.id : 0
    ).catch(e => erros(e));
    setCarregandoGeral(false);
    let salvouComSucesso = false;
    if (retorno && retorno.status === 200) {
      sucesso('Diário de bordo salvo com sucesso.');
      if (clicouBtnSalvar) {
        setModoEdicao(false);
        resetarTela();
      }
      if (voltarParaListagem) {
        navigate(ROUTES.DIARIO_BORDO);
      }
      salvouComSucesso = true;
    }
    return salvouComSucesso;
  };

  const validaAntesDoSubmit = (form, clicouBtnSalvar) => {
    setCarregandoGeral(true);
    const arrayCampos = Object.keys(valoresIniciais);
    arrayCampos.forEach(campo => {
      form.setFieldTouched(campo, true, true);
    });
    return form.validateForm().then(() => {
      if (Object.keys(form.errors).length > 0) {
        setErrosValidacao([form.errors.planejamento]);
        setMostarErros(true);
      } else {
        setErrosValidacao([]);
        setMostarErros(false);
      }

      if (form.isValid || Object.keys(form.errors).length === 0) {
        return salvarDiarioDeBordo(form.values, form, clicouBtnSalvar);
      }
      setCarregandoGeral(false);
      return false;
    });
  };

  const obterAulasDataSelecionada = useCallback(
    async data => {
      if (listaDatasAulas) {
        const aulaDataSelecionada = listaDatasAulas.find(item => {
          return (
            window.moment(item.data).format('DD/MM/YYYY') ===
            window.moment(data).format('DD/MM/YYYY')
          );
        });
        return aulaDataSelecionada;
      }
      return null;
    },
    [listaDatasAulas]
  );

  const validaSeTemIdAula = useCallback(
    async (data, form) => {
      form.resetForm();
      setValoresIniciais(inicial);
      setModoEdicao(false);
      setAulaSelecionada();
      setAuditoria();
      const aulasDataSelecionada = await obterAulasDataSelecionada(data);
      if (aulasDataSelecionada && aulasDataSelecionada.aulas.length === 1) {
        // Quando for Professor ou CJ podem visualizar somente uma aula por data selecionada!
        const aulaDataSelecionada = aulasDataSelecionada.aulas[0];
        if (aulaDataSelecionada) {
          setAulaSelecionada(aulaDataSelecionada);
          obterDiarioBordo(
            aulaDataSelecionada.aulaId,
            componenteCurricularSelecionado
          );
        } else {
          resetarTela(form);
        }
      } else if (
        aulasDataSelecionada &&
        aulasDataSelecionada.aulas.length > 1
      ) {
        // Quando for CP, Diretor ou usuários da DRE e SME podem visualizar mais aulas por data selecionada!
        setAulasParaSelecionar(aulasDataSelecionada.aulas);
        setExibirModalSelecionarAula(true);
      } else {
        resetarTela(form);
      }
    },

    [obterAulasDataSelecionada, componenteCurricularSelecionado]
  );

  const onChangeData = async (data, form) => {
    if (modoEdicao) {
      const confirmarParaSalvar = await pergutarParaSalvar();
      if (confirmarParaSalvar) {
        const salvoComSucesso = await validaAntesDoSubmit(form);
        if (salvoComSucesso) {
          await validaSeTemIdAula(data, form);
          setDataSelecionada(data);
        }
      } else {
        await validaSeTemIdAula(data, form);
        setDataSelecionada(data);
      }
    } else {
      await validaSeTemIdAula(data, form);
      setDataSelecionada(data);
    }
  };

  const onChangeCampos = () => {
    if (!modoEdicao) {
      setModoEdicao(true);
    }
  };

  const onClickCancelar = async form => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );

      if (confirmou) {
        form.resetForm();
        setModoEdicao(false);
      }
    }
  };

  const salvarDiario = async form => {
    const confirmado = await pergutarParaSalvar();
    if (confirmado) {
      const salvou = await validaAntesDoSubmit(form);
      if (salvou) {
        return true;
      }
      return false;
    }
    return true;
  };

  const perguntaAoSalvarObservacao = async () => {
    return confirmar(
      'Atenção',
      '',
      'Você não salvou as observações, deseja salvar agora?'
    );
  };

  const salvarEditarObservacao = async obs => {
    const params = {
      observacao: obs.observacao,
      id: obs?.id,
    };

    if (listaUsuarios?.length && !obs?.id) {
      params.usuariosIdNotificacao = listaUsuarios.map(u => {
        return u.usuarioId;
      });
    }

    setCarregandoGeral(true);
    const diarioBordoIdSel = auditoria.id;
    return ServicoDiarioBordo.salvarEditarObservacao(diarioBordoIdSel, params)
      .then(resultado => {
        if (resultado && resultado.status === 200) {
          const msg = `Observação ${
            obs.id ? 'alterada' : 'inserida'
          } com sucesso.`;
          sucesso(msg);
        }
        setCarregandoGeral(false);

        ServicoObservacoesUsuario.atualizarSalvarEditarDadosObservacao(
          obs,
          resultado.data
        );
        return resultado;
      })
      .catch(e => {
        erros(e);
        setCarregandoGeral(false);
        return e;
      });
  };

  const salvarObservacao = async dados => {
    const confirmado = await perguntaAoSalvarObservacao();
    if (confirmado) {
      const salvou = await salvarEditarObservacao(dados);
      if (salvou) {
        return true;
      }
      return false;
    }
    return true;
  };

  const onClickVoltar = async (form, observacaoEmEdicao, novaObservacao) => {
    let validouSalvarDiario = true;
    if (modoEdicao && turmaInfantil && !desabilitarCampos) {
      validouSalvarDiario = await salvarDiario(form);
    }

    let validouSalvarObservacao = true;
    if (novaObservacao) {
      validouSalvarObservacao = await salvarObservacao({
        observacao: novaObservacao,
      });
    } else if (observacaoEmEdicao) {
      validouSalvarObservacao = await salvarObservacao(observacaoEmEdicao);
    }

    if (validouSalvarDiario && validouSalvarObservacao) {
      navigate(ROUTES.DIARIO_BORDO);
    }
  };

  const onCloseErros = () => {
    setErrosValidacao([]);
    setMostarErros(false);
  };

  const onClickFecharModal = () => {
    setExibirModalSelecionarAula(false);
  };

  const onClickSelecionarAula = aula => {
    setExibirModalSelecionarAula(false);
    if (aula) {
      setAulaSelecionada(aula);
      obterDiarioBordo(aula.aulaId, componenteCurricularSelecionado);
    }
  };

  const onClickExcluir = async () => {
    const confirmado = await confirmar(
      'Excluir',
      '',
      'Você tem certeza que deseja excluir esse diário de bordo?'
    );

    if (confirmado && auditoria) {
      setCarregandoGeral(true);
      const resultado = await ServicoDiarioBordo.excluirDiarioBordo(
        auditoria.id
      ).catch(e => {
        erros(e);
      });
      if (resultado && resultado.status === 200) {
        sucesso('Diário de bordo excluído com sucesso');
        navigate(`${ROUTES.DIARIO_BORDO}/novo`);
        setDataSelecionada();
      }
      setCarregandoGeral(false);
    }
  };

  const excluirObservacao = async obs => {
    const confirmado = await confirmar(
      'Excluir',
      '',
      'Você tem certeza que deseja excluir este registro?'
    );

    if (confirmado) {
      setCarregandoGeral(true);
      const resultado = await ServicoDiarioBordo.excluirObservacao(obs).catch(
        e => {
          erros(e);
          setCarregandoGeral(false);
        }
      );
      if (resultado && resultado.status === 200) {
        sucesso('Registro excluído com sucesso');
        ServicoDiarioBordo.atualizarExcluirDadosObservacao(obs, resultado.data);
      }
      setCarregandoGeral(false);
    }
  };

  return (
    <Loader loading={carregandoGeral} className="w-100 my-2">
      {!turmaSelecionada.turma ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'diario-bordo-selecione-turma',
            mensagem: 'Você precisa escolher uma turma',
          }}
          className="mb-2"
        />
      ) : (
        ''
      )}
      {turmaSelecionada.turma ? <AlertaPermiteSomenteTurmaInfantil /> : ''}

      {dataSelecionada && carregandoData ? (
        <AlertaPeriodoEncerrado
          exibir={!dadosDiarioBordo?.temPeriodoAberto && !somenteConsulta}
        />
      ) : (
        ''
      )}
      <ModalMultiLinhas
        key="erros-diario-bordo"
        visivel={mostrarErros}
        onClose={onCloseErros}
        type="error"
        conteudo={errosValidacao}
        titulo="Erros diário de bordo"
      />
      <ModalSelecionarAula
        visivel={exibirModalSelecionarAula}
        aulasParaSelecionar={aulasParaSelecionar}
        onClickFecharModal={onClickFecharModal}
        onClickSelecionarAula={onClickSelecionarAula}
      />
      <Formik
        enableReinitialize
        onSubmit={(v, form) => {
          salvarDiarioDeBordo(v, form);
        }}
        validationSchema={
          valoresIniciais && valoresIniciais.aulaId ? validacoes : {}
        }
        initialValues={valoresIniciais}
        validateOnBlur
        validateOnChange
        ref={refFormik => setRefForm(refFormik)}
      >
        {form => (
          <>
            <Cabecalho pagina="Diário de bordo (Intencionalidade docente)">
              <BotoesAcoesDiarioBordo
                onClickVoltar={(observacaoEmEdicao, novaObservacao) =>
                  onClickVoltar(form, observacaoEmEdicao, novaObservacao)
                }
                onClickCancelar={() => onClickCancelar(form)}
                onClickExcluir={onClickExcluir}
                validaAntesDoSubmit={() => validaAntesDoSubmit(form, true)}
                modoEdicao={modoEdicao}
                desabilitarCampos={desabilitarCampos}
                turmaInfantil={turmaInfantil}
                permissoesTela={permissoesTela}
                componenteCurricularSelecionado={
                  componenteCurricularSelecionado
                }
                dataSelecionada={dataSelecionada}
                id={auditoria?.id}
              />
            </Cabecalho>
            <Card>
              <Form>
                <div className="col-md-12 mb-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                      <SelectComponent
                        id="disciplina"
                        name="disciplinaId"
                        lista={listaComponenteCurriculares || []}
                        valueOption="codigoComponenteCurricular"
                        valueText={valorComponenteAExibir}
                        valueSelect={componenteCurricularSelecionado}
                        onChange={onChangeComponenteCurricular}
                        placeholder="Selecione um componente curricular"
                        disabled={
                          !turmaInfantil ||
                          listaComponenteCurriculares?.length === 1 ||
                          aulaId
                        }
                      />
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-3 col-xl-3 mb-3">
                      <Loader loading={carregandoData}>
                        <CampoData
                          valor={dataSelecionada}
                          onChange={data => onChangeData(data, form)}
                          placeholder="DD/MM/AAAA"
                          formatoData="DD/MM/YYYY"
                          desabilitado={
                            !turmaInfantil ||
                            !listaComponenteCurriculares?.length ||
                            !componenteCurricularSelecionado
                          }
                          diasParaHabilitar={diasParaHabilitar}
                          desabilitarData={!listaDatasAulas?.length}
                        />
                      </Loader>
                    </div>
                  </div>
                  <div className="row">
                    {turmaInfantil &&
                    componenteCurricularSelecionado &&
                    dataSelecionada ? (
                      <>
                        <div className="col-md-12 mb-2">
                          <PainelCollapse defaultActiveKey="1">
                            <PainelCollapse.Painel
                              temBorda
                              header="Planejamento reflexivo a partir das escutas"
                              key="1"
                            >
                              <>
                                {dadosDiarioBordo?.ehInseridoCJ && (
                                  <div className="d-flex justify-content-end mb-2">
                                    <MarcadorSituacao>
                                      Registro inserido pelo CJ
                                    </MarcadorSituacao>
                                  </div>
                                )}
                                <JoditEditor
                                  valideClipboardHTML={false}
                                  form={form}
                                  label={dadosDiarioBordo?.nomeComponente}
                                  value={valoresIniciais.planejamento}
                                  name="planejamento"
                                  onChange={v => {
                                    if (valoresIniciais.planejamento !== v) {
                                      onChangeCampos();
                                    }
                                  }}
                                  desabilitar={desabilitarCampos}
                                />
                                {dadosDiarioBordo?.nomeComponenteIrmao ? (
                                  <JoditEditor
                                    label={
                                      dadosDiarioBordo?.nomeComponenteIrmao
                                    }
                                    value={dadosDiarioBordo?.planejamentoIrmao}
                                    desabilitar
                                  />
                                ) : (
                                  <></>
                                )}
                              </>
                            </PainelCollapse.Painel>
                          </PainelCollapse>
                        </div>
                        <div className="col-md-12 mb-2">
                          <PainelCollapse>
                            <PainelCollapse.Painel
                              temBorda
                              header="Registros GSA"
                              key="3"
                            >
                              {valoresIniciais?.aulaId && (
                                <DadosMuralGoogleSalaAula
                                  podeAlterar={!desabilitarCampos}
                                  aulaId={valoresIniciais?.aulaId}
                                  ehTurmaInfantil
                                />
                              )}
                            </PainelCollapse.Painel>
                          </PainelCollapse>
                        </div>
                        <div className="col-md-12 mb-2">
                          <PainelCollapse>
                            <PainelCollapse.Painel
                              temBorda
                              header="Devolutivas"
                            >
                              {form &&
                              form.values &&
                              form.values.devolutivas ? (
                                <JoditEditor
                                  valideClipboardHTML={false}
                                  label="Somente leitura"
                                  form={form}
                                  value={valoresIniciais.devolutivas}
                                  name="devolutivas"
                                  removerToolbar
                                  desabilitar
                                />
                              ) : (
                                <div className="text-center p-2">
                                  Não há devolutiva registrada para este diário
                                  de bordo
                                </div>
                              )}
                            </PainelCollapse.Painel>
                          </PainelCollapse>
                        </div>
                      </>
                    ) : (
                      ''
                    )}
                    {dataSelecionada && auditoria ? (
                      <Auditoria
                        criadoEm={auditoria.criadoEm}
                        criadoPor={auditoria.criadoPor}
                        criadoRf={auditoria.criadoRF}
                        alteradoPor={auditoria.alteradoPor}
                        alteradoEm={auditoria.alteradoEm}
                        alteradoRf={auditoria.alteradoRF}
                        ignorarMarginTop
                      />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </Form>
              {dataSelecionada && auditoria?.id ? (
                <ObservacoesUsuario
                  mostrarListaNotificacao
                  salvarObservacao={obs => salvarEditarObservacao(obs)}
                  editarObservacao={obs => salvarEditarObservacao(obs)}
                  excluirObservacao={obs => excluirObservacao(obs)}
                  permissoes={permissoesTela}
                  diarioBordoId={diarioBordoId}
                  dreId={turmaSelecionada.dre}
                  ueId={turmaSelecionada.unidadeEscolar}
                />
              ) : (
                ''
              )}
            </Card>
          </>
        )}
      </Formik>
    </Loader>
  );
};

export default DiarioBordo;
