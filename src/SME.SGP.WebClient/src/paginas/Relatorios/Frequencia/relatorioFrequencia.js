import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Button,
  CampoNumero,
  Card,
  Colors,
  Loader,
  RadioGroupButton,
  SelectComponent,
} from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';

import { URL_HOME, OPCAO_TODOS } from '~/constantes';
import { ModalidadeDTO } from '~/dtos';
import { onchangeMultiSelect, primeiroMaisculo } from '~/utils';

import {
  erros,
  sucesso,
  AbrangenciaServico,
  api,
  history,
  ServicoRelatorioFrequencia,
  ServicoFiltroRelatorio,
  ServicoComponentesCurriculares,
} from '~/servicos';

const RelatorioFrequencia = () => {
  const [anoLetivo, setAnoLetivo] = useState(undefined);
  const [anosEscolares, setAnosEscolares] = useState(undefined);
  const [bimestres, setBimestres] = useState(undefined);
  const [carregandoAnosEscolares, setCarregandoAnosEscolares] = useState(false);
  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoBimestres, setCarregandoBimestres] = useState(false);
  const [
    carregandoComponentesCurriculares,
    setCarregandoComponentesCurriculares,
  ] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoGeral, setCarregandoGeral] = useState(false);
  const [carregandoModalidade, setCarregandoModalidade] = useState(false);
  const [carregandoSemestres, setCarregandoSemestres] = useState(false);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [codigoDre, setCodigoDre] = useState(undefined);
  const [codigoUe, setCodigoUe] = useState(undefined);
  const [componentesCurriculares, setComponentesCurriculares] = useState(
    undefined
  );
  const [condicao, setCondicao] = useState(undefined);
  const [desabilitarBtnGerar, setDesabilitarBtnGerar] = useState(true);
  const [desabilitarTipoRelatorio, setDesabilitarTipoRelatorio] = useState(
    false
  );
  const [formato, setFormato] = useState('1');
  const [listaAnosEscolares, setListaAnosEscolares] = useState([]);
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaBimestre, setListaBimestre] = useState([]);
  const [listaComponenteCurricular, setListaComponenteCurricular] = useState(
    []
  );
  const [listaDres, setListaDres] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaSemestre, setListaSemestre] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [modalidadeId, setModalidadeId] = useState(undefined);
  const [semestre, setSemestre] = useState(undefined);
  const [tipoRelatorio, setTipoRelatorio] = useState('1');
  const [turmasCodigo, setTurmasCodigo] = useState();
  const [turmasPrograma, setTurmasPrograma] = useState(true);
  const [valorCondicao, setValorCondicao] = useState(undefined);
  const [desabilitarSemestre, setDesabilitarSemestre] = useState(false);

  const TIPO_RELATORIO = useMemo(
    () => ({
      TURMA: '1',
      ANO: '2',
    }),
    []
  );
  const FORMATOS = {
    PDF: '1',
    EXCEL: '4',
  };
  const OPCAO_TODOS_ESTUDANTES = '4';
  const ehTurma = tipoRelatorio === TIPO_RELATORIO.TURMA;

  const opcoesListarTurmasDePrograma = [
    { label: 'Sim', value: true },
    { label: 'Não', value: false },
  ];
  const opcoesTipoRelatorio = Object.keys(TIPO_RELATORIO).map(chave => ({
    label: primeiroMaisculo(chave),
    value: TIPO_RELATORIO[chave],
  }));

  const opcoesListaFormatos = Object.keys(FORMATOS).map(chave => ({
    label: chave,
    value: FORMATOS[chave],
  }));

  const [listaCondicao] = useState([
    { valor: '1', desc: 'Igual' },
    { valor: '2', desc: 'Maior ' },
    { valor: '3', desc: 'Menor' },
    { valor: OPCAO_TODOS_ESTUDANTES, desc: 'Todos os estudantes' },
  ]);

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnosLetivos(true);
    const anosLetivo = await AbrangenciaServico.buscarTodosAnosLetivos()
      .catch(e => erros(e))
      .finally(() => setCarregandoAnosLetivos(false));

    if (anosLetivo?.data) {
      const lista = anosLetivo.data.map(ano => ({ desc: ano, valor: ano }));
      setAnoLetivo(lista[0].valor);
      setListaAnosLetivo(lista);
      return;
    }
    setListaAnosLetivo([]);
  }, []);

  const obterModalidades = async ue => {
    if (ue) {
      setCarregandoModalidade(true);
      const retorno = await ServicoFiltroRelatorio.obterModalidadesPorAbrangencia(
        ue
      )
        .catch(e => {
          erros(e);
        })
        .finally(() => setCarregandoModalidade(false));

      if (retorno?.data) {
        if (retorno.data.length === 1) {
          setModalidadeId(retorno.data[0].valor);
        }
        setListaModalidades(retorno.data);
      }
    }
  };

  const obterUes = useCallback(async dre => {
    if (dre) {
      setCarregandoUes(true);
      const retorno = await ServicoFiltroRelatorio.obterUes(dre)
        .catch(e => {
          erros(e);
        })
        .finally(() => setCarregandoUes(false));

      if (retorno?.data) {
        const lista = retorno.data.map(item => ({
          desc: item.nome,
          valor: String(item.codigo),
        }));

        if (lista?.length === 1) {
          setCodigoUe(lista[0].valor);
        }
        setListaUes(lista);
        return;
      }
      setListaUes([]);
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

    setListaAnosEscolares([]);
    setAnosEscolares(undefined);
  };

  const obterDres = async () => {
    setCarregandoDres(true);
    const retorno = await ServicoFiltroRelatorio.obterDres()
      .catch(e => erros(e))
      .finally(() => setCarregandoDres(false));

    if (retorno?.data?.length) {
      setListaDres(retorno.data);

      if (retorno.data.length === 1) {
        setCodigoDre(retorno.data[0].codigo);
      }
      return;
    }
    setListaDres([]);
  };

  const obterSemestres = async (
    modalidadeSelecionada,
    anoLetivoSelecionado
  ) => {
    setCarregandoSemestres(true);
    const retorno = await api
      .get(
        `v1/abrangencias/false/semestres?anoLetivo=${anoLetivoSelecionado}&modalidade=${modalidadeSelecionada ||
          0}`
      )
      .catch(e => erros(e))
      .finally(() => setCarregandoSemestres(false));

    if (retorno?.data) {
      const lista = retorno.data.map(periodo => ({
        desc: periodo,
        valor: periodo,
      }));

      if (lista?.length === 1) {
        setSemestre(lista[0].valor);
      }
      setListaSemestre(lista);
    }
  };

  useEffect(() => {
    if (codigoUe) {
      obterModalidades(codigoUe);
      return;
    }
    setModalidadeId(undefined);
    setListaModalidades([]);
  }, [codigoUe]);

  useEffect(() => {
    if (codigoDre) {
      obterUes(codigoDre);
      return;
    }
    setCodigoUe(undefined);
    setListaUes([]);
  }, [codigoDre, obterUes]);

  const obterAnosEscolares = useCallback(async (mod, ue) => {
    if (
      Number(mod) === ModalidadeDTO.EJA ||
      Number(mod) === ModalidadeDTO.INFANTIL
    ) {
      setListaAnosEscolares([{ descricao: 'Todos', valor: OPCAO_TODOS }]);
      setAnosEscolares([OPCAO_TODOS]);
    } else {
      setCarregandoAnosEscolares(true);
      const respota = await ServicoFiltroRelatorio.obterAnosEscolares(ue, mod)
        .catch(e => erros(e))
        .finally(() => setCarregandoAnosEscolares(false));

      if (respota?.data?.length) {
        setListaAnosEscolares(respota.data);

        if (respota.data.length === 1) {
          setAnosEscolares(respota.data[0].valor);
        }
        return;
      }
      setListaAnosEscolares([]);
    }
  }, []);

  useEffect(() => {
    if (modalidadeId && codigoUe && tipoRelatorio === TIPO_RELATORIO.ANO) {
      obterAnosEscolares(modalidadeId, codigoUe);
      return;
    }
    setAnosEscolares(undefined);
    setListaAnosEscolares([]);
  }, [
    modalidadeId,
    codigoUe,
    tipoRelatorio,
    TIPO_RELATORIO,
    obterAnosEscolares,
  ]);

  useEffect(() => {
    if (condicao === OPCAO_TODOS_ESTUDANTES) {
      setValorCondicao();
    }
  }, [condicao]);

  useEffect(() => {
    const selecionouTodos = anosEscolares?.find(ano => ano === OPCAO_TODOS);
    if (!selecionouTodos) {
      setTurmasPrograma(false);
    }
  }, [anosEscolares]);

  const obterCodigoTodosAnosEscolares = useCallback(() => {
    let todosAnosEscolares = anosEscolares;
    const selecionouTodos = anosEscolares?.find(ano => ano === OPCAO_TODOS);
    if (selecionouTodos) {
      todosAnosEscolares = listaAnosEscolares.map(item => item.valor);
    }
    return todosAnosEscolares;
  }, [anosEscolares]);

  const obterCodigoTodosComponentesCorriculares = () => {
    let todosComponentesCurriculares = componentesCurriculares;
    const selecionouTodos = componentesCurriculares.find(
      ano => ano === OPCAO_TODOS
    );
    if (selecionouTodos) {
      todosComponentesCurriculares = listaComponenteCurricular.map(
        item => item.valor
      );
    }
    return todosComponentesCurriculares;
  };

  const escolherChamadaEndpointComponeteCurricular = useCallback(() => {
    if (ehTurma) {
      const turmas =
        turmasCodigo === OPCAO_TODOS ? [OPCAO_TODOS] : turmasCodigo;
      return ServicoComponentesCurriculares.obterComponetensCuricularesPorTurma(
        codigoUe,
        turmas
      );
    }
    const codigoTodosAnosEscolares = obterCodigoTodosAnosEscolares();
    return ServicoComponentesCurriculares.obterComponetensCuriculares(
      codigoUe,
      modalidadeId,
      anoLetivo,
      codigoTodosAnosEscolares,
      turmasPrograma
    );
  }, [
    modalidadeId,
    anoLetivo,
    codigoUe,
    turmasPrograma,
    ehTurma,
    obterCodigoTodosAnosEscolares,
    turmasCodigo,
  ]);

  const obterComponenteCurricular = useCallback(async () => {
    if (anoLetivo) {
      setCarregandoComponentesCurriculares(true);
      const retorno = await escolherChamadaEndpointComponeteCurricular()
        .catch(e => erros(e))
        .finally(() => setCarregandoComponentesCurriculares(false));
      if (retorno?.data?.length) {
        const lista = retorno.data.map(item => ({
          desc: item.descricao,
          valor: String(item.codigo),
        }));

        setListaComponenteCurricular(lista);
        if (lista?.length === 1) {
          setComponentesCurriculares([lista[0].valor]);
        }
        return;
      }
      setListaComponenteCurricular([]);
    }
  }, [anoLetivo, escolherChamadaEndpointComponeteCurricular]);

  useEffect(() => {
    const permiteChamadaEndpoint =
      (ehTurma && turmasCodigo) || anosEscolares?.length;
    if (modalidadeId && permiteChamadaEndpoint) {
      obterComponenteCurricular();
      return;
    }
    setComponentesCurriculares(undefined);
    setListaComponenteCurricular([]);
  }, [
    modalidadeId,
    ehTurma,
    anosEscolares,
    turmasCodigo,
    obterComponenteCurricular,
  ]);

  const obterBimestres = useCallback(async () => {
    setCarregandoBimestres(true);
    const retorno = await ServicoFiltroRelatorio.obterBimestres({
      modalidadeId,
      opcaoTodos: true,
      opcaoFinal: true,
    })
      .catch(e => erros(e))
      .finally(setCarregandoBimestres(false));

    if (retorno?.data) {
      const lista = retorno.data.map(item => ({
        desc: item.descricao,
        valor: item.valor,
      }));
      setListaBimestre(lista);
    }
  }, [modalidadeId]);

  useEffect(() => {
    if (modalidadeId) {
      obterBimestres();
      return;
    }
    setListaBimestre([]);
    setBimestres(undefined);
  }, [modalidadeId, obterBimestres]);

  useEffect(() => {
    if (
      modalidadeId &&
      anoLetivo &&
      Number(modalidadeId) === ModalidadeDTO.EJA
    ) {
      obterSemestres(modalidadeId, anoLetivo);
      return;
    }
    setSemestre(undefined);
    setListaSemestre([]);
  }, [modalidadeId, anoLetivo]);

  useEffect(() => {
    const desabilitado =
      String(modalidadeId) === String(ModalidadeDTO.EJA) && !semestre;

    setDesabilitarSemestre(desabilitado);
  }, [modalidadeId, semestre]);

  useEffect(() => {
    let desabilitar =
      !anoLetivo ||
      !codigoDre ||
      !codigoUe ||
      !modalidadeId ||
      desabilitarSemestre ||
      (!ehTurma && !anosEscolares) ||
      (ehTurma && !turmasCodigo?.length) ||
      !componentesCurriculares ||
      !bimestres ||
      !condicao;

    if (!desabilitar && condicao !== OPCAO_TODOS_ESTUDANTES) {
      desabilitar = !valorCondicao;
    }

    if (Number(modalidadeId) === ModalidadeDTO.EJA) {
      setDesabilitarBtnGerar(!semestre || desabilitar);
      return;
    }
    setDesabilitarBtnGerar(desabilitar);
  }, [
    anoLetivo,
    codigoDre,
    codigoUe,
    modalidadeId,
    semestre,
    desabilitarSemestre,
    anosEscolares,
    turmasCodigo,
    componentesCurriculares,
    bimestres,
    tipoRelatorio,
    condicao,
    valorCondicao,
    ehTurma,
  ]);

  useEffect(() => {
    obterAnosLetivos();
    obterDres();
  }, [obterAnosLetivos]);

  const onClickVoltar = () => {
    history.push(URL_HOME);
  };

  const onClickCancelar = () => {
    const anoAtual = listaAnosLetivo?.length && listaAnosLetivo[0].valor;
    setAnoLetivo(anoAtual);
    setCodigoDre();
    setTipoRelatorio(TIPO_RELATORIO.TURMA);
    setCondicao(undefined);
    setValorCondicao(undefined);
    setFormato(FORMATOS.PDF);
  };

  const onClickGerar = async () => {
    setCarregandoGeral(true);

    const codigoTodosAnosEscolares = obterCodigoTodosAnosEscolares();
    const codigoTodosComponentesCorriculares = obterCodigoTodosComponentesCorriculares();

    const params = {
      anoLetivo,
      codigoDre,
      codigoUe,
      modalidade: modalidadeId,
      semestre,
      anosEscolares: codigoTodosAnosEscolares,
      componentesCurriculares: codigoTodosComponentesCorriculares,
      bimestres: [bimestres],
      tipoRelatorio,
      condicao,
      valorCondicao,
      tipoFormatoRelatorio: formato,
      turmasPrograma,
    };
    setCarregandoGeral(true);
    const retorno = await ServicoRelatorioFrequencia.gerar(params)
      .catch(e => {
        erros(e);
      })
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

    setListaAnosEscolares([]);
    setAnosEscolares(undefined);

    setTipoRelatorio(TIPO_RELATORIO.TURMA);
    setDesabilitarTipoRelatorio(ue !== OPCAO_TODOS);
  };

  const onChangeModalidade = novaModalidade => {
    setModalidadeId(novaModalidade);

    setListaSemestre([]);
    setSemestre(undefined);

    setListaAnosEscolares([]);
    setAnosEscolares(undefined);
  };

  const onChangeAnoLetivo = ano => {
    setAnoLetivo(ano);

    setListaSemestre([]);
    setSemestre(undefined);

    setListaComponenteCurricular([]);
    setComponentesCurriculares(undefined);
  };

  const onChangeAnos = valor => {
    setAnosEscolares(valor);

    setListaComponenteCurricular([]);
    setComponentesCurriculares(undefined);
  };

  const onChangeSemestre = valor => setSemestre(valor);
  const onChangeComponenteCurricular = valor =>
    setComponentesCurriculares(valor);
  const onChangeBimestre = valor => setBimestres(valor);
  const onChangeCondicao = valor => setCondicao(valor);
  const onChangeComparacao = valor => setValorCondicao(valor);

  const removeAdicionaOpcaoTodos = (
    valoresJaSelcionados,
    valoresParaSelecionar
  ) => {
    const todosEhUnicoJaSelecionado =
      valoresJaSelcionados &&
      valoresJaSelcionados.length === 1 &&
      valoresJaSelcionados[0] === OPCAO_TODOS;

    if (
      todosEhUnicoJaSelecionado &&
      valoresParaSelecionar &&
      valoresParaSelecionar.length > 1 &&
      valoresParaSelecionar.includes(OPCAO_TODOS)
    ) {
      valoresParaSelecionar = valoresParaSelecionar.filter(
        item => item !== OPCAO_TODOS
      );
    }

    if (
      !todosEhUnicoJaSelecionado &&
      valoresParaSelecionar &&
      valoresParaSelecionar.length &&
      valoresParaSelecionar.length > 1 &&
      valoresParaSelecionar.includes(OPCAO_TODOS)
    ) {
      valoresParaSelecionar = valoresParaSelecionar.filter(
        item => item === OPCAO_TODOS
      );
    }

    return valoresParaSelecionar;
  };

  const onChangeTurma = valor => {
    setTurmasCodigo(valor);
    setBimestres(undefined);
  };

  const obterTurmas = useCallback(async () => {
    const OPCAO_TODAS_TURMA = { valor: OPCAO_TODOS, nomeFiltro: 'Todas' };
    if (codigoUe === OPCAO_TODOS) {
      setListaTurmas([OPCAO_TODAS_TURMA]);
      setTurmasCodigo([OPCAO_TODAS_TURMA.valor]);
      return;
    }
    if (codigoDre && codigoUe && modalidadeId) {
      setCarregandoTurmas(true);
      const retorno = await AbrangenciaServico.buscarTurmas(
        codigoUe,
        modalidadeId,
        '',
        anoLetivo,
        false,
        false
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoTurmas(false));

      if (retorno?.data?.length) {
        const lista = retorno.data.map(item => ({
          desc: item.nome,
          valor: item.codigo,
          id: item.id,
          ano: item.ano,
          nomeFiltro: item.nomeFiltro,
        }));

        if (lista.length === 1) {
          setTurmasCodigo([String(lista[0].valor)]);
        } else {
          lista.unshift(OPCAO_TODAS_TURMA);
        }

        setListaTurmas(lista);
      }
    }
  }, [codigoDre, codigoUe, anoLetivo, modalidadeId]);

  useEffect(() => {
    if (codigoUe) {
      obterTurmas();
      return;
    }
    setTurmasCodigo();
    setListaTurmas([]);
  }, [codigoUe, obterTurmas]);

  useEffect(() => {
    if (ehTurma) {
      setFormato(FORMATOS.PDF);
      setTurmasPrograma(true);

      if (codigoUe === OPCAO_TODOS) {
        setTurmasCodigo(OPCAO_TODOS);
      }
      return;
    }
    setTurmasCodigo(undefined);
  }, [ehTurma, FORMATOS, codigoUe]);

  return (
    <>
      <Cabecalho pagina="Frequência" classes="mb-2" />
      <Loader loading={carregandoGeral}>
        <Card>
          <div className="col-md-12 p-0">
            <div className="row">
              <div className="col-md-12 d-flex justify-content-end pb-4">
                <Button
                  id="btn-voltar-frequencia"
                  label="Voltar"
                  icon="arrow-left"
                  color={Colors.Azul}
                  border
                  className="mr-2"
                  onClick={onClickVoltar}
                />
                <Button
                  id="btn-cancelar-frequencia"
                  label="Cancelar"
                  color={Colors.Azul}
                  border
                  bold
                  className="mr-3"
                  onClick={() => onClickCancelar()}
                />
                <Button
                  id="btn-gerar-frequencia"
                  icon="print"
                  label="Gerar"
                  color={Colors.Roxo}
                  border
                  bold
                  onClick={() => onClickGerar()}
                  disabled={desabilitarBtnGerar}
                />
              </div>
            </div>
            <div className="row my-3">
              <div className="col-sm-12 col-md-6 col-lg-3 col-xl-2 pr-0">
                <Loader loading={carregandoAnosLetivos} ignorarTip>
                  <SelectComponent
                    label="Ano Letivo"
                    lista={listaAnosLetivo}
                    valueOption="valor"
                    valueText="desc"
                    disabled={listaAnosLetivo?.length === 1}
                    onChange={onChangeAnoLetivo}
                    valueSelect={anoLetivo}
                    placeholder="Selecione o ano"
                  />
                </Loader>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-9 col-xl-5 pr-0">
                <Loader loading={carregandoDres} ignorarTip>
                  <SelectComponent
                    label="DRE"
                    lista={listaDres}
                    valueOption="codigo"
                    valueText="nome"
                    disabled={listaDres?.length === 1 || !anoLetivo}
                    onChange={onChangeDre}
                    valueSelect={codigoDre}
                    placeholder="Diretoria Regional de Educação (DRE)"
                    showSearch
                  />
                </Loader>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-9 col-xl-5">
                <Loader loading={carregandoUes} ignorarTip>
                  <SelectComponent
                    label="Unidade Escolar (UE)"
                    lista={listaUes}
                    valueOption="valor"
                    valueText="desc"
                    disabled={listaUes?.length === 1 || !codigoDre}
                    onChange={onChangeUe}
                    valueSelect={codigoUe}
                    placeholder="Unidade Escolar (UE)"
                    showSearch
                  />
                </Loader>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-12 col-md-4 pr-0">
                <Loader loading={carregandoModalidade} ignorarTip>
                  <SelectComponent
                    label="Modalidade"
                    lista={listaModalidades}
                    valueOption="valor"
                    valueText="descricao"
                    disabled={listaModalidades?.length === 1 || !codigoUe}
                    onChange={onChangeModalidade}
                    valueSelect={modalidadeId}
                    placeholder="Selecione uma modalidade"
                  />
                </Loader>
              </div>
              <div className="col-sm-12 col-md-4 pr-0">
                <Loader loading={carregandoSemestres} ignorarTip>
                  <SelectComponent
                    lista={listaSemestre}
                    valueOption="valor"
                    valueText="desc"
                    label="Semestre"
                    disabled={
                      !modalidadeId ||
                      Number(modalidadeId) !== ModalidadeDTO.EJA ||
                      listaSemestre?.length === 1
                    }
                    valueSelect={semestre}
                    onChange={onChangeSemestre}
                    placeholder="Selecione o semestre"
                  />
                </Loader>
              </div>
              <div className="col-sm-12 col-md-4">
                <RadioGroupButton
                  label="Tipo de relatório"
                  opcoes={opcoesTipoRelatorio}
                  valorInicial
                  onChange={e => {
                    setTipoRelatorio(e.target.value);
                  }}
                  value={tipoRelatorio}
                  desabilitado={
                    !codigoUe ||
                    desabilitarTipoRelatorio ||
                    !modalidadeId ||
                    desabilitarSemestre
                  }
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-12 col-md-4 pr-0">
                <Loader loading={carregandoAnosEscolares} ignorarTip>
                  <SelectComponent
                    lista={listaAnosEscolares}
                    valueOption="valor"
                    valueText="descricao"
                    label="Ano"
                    disabled={
                      !listaAnosEscolares?.length ||
                      listaAnosEscolares?.length === 1 ||
                      ehTurma
                    }
                    valueSelect={anosEscolares}
                    onChange={valoresNovos => {
                      valoresNovos = removeAdicionaOpcaoTodos(
                        anosEscolares,
                        valoresNovos
                      );
                      onChangeAnos(valoresNovos);
                    }}
                    placeholder="Selecione o ano"
                    multiple
                  />
                </Loader>
              </div>
              <div className="col-sm-12 col-md-4 pr-0">
                <RadioGroupButton
                  label="Listar turmas de programa"
                  opcoes={opcoesListarTurmasDePrograma}
                  valorInicial
                  onChange={e => {
                    setTurmasPrograma(e.target.value);
                  }}
                  value={turmasPrograma}
                  desabilitado={
                    ehTurma ||
                    !anosEscolares ||
                    (anosEscolares?.length &&
                      !!anosEscolares?.find(ano => ano !== OPCAO_TODOS))
                  }
                />
              </div>
              <div className="col-sm-12 col-md-4">
                <Loader loading={carregandoTurmas} ignorarTip>
                  <SelectComponent
                    multiple
                    id="turma"
                    lista={listaTurmas}
                    valueOption="valor"
                    valueText="nomeFiltro"
                    label="Turma"
                    disabled={!modalidadeId || listaTurmas?.length === 1}
                    valueSelect={turmasCodigo}
                    onChange={valores => {
                      onchangeMultiSelect(valores, turmasCodigo, onChangeTurma);
                    }}
                    placeholder="Turma"
                    showSearch
                  />
                </Loader>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-sm-12 col-md-4 pr-0">
                <Loader loading={carregandoComponentesCurriculares} ignorarTip>
                  <SelectComponent
                    lista={listaComponenteCurricular}
                    valueOption="valor"
                    valueText="desc"
                    label="Componente Curricular"
                    disabled={listaComponenteCurricular?.length === 1}
                    valueSelect={componentesCurriculares}
                    onChange={valoresNovos => {
                      valoresNovos = removeAdicionaOpcaoTodos(
                        componentesCurriculares,
                        valoresNovos
                      );
                      onChangeComponenteCurricular(valoresNovos);
                    }}
                    placeholder="Selecione o componente curricular"
                    multiple
                  />
                </Loader>
              </div>
              <div className="col-sm-12 col-md-4 pr-0">
                <Loader loading={carregandoBimestres} ignorarTip>
                  <SelectComponent
                    lista={listaBimestre}
                    valueOption="valor"
                    valueText="desc"
                    label="Bimestre"
                    disabled={listaBimestre?.length === 1}
                    valueSelect={bimestres}
                    onChange={onChangeBimestre}
                    placeholder="Selecione o bimestre"
                  />
                </Loader>
              </div>
              <div className="col-sm-12 col-md-4">
                <SelectComponent
                  lista={listaCondicao}
                  valueOption="valor"
                  valueText="desc"
                  label="Condição"
                  disabled={listaCondicao?.length === 1}
                  valueSelect={condicao}
                  onChange={onChangeCondicao}
                  placeholder="Selecione a condição"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-12 col-md-4 pr-0">
                <CampoNumero
                  onChange={onChangeComparacao}
                  value={valorCondicao}
                  min={0}
                  label="Quantidade de ausências"
                  className="w-100"
                  placeholder="Digite a quantidade de ausências"
                  ehDecimal={false}
                  disabled={condicao === OPCAO_TODOS_ESTUDANTES}
                />
              </div>
              <div className="col-sm-12 col-md-4 pr-0">
                <RadioGroupButton
                  label="Formato"
                  opcoes={opcoesListaFormatos}
                  valorInicial
                  onChange={e => {
                    setFormato(e.target.value);
                  }}
                  value={formato}
                  desabilitado={ehTurma}
                />
              </div>
            </div>
          </div>
        </Card>
      </Loader>
    </>
  );
};

export default RelatorioFrequencia;
