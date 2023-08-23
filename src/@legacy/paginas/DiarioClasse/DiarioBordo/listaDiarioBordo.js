import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shortid from 'shortid';
import {
  Base,
  Button,
  CampoData,
  Card,
  Colors,
  JoditEditor,
  Loader,
  PainelCollapse,
  SelectComponent,
} from '~/componentes';
import { Cabecalho, Paginacao } from '~/componentes-sgp';
import ObservacoesUsuario from '~/componentes-sgp/ObservacoesUsuario/observacoesUsuario';
import ServicoObservacoesUsuario from '~/componentes-sgp/ObservacoesUsuario/ServicoObservacoesUsuario';
import { RotasDto } from '~/dtos';
import {
  limparDadosObservacoesUsuario,
  setDadosObservacoesUsuario,
} from '~/redux/modulos/observacoesUsuario/actions';
import {
  confirmar,
  ehTurmaInfantil,
  erros,
  ServicoDisciplina,
  sucesso,
  verificaSomenteConsulta,
} from '~/servicos';
import ServicoDiarioBordo from '~/servicos/Paginas/DiarioClasse/ServicoDiarioBordo';
import { Mensagens } from './componentes';
import { erro } from '~/servicos/alertas';
import { SGP_BUTTON_NOVO } from '~/constantes/ids/button';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { useNavigate } from 'react-router-dom';

const ListaDiarioBordo = () => {
  const navigate = useNavigate();

  const [carregandoGeral, setCarregandoGeral] = useState(false);
  const [turmaInfantil, setTurmaInfantil] = useState(false);
  const [listaComponenteCurriculares, setListaComponenteCurriculares] =
    useState();
  const [componenteCurricularSelecionado, setComponenteCurricularSelecionado] =
    useState();
  const [dataFinal, setDataFinal] = useState();
  const [dataInicial, setDataInicial] = useState();
  const [diarioBordoAtual, setDiarioBordoAtual] = useState();
  const [carregandoCollapse, setCarregandoCollapse] = useState(false);
  const [listaTitulos, setListaTitulos] = useState();
  const [numeroPagina, setNumeroPagina] = useState(1);
  const [carregarListaUsuariosNotificar, setCarregarListaUsuariosNotificar] =
    useState(false);
  const [resetInitialState, setResetInitialState] = useState(false);
  const usuario = useSelector(state => state.usuario);
  const { turmaSelecionada } = usuario;
  const permissoesTela = usuario.permissoes[RotasDto.DIARIO_BORDO];
  const turmaId = turmaSelecionada?.id || 0;
  const turma = turmaSelecionada?.turma || 0;
  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );
  const listaUsuarios = useSelector(
    store => store.observacoesUsuario.listaUsuariosNotificacao
  );

  const dispatch = useDispatch();

  const obterComponentesCurriculares = useCallback(async () => {
    setComponenteCurricularSelecionado(undefined);
    setCarregandoGeral(true);
    const componentes = await ServicoDisciplina.obterDisciplinasPorTurma(
      turma,
      false
    ).catch(e => erros(e));

    if (componentes?.data?.length) {
      setListaComponenteCurriculares(componentes.data);

      if (componentes.data.length === 1) {
        const componente = componentes.data[0];
        setComponenteCurricularSelecionado(
          String(componente.codigoComponenteCurricular)
        );
      }
    }

    setCarregandoGeral(false);
  }, [turma]);

  useEffect(() => {
    const naoSetarSomenteConsultaNoStore = !ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );
    verificaSomenteConsulta(permissoesTela, naoSetarSomenteConsultaNoStore);
  }, [permissoesTela, turmaSelecionada]);

  const numeroRegistros = 10;
  const numeroTotalRegistros = listaTitulos?.totalRegistros;
  const mostrarPaginacao = numeroTotalRegistros > numeroRegistros;

  useEffect(() => {
    if (turma && turmaInfantil) {
      obterComponentesCurriculares();
    }
    setListaComponenteCurriculares([]);
    setComponenteCurricularSelecionado(undefined);
  }, [turma, obterComponentesCurriculares, turmaInfantil]);

  useEffect(() => {
    const infantil = ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );
    setTurmaInfantil(infantil);
    setListaTitulos();
  }, [turmaSelecionada, modalidadesFiltroPrincipal, turmaInfantil]);

  const onChangeComponenteCurricular = valor => {
    setNumeroPagina(1);
    setResetInitialState(true);
    setComponenteCurricularSelecionado(valor);

    if (!valor) {
      setListaTitulos([]);
    }
  };

  const onClickConsultarDiario = () => {
    dispatch(limparDadosObservacoesUsuario());
    navigate(
      `${RotasDto.DIARIO_BORDO}/detalhes/${diarioBordoAtual?.aulaId}/${diarioBordoAtual?.id}/${componenteCurricularSelecionado}`
    );
  };

  const obterTitulos = useCallback(
    async (dataInicio, dataFim) => {
      setCarregandoGeral(true);
      setResetInitialState(false);
      const retorno = await ServicoDiarioBordo.obterTitulosDiarioBordo({
        turmaId,
        componenteCurricularId: componenteCurricularSelecionado,
        dataInicio,
        dataFim,
        numeroPagina,
        numeroRegistros,
      })
        .catch(e => erros(e))
        .finally(() => setCarregandoGeral(false));

      if (retorno?.status === 200) {
        setListaTitulos(retorno.data);
      }
    },
    [componenteCurricularSelecionado, turmaId, numeroPagina]
  );

  const consultarDados = useCallback(
    resetarPaginacao => {
      if (
        ((dataInicial && dataFinal && dataFinal >= dataInicial) ||
          (!dataInicial && !dataFinal) ||
          (dataInicial && !dataFinal) ||
          (!dataInicial && dataFinal)) &&
        componenteCurricularSelecionado &&
        numeroPagina
      ) {
        const dataIncialFormatada =
          dataInicial && dataInicial.format('MM-DD-YYYY');
        const dataFinalFormatada = dataFinal && dataFinal.format('MM-DD-YYYY');
        if (resetarPaginacao) {
          setResetInitialState(true);
          if (numeroPagina !== 1) {
            setNumeroPagina(1);
          } else {
            obterTitulos(dataIncialFormatada, dataFinalFormatada);
          }
        } else {
          obterTitulos(dataIncialFormatada, dataFinalFormatada);
        }
      }
    },
    [dataInicial, dataFinal, componenteCurricularSelecionado, numeroPagina]
  );

  useEffect(() => {
    consultarDados(true);
  }, [dataInicial, dataFinal, componenteCurricularSelecionado]);

  useEffect(() => {
    consultarDados();
  }, [numeroPagina]);

  const onChangePaginacao = pagina => {
    setNumeroPagina(pagina);
  };

  const obterUsuariosNotificar = async diarioBordoId => {
    return ServicoDiarioBordo.obterNotificarUsuarios({
      turmaId,
      observacaoId: '',
      diarioBordoId,
    }).catch(e => erros(e));
  };

  const onColapse = async aulaId => {
    dispatch(limparDadosObservacoesUsuario());
    setDiarioBordoAtual();
    let aulaIdFormatado = '';

    if (Array.isArray(aulaId) && aulaId?.length) {
      aulaIdFormatado = Number(aulaId?.[0]?.split('-').pop());
    }

    if (aulaId && typeof aulaId === 'string') {
      aulaIdFormatado = Number(aulaId?.split('-').pop());
    }

    const diario = listaTitulos?.items?.find(
      item => item?.aulaId === aulaIdFormatado
    );
    const idDiario = diario?.id;
    let dados = {};
    let observacoes = [];

    setCarregandoCollapse(true);
    dados = idDiario
      ? await ServicoDiarioBordo.obterDiarioBordoDetalhes(idDiario)
      : await ServicoDiarioBordo.obterDiarioBordo(
          aulaIdFormatado,
          componenteCurricularSelecionado
        );
    if (dados?.data) {
      if (dados?.data?.observacoes?.length) {
        observacoes = ServicoObservacoesUsuario.obterUsuarioPorObservacao(
          dados.data.observacoes,
          true
        );
        dispatch(setDadosObservacoesUsuario(observacoes));
      }
      setDiarioBordoAtual({
        ...dados.data,
        observacoes,
      });
      setCarregarListaUsuariosNotificar(true);
    }

    setCarregandoCollapse(false);
  };

  const salvarEditarObservacao = async valor => {
    const params = {
      observacao: valor.observacao,
      id: valor.id,
    };
    let observacaoId = valor.id;
    let usuariosNotificacao = [];

    if (listaUsuarios?.length && !observacaoId) {
      usuariosNotificacao = listaUsuarios;
      params.usuariosIdNotificacao = listaUsuarios.map(u => {
        return u.usuarioId;
      });
    }

    setCarregandoGeral(true);
    const resultado = await ServicoDiarioBordo.salvarEditarObservacao(
      diarioBordoAtual?.id,
      params
    ).catch(e => {
      erros(e);
      setCarregandoGeral(false);
    });
    if (resultado?.status === 200) {
      sucesso(`Observação ${valor.id ? 'alterada' : 'inserida'} com sucesso`);
      if (!observacaoId) {
        observacaoId = resultado.data.id;
      }

      ServicoObservacoesUsuario.atualizarSalvarEditarDadosObservacao(
        valor,
        resultado.data
      );

      if (valor?.id) {
        setDiarioBordoAtual(estadoAntigo => {
          const observacoes = estadoAntigo.observacoes.map(estado => {
            if (estado.id === observacaoId) {
              return {
                ...estado,
                usuariosNotificacao,
                listagemDiario: true,
              };
            }
            return estado;
          });

          return {
            ...estadoAntigo,
            observacoes,
          };
        });
      }

      setCarregandoGeral(false);
      return resultado;
    }
    setCarregandoGeral(false);
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

  const desabilitarData = current => {
    const dataInicioAnoAtual = window.moment(
      new Date(`${turmaSelecionada.anoLetivo}-01-01 00:00:00`)
    );
    const dataFimAnoAtual = window.moment(
      new Date(`${turmaSelecionada.anoLetivo}-12-31 00:00:00`)
    );
    if (current) {
      return current < dataInicioAnoAtual || current >= dataFimAnoAtual;
    }
    return false;
  };

  const onClickVoltar = () => {
    navigate('/');
  };
  const onClickNovo = () => {
    navigate(`${RotasDto.DIARIO_BORDO}/novo`);
  };

  const validarSetarDataFinal = async data => {
    if (dataInicial && window.moment(data) < window.moment(dataInicial)) {
      erro('A data final deve ser maior ou igual a data inicial.');
      setDataFinal('');
    } else setDataFinal(data);
  };

  useEffect(() => {
    if (dataFinal) validarSetarDataFinal(dataFinal);
  }, [dataInicial]);

  return (
    <Loader loading={carregandoGeral} className="w-100">
      <Mensagens />
      <Cabecalho pagina="Diário de bordo (Intencionalidade docente)">
        <>
          <BotaoVoltarPadrao className="mr-2" onClick={onClickVoltar} />
          <Button
            id={SGP_BUTTON_NOVO}
            label="Novo"
            color={Colors.Roxo}
            bold
            onClick={onClickNovo}
            disabled={
              !permissoesTela.podeIncluir ||
              !turmaInfantil ||
              !listaComponenteCurriculares
            }
          />
        </>
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <div className="row">
            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-4">
              <SelectComponent
                id="disciplina"
                name="disciplinaId"
                lista={listaComponenteCurriculares || []}
                valueOption="codigoComponenteCurricular"
                valueText="nomeComponenteInfantil"
                valueSelect={componenteCurricularSelecionado}
                onChange={onChangeComponenteCurricular}
                placeholder="Selecione um componente curricular"
                disabled={
                  !turmaId ||
                  !turmaInfantil ||
                  (listaComponenteCurriculares &&
                    listaComponenteCurriculares.length === 1)
                }
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-4 col-lg-3 col-xl-3 mb-4">
              <CampoData
                valor={dataInicial}
                onChange={data => setDataInicial(data)}
                name="dataInicial"
                placeholder="DD/MM/AAAA"
                formatoData="DD/MM/YYYY"
                desabilitado={
                  !turmaInfantil ||
                  !listaComponenteCurriculares ||
                  !componenteCurricularSelecionado
                }
                desabilitarData={desabilitarData}
              />
            </div>
            <div className="col-sm-12 col-md-4 col-lg-3 col-xl-3 mb-4">
              <CampoData
                valor={dataFinal}
                onChange={data => validarSetarDataFinal(data)}
                name="dataFinal"
                placeholder="DD/MM/AAAA"
                formatoData="DD/MM/YYYY"
                desabilitado={
                  !turmaInfantil ||
                  !listaComponenteCurriculares ||
                  !componenteCurricularSelecionado
                }
                desabilitarData={desabilitarData}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 mb-3">
              <PainelCollapse accordion onChange={onColapse}>
                {listaTitulos?.items?.map(item => {
                  const { id, titulo, pendente, aulaId } = item;
                  const bordaCollapse = pendente
                    ? Base.LaranjaStatus
                    : Base.AzulBordaCollapse;
                  return (
                    <PainelCollapse.Painel
                      key={`${componenteCurricularSelecionado}-${aulaId}`}
                      accordion
                      espacoPadrao
                      corBorda={bordaCollapse}
                      temBorda
                      header={titulo}
                      ehPendente={pendente}
                    >
                      <Loader loading={carregandoCollapse} tip="">
                        <div className="row ">
                          <div className="col-sm-12 mb-3">
                            <JoditEditor
                              id={`${id}-editor-planejamento`}
                              name="planejamento"
                              label={diarioBordoAtual?.nomeComponente}
                              value={diarioBordoAtual?.planejamento}
                              desabilitar
                            />
                          </div>
                          {diarioBordoAtual?.nomeComponenteIrmao ? (
                            <div className="col-sm-12 mb-3">
                              <JoditEditor
                                id={`${id}-editor-planejamento`}
                                name="nomeComponenteIrmao"
                                label={diarioBordoAtual?.nomeComponenteIrmao}
                                value={diarioBordoAtual?.planejamentoIrmao}
                                desabilitar
                              />
                            </div>
                          ) : (
                            <></>
                          )}
                          <div className="col-sm-12 d-flex justify-content-end mb-4">
                            <Button
                              id={shortid.generate()}
                              label={
                                id
                                  ? 'Consultar diário completo'
                                  : 'Inserir novo diário'
                              }
                              icon="book"
                              color={Colors.Azul}
                              border
                              onClick={onClickConsultarDiario}
                              disabled={!diarioBordoAtual}
                            />
                          </div>
                          <div className="col-sm-12 p-0 position-relative">
                            <ObservacoesUsuario
                              esconderLabel={pendente}
                              esconderCaixaExterna={pendente}
                              desabilitarBotaoNotificar={pendente}
                              mostrarListaNotificacao={!pendente}
                              salvarObservacao={obs =>
                                salvarEditarObservacao(obs)
                              }
                              editarObservacao={obs =>
                                salvarEditarObservacao(obs)
                              }
                              obterUsuariosNotificar={() =>
                                !pendente && obterUsuariosNotificar(id)
                              }
                              carregarListaUsuariosNotificar={
                                carregarListaUsuariosNotificar
                              }
                              excluirObservacao={obs => excluirObservacao(obs)}
                              permissoes={permissoesTela}
                              diarioBordoId={id}
                              dreId={turmaSelecionada.dre}
                              ueId={turmaSelecionada.unidadeEscolar}
                            />
                          </div>
                        </div>
                      </Loader>
                    </PainelCollapse.Painel>
                  );
                })}
              </PainelCollapse>
            </div>
          </div>
          {mostrarPaginacao && (
            <div className="row">
              <div className="col-12 d-flex justify-content-center mt-4">
                <Paginacao
                  numeroRegistros={numeroTotalRegistros}
                  pageSize={10}
                  onChangePaginacao={onChangePaginacao}
                  resetInitialState={resetInitialState}
                  setResetInitialState={setResetInitialState}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </Loader>
  );
};

export default ListaDiarioBordo;
