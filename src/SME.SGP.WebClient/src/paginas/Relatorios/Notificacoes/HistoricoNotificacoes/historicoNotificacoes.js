import React, { useCallback, useEffect, useState } from 'react';
import {
  Loader,
  Localizador,
  RadioGroupButton,
  SelectComponent,
} from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { URL_HOME } from '~/constantes/url';
import modalidade from '~/dtos/modalidade';
import AbrangenciaServico from '~/servicos/Abrangencia';
import { erros, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';
import history from '~/servicos/history';
import ServicoFiltroRelatorio from '~/servicos/Paginas/FiltroRelatorio/ServicoFiltroRelatorio';
import ServicoHistoricoNotificacoes from '~/servicos/Paginas/Relatorios/Historico/HistoricoNotificacoes/ServicoHistoricoNotificacoes';

const HistoricoNotificacoes = () => {
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaSemestre, setListaSemestre] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaCategorias, setListaCategorias] = useState([]);
  const [listaTipos, setListaTipos] = useState([]);
  const [listaSituacao, setListaSituacao] = useState([]);

  const [anoAtual] = useState(window.moment().format('YYYY'));
  const [anoLetivo, setAnoLetivo] = useState(anoAtual);
  const [codigoDre, setCodigoDre] = useState(undefined);
  const [codigoUe, setCodigoUe] = useState(undefined);
  const [modalidadeId, setModalidadeId] = useState(undefined);
  const [semestre, setSemestre] = useState(undefined);
  const [turmaId, setTurmaId] = useState(undefined);
  const [usuarioRf, setUsuarioRf] = useState(undefined);
  const [categorias, setCategorias] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [situacoes, setSituacoes] = useState([]);
  const [exibirDescricao, setExibirDescricao] = useState(false);
  const [
    exibirNotificacoesExcluidas,
    setExibirNotificacoesExcluidas,
  ] = useState(false);

  const [carregandoGeral, setCarregandoGeral] = useState(false);
  const [desabilitarBtnGerar, setDesabilitarBtnGerar] = useState(true);
  const [
    desabilitarDescricaoNotificacoes,
    setDesabilitarDescricaoNotificacoes,
  ] = useState(false);

  const opcoesExibirDescricao = [
    { label: 'Sim', value: true },
    { label: 'Não', value: false },
  ];

  const opcoesExibirNotificacoesExcluidas = [
    { label: 'Sim', value: true },
    { label: 'Não', value: false },
  ];

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoGeral(true);
    const anosLetivo = await AbrangenciaServico.buscarTodosAnosLetivos().catch(
      e => {
        erros(e);
        setCarregandoGeral(false);
      }
    );
    if (anosLetivo && anosLetivo.data) {
      const a = [];
      anosLetivo.data.forEach(ano => {
        a.push({ desc: ano, valor: ano });
      });
      setAnoLetivo(a[0].valor);
      setListaAnosLetivo(a);
    } else {
      setListaAnosLetivo([]);
    }
    setCarregandoGeral(false);
  }, []);

  const obterModalidades = async ue => {
    if (ue) {
      setCarregandoGeral(true);
      const retorno = await ServicoFiltroRelatorio.obterModalidadesPorAbrangencia(
        ue
      ).catch(e => {
        erros(e);
        setCarregandoGeral(false);
      });
      if (retorno && retorno.data) {
        if (retorno.data && retorno.data.length && retorno.data.length === 1) {
          setModalidadeId(retorno.data[0].valor);
        }
        setListaModalidades(retorno.data);
      }
      setCarregandoGeral(false);
    }
  };

  const obterUes = useCallback(async dre => {
    if (dre) {
      setCarregandoGeral(true);
      const retorno = await ServicoFiltroRelatorio.obterUes(dre).catch(e => {
        erros(e);
        setCarregandoGeral(false);
      });
      if (retorno?.data?.length) {
        const lista = retorno.data.map(item => ({
          desc: item.nome,
          valor: String(item.codigo),
        }));

        const novaLista = lista?.filter(item => item?.valor !== OPCAO_TODOS);

        if (novaLista?.length === 1) {
          setCodigoUe(novaLista[0].valor);
        }
        setListaUes(novaLista);
      } else {
        setListaUes([]);
      }
      setCarregandoGeral(false);
    }
  }, []);

  const onChangeDre = dre => {
    setCodigoDre(dre);

    setListaUes([]);
    setCodigoUe(undefined);

    setListaModalidades([]);
    setModalidadeId(undefined);

    setListaSemestre([]);
    setSemestre(undefined);

    setListaTurmas([]);
    setTurmaId();
  };

  const obterDres = async () => {
    setCarregandoGeral(true);
    const retorno = await ServicoFiltroRelatorio.obterDres().catch(e => {
      erros(e);
      setCarregandoGeral(false);
    });
    if (retorno?.data?.length) {
      const novaLista = retorno.data.filter(
        item => item?.codigo !== OPCAO_TODOS
      );
      setListaDres(novaLista);

      if (novaLista?.length === 1) {
        setCodigoDre(novaLista[0].codigo);
      }
    } else {
      setListaDres([]);
    }
    setCarregandoGeral(false);
  };

  const obterSemestres = async (
    modalidadeSelecionada,
    anoLetivoSelecionado
  ) => {
    setCarregandoGeral(true);
    const retorno = await api
      .get(
        `v1/abrangencias/false/semestres?anoLetivo=${anoLetivoSelecionado}&modalidade=${modalidadeSelecionada ||
          0}`
      )
      .catch(e => {
        erros(e);
        setCarregandoGeral(false);
      });
    if (retorno && retorno.data) {
      const lista = retorno.data.map(periodo => {
        return { desc: periodo, valor: periodo };
      });

      if (lista && lista.length && lista.length === 1) {
        setSemestre(lista[0].valor);
      }
      setListaSemestre(lista);
    }
    setCarregandoGeral(false);
  };

  const obterTurmas = useCallback(async () => {
    setCarregandoGeral(true);
    const resposta = await ServicoFiltroRelatorio.obterTurmasPorCodigoUeModalidadeSemestre(
      anoLetivo,
      codigoUe,
      modalidadeId,
      semestre
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoGeral(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;
      if (lista.length > 1) {
        lista.unshift({ valor: OPCAO_TODOS, descricao: 'Todas' });
      }

      setListaTurmas(lista);
      if (lista.length === 1) {
        setTurmaId(lista[0].valor);
      }
    }
  }, [anoLetivo, codigoUe, modalidadeId, semestre]);

  useEffect(() => {
    if (modalidadeId && codigoUe && anoLetivo && modalidadeId) {
      obterTurmas();
    } else {
      setTurmaId();
      setListaTurmas([]);
    }
  }, [modalidadeId, codigoUe, anoLetivo, semestre, obterTurmas]);

  useEffect(() => {
    if (codigoUe) {
      obterModalidades(codigoUe);
    } else {
      setModalidadeId(undefined);
      setListaModalidades([]);
    }
    setUsuarioRf();
  }, [codigoUe]);

  useEffect(() => {
    if (codigoDre) {
      obterUes(codigoDre);
    } else {
      setCodigoUe(undefined);
      setListaUes([]);
    }
  }, [codigoDre, obterUes]);

  useEffect(() => {
    if (modalidadeId && anoLetivo) {
      if (modalidadeId == modalidade.EJA) {
        obterSemestres(modalidadeId, anoLetivo);
      } else {
        setSemestre(undefined);
        setListaSemestre([]);
      }
    } else {
      setSemestre(undefined);
      setListaSemestre([]);
    }
  }, [modalidadeId, anoLetivo]);

  useEffect(() => {
    const desabilitar = !anoLetivo || !codigoDre || !codigoUe;

    if (modalidadeId == modalidade.EJA) {
      setDesabilitarBtnGerar(!semestre || desabilitar);
    } else {
      setDesabilitarBtnGerar(desabilitar);
    }
  }, [
    anoLetivo,
    codigoDre,
    codigoUe,
    modalidadeId,
    semestre,
    turmaId,
    usuarioRf,
    categorias,
    tipos,
    situacoes,
    exibirDescricao,
    exibirNotificacoesExcluidas,
  ]);

  const carregarListas = async () => {
    const status = await api.get('v1/notificacoes/status').catch(e => erros(e));
    if (status?.data?.length) {
      if (status.data.length > 1) {
        status.data.unshift({ descricao: 'Todas', id: OPCAO_TODOS });
      }
      setListaSituacao(status.data);
    } else {
      setListaSituacao([]);
    }

    const cat = await api
      .get('v1/notificacoes/categorias')
      .catch(e => erros(e));

    if (cat?.data?.length) {
      if (cat.data.length > 1) {
        cat.data.unshift({ descricao: 'Todas', id: OPCAO_TODOS });
      }
      setListaCategorias(cat.data);
    } else {
      setListaCategorias([]);
    }

    const tip = await api.get('v1/notificacoes/tipos').catch(e => erros(e));
    if (tip?.data?.length) {
      if (tip.data.length > 1) {
        tip.data.unshift({ descricao: 'Todos', id: OPCAO_TODOS });
      }
      setListaTipos(tip.data);
    } else {
      setListaTipos([]);
    }
  };

  useEffect(() => {
    obterAnosLetivos();
    obterDres();
    carregarListas();
  }, [obterAnosLetivos]);

  const onClickVoltar = () => {
    history.push(URL_HOME);
  };

  const onClickCancelar = () => {
    setAnoLetivo(anoAtual);
    setCodigoDre();
    setCodigoUe();
    setModalidadeId();
    setSemestre();
    setTurmaId();
    setUsuarioRf();
    setCategorias([]);
    setTipos([]);
    setSituacoes([]);
    setExibirDescricao(false);
    setExibirNotificacoesExcluidas(false);
    setDesabilitarBtnGerar(true);

    setListaAnosLetivo([]);
    setListaDres([]);
    setListaUes([]);
    setListaModalidades([]);
    setListaSemestre([]);
    setListaTurmas([]);

    obterAnosLetivos();
    obterDres();
  };

  const temOpcaoTodos = dados => {
    return dados.find(item => item === OPCAO_TODOS);
  };

  const todosOsIds = dados => {
    return dados
      .filter(item => item.id !== OPCAO_TODOS)
      .map(item => item.id.toString());
  };

  const onClickGerar = async () => {
    const categoriasSelecionadas = temOpcaoTodos(categorias)
      ? todosOsIds(listaCategorias)
      : categorias;
    const tiposSelecionadas = temOpcaoTodos(tipos)
      ? todosOsIds(listaTipos)
      : tipos;
    const situacoesSelecionadas = temOpcaoTodos(situacoes)
      ? todosOsIds(listaSituacao)
      : situacoes;

    const params = {
      anoLetivo,
      dre: codigoDre,
      ue: codigoUe,
      modalidadeTurma: modalidadeId,
      semestre,
      turma: turmaId,
      usuarioBuscaRf: usuarioRf,
      categorias: categoriasSelecionadas,
      tipos: tiposSelecionadas,
      situacoes: situacoesSelecionadas,
      exibirDescricao,
      exibirNotificacoesExcluidas,
    };

    setCarregandoGeral(true);
    const retorno = await ServicoHistoricoNotificacoes.gerar(params)
      .catch(e => erros(e))
      .finally(() => setCarregandoGeral(false));

    if (retorno && retorno.status === 200) {
      sucesso(
        'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
      );
      setDesabilitarBtnGerar(true);
    }
  };

  const onChangeUe = ue => {
    setCodigoUe(ue);

    setListaModalidades([]);
    setModalidadeId(undefined);

    setListaSemestre([]);
    setSemestre(undefined);

    setListaTurmas([]);
    setTurmaId();
  };

  const onChangeModalidade = novaModalidade => {
    setModalidadeId(novaModalidade);

    setListaSemestre([]);
    setSemestre(undefined);

    setListaTurmas([]);
    setTurmaId();
  };

  const onChangeAnoLetivo = ano => {
    setAnoLetivo(ano);

    setListaSemestre([]);
    setSemestre(undefined);

    setListaTurmas([]);
    setTurmaId();
  };

  const onChangeSemestre = valor => setSemestre(valor);

  const onchangeMultiSelect = (valores, valoreAtual, funSetarNovoValor) => {
    const opcaoTodosJaSelecionado = valoreAtual
      ? valoreAtual.includes(OPCAO_TODOS)
      : false;
    if (opcaoTodosJaSelecionado) {
      const listaSemOpcaoTodos = valores.filter(v => v !== OPCAO_TODOS);
      funSetarNovoValor(listaSemOpcaoTodos);
    } else if (valores.includes(OPCAO_TODOS)) {
      funSetarNovoValor([OPCAO_TODOS]);
    } else {
      funSetarNovoValor(valores);
    }
  };

  const onChangeTurma = valor => {
    setTurmaId(valor);
    let desabilitar = false;
    if (valor === OPCAO_TODOS && !usuarioRf) {
      desabilitar = true;
      setExibirDescricao(false);
      setExibirNotificacoesExcluidas(false);
    }
    setDesabilitarDescricaoNotificacoes(desabilitar);
  };

  return (
    <>
      <Cabecalho pagina="Relatório de notificações" />
      <Loader loading={carregandoGeral}>
        <Card>
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12 d-flex justify-content-end pb-4">
                <Button
                  id="btn-voltar"
                  label="Voltar"
                  icon="arrow-left"
                  color={Colors.Azul}
                  border
                  className="mr-2"
                  onClick={onClickVoltar}
                />
                <Button
                  id="btn-cancelar"
                  label="Cancelar"
                  color={Colors.Roxo}
                  border
                  bold
                  className="mr-3"
                  onClick={() => onClickCancelar()}
                />
                <Button
                  id="btn-gerar"
                  icon="print"
                  label="Gerar"
                  color={Colors.Azul}
                  border
                  bold
                  className="mr-2"
                  onClick={() => onClickGerar()}
                  disabled={desabilitarBtnGerar}
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3 col-xl-2 mb-2">
                <SelectComponent
                  label="Ano Letivo"
                  lista={listaAnosLetivo}
                  valueOption="valor"
                  valueText="desc"
                  disabled={listaAnosLetivo && listaAnosLetivo.length === 1}
                  onChange={onChangeAnoLetivo}
                  valueSelect={anoLetivo}
                  placeholder="Selecione o ano"
                />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-9 col-xl-5 mb-2">
                <SelectComponent
                  label="DRE"
                  lista={listaDres}
                  valueOption="codigo"
                  valueText="nome"
                  disabled={listaDres && listaDres.length === 1}
                  onChange={onChangeDre}
                  valueSelect={codigoDre}
                  placeholder="Diretoria Regional de Educação (DRE)"
                  showSearch
                />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-12 col-xl-5 mb-2">
                <SelectComponent
                  label="Unidade Escolar (UE)"
                  lista={listaUes}
                  valueOption="valor"
                  valueText="desc"
                  disabled={listaUes && listaUes.length === 1}
                  onChange={onChangeUe}
                  valueSelect={codigoUe}
                  placeholder="Unidade Escolar (UE)"
                  showSearch
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-4 col-xl-5 mb-2">
                <SelectComponent
                  label="Modalidade"
                  lista={listaModalidades}
                  valueOption="valor"
                  valueText="descricao"
                  disabled={listaModalidades && listaModalidades.length === 1}
                  onChange={onChangeModalidade}
                  valueSelect={modalidadeId}
                  placeholder="Selecione uma modalidade"
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-4 col-xl-2 mb-2">
                <SelectComponent
                  lista={listaSemestre}
                  valueOption="valor"
                  valueText="desc"
                  label="Semestre"
                  disabled={
                    !modalidadeId ||
                    modalidadeId != modalidade.EJA ||
                    (listaSemestre && listaSemestre.length === 1)
                  }
                  valueSelect={semestre}
                  onChange={onChangeSemestre}
                  placeholder="Selecione o semestre"
                />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-4 col-xl-5 mb-2">
                <SelectComponent
                  id="drop-turma"
                  lista={listaTurmas}
                  valueOption="valor"
                  valueText="descricao"
                  label="Turma"
                  disabled={
                    !modalidadeId ||
                    (listaTurmas && listaTurmas.length === 1) ||
                    usuarioRf
                  }
                  valueSelect={turmaId}
                  onChange={onChangeTurma}
                  placeholder="Turma"
                  showSearch
                />
              </div>
              <div className="col-md-12 mb-2">
                <div className="row pr-3">
                  <Localizador
                    dreId={codigoDre}
                    ueId={codigoUe}
                    rfEdicao={usuarioRf}
                    buscandoDados={setCarregandoGeral}
                    anoLetivo={anoLetivo}
                    showLabel
                    onChange={valores => {
                      if (valores && valores.professorRf) {
                        setUsuarioRf(valores.professorRf);
                        if (listaTurmas?.length > 1) {
                          setTurmaId([OPCAO_TODOS]);
                        }
                        setDesabilitarDescricaoNotificacoes(false);
                        return;
                      }
                      setUsuarioRf();
                      setTurmaId();
                    }}
                    buscarOutrosCargos
                    buscarPorAbrangencia
                  />
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 mb-2">
                <SelectComponent
                  label="Categoria"
                  id="categoria-noti"
                  lista={listaCategorias}
                  valueOption="id"
                  valueText="descricao"
                  onChange={valores => {
                    onchangeMultiSelect(valores, categorias, setCategorias);
                  }}
                  valueSelect={categorias}
                  placeholder="Categoria"
                  multiple
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 mb-2">
                <SelectComponent
                  label="Tipo"
                  id="tipo-noti"
                  lista={listaTipos}
                  valueOption="id"
                  valueText="descricao"
                  onChange={valores => {
                    onchangeMultiSelect(valores, tipos, setTipos);
                  }}
                  valueSelect={tipos}
                  placeholder="Tipo"
                  multiple
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 mb-2">
                <SelectComponent
                  label="Situação"
                  id="situacao-noti"
                  lista={listaSituacao}
                  valueOption="id"
                  valueText="descricao"
                  onChange={valores => {
                    onchangeMultiSelect(valores, situacoes, setSituacoes);
                  }}
                  valueSelect={situacoes}
                  placeholder="Situação"
                  multiple
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-2">
                <RadioGroupButton
                  label="Exibir descrição"
                  opcoes={opcoesExibirDescricao}
                  valorInicial
                  onChange={e => {
                    setExibirDescricao(e.target.value);
                  }}
                  value={exibirDescricao}
                  desabilitado={desabilitarDescricaoNotificacoes}
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-2">
                <RadioGroupButton
                  label="Exibir notificações excluídas"
                  opcoes={opcoesExibirNotificacoesExcluidas}
                  valorInicial
                  onChange={e => {
                    setExibirNotificacoesExcluidas(e.target.value);
                  }}
                  value={exibirNotificacoesExcluidas}
                  desabilitado={desabilitarDescricaoNotificacoes}
                />
              </div>
            </div>
          </div>
        </Card>
      </Loader>
    </>
  );
};

export default HistoricoNotificacoes;
