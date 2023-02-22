import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'antd';
import {
  CampoNumero,
  Card,
  CheckboxComponent,
  Loader,
  RadioGroupButton,
  SelectComponent,
} from '~/componentes';
import { Cabecalho, FiltroHelper } from '~/componentes-sgp';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';

import { URL_HOME, OPCAO_TODOS } from '~/constantes';
import { ModalidadeDTO } from '~/dtos';
import {
  onchangeMultiSelect,
  ordenarListaMaiorParaMenor,
  primeiroMaisculo,
} from '~/utils';

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
  const [anoAtual] = useState(window.moment().format('YYYY'));
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
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [desabilitarSemestre, setDesabilitarSemestre] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);

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
  const ehEJA = Number(modalidadeId) === ModalidadeDTO.EJA;
  const ehInfantil = Number(modalidadeId) === ModalidadeDTO.INFANTIL;

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

  const obterAnosLetivos = useCallback(
    async consideraHistoricoEstaMarcado => {
      setCarregandoAnosLetivos(true);

      const resposta = await FiltroHelper.obterAnosLetivos({
        consideraHistorico: consideraHistoricoEstaMarcado,
      })
        .catch(e => erros(e))
        .finally(() => setCarregandoAnosLetivos(false));

      const anosLetivos = resposta || [];

      if (!anosLetivos?.length) {
        anosLetivos.push({
          desc: anoAtual,
          valor: anoAtual,
        });
      }

      const anosOrdenados = ordenarListaMaiorParaMenor(anosLetivos, 'valor');

      setAnoLetivo(anosOrdenados[0]?.valor);
      setListaAnosLetivo(anosOrdenados);
    },
    [anoAtual]
  );

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

  const obterUes = useCallback(
    async dre => {
      if (dre) {
        setCarregandoUes(true);
        const retorno = await ServicoFiltroRelatorio.obterUes(
          dre,
          consideraHistorico,
          anoLetivo
        )
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
    },
    [consideraHistorico, anoLetivo]
  );

  const onChangeDre = dre => {
    setCodigoDre(dre);

    setListaUes([]);
    setCodigoUe(undefined);
    setDesabilitarTipoRelatorio(false);

    setListaModalidades([]);
    setModalidadeId(undefined);

    setListaSemestre([]);
    setSemestre(undefined);

    setListaAnosEscolares([]);
    setAnosEscolares(undefined);

    setModoEdicao(true);
  };

  const obterDres = useCallback(async () => {
    setCarregandoDres(true);
    const retorno = await AbrangenciaServico.buscarDres(
      `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoDres(false));
    if (retorno?.data?.length) {
      const lista = retorno.data
        .map(item => ({
          desc: item.nome,
          valor: String(item.codigo),
          abrev: item.abreviacao,
        }))
        .sort(FiltroHelper.ordenarLista('desc'));

      if (lista?.length === 1) {
        setCodigoDre(lista[0].valor);
      } else {
        lista.unshift({
          desc: 'Todas',
          valor: OPCAO_TODOS,
        });
      }

      setListaDres(lista);
      return;
    }
    setListaDres([]);
    setCodigoDre();
  }, [anoLetivo, consideraHistorico]);

  const obterSemestres = useCallback(async () => {
    setCarregandoSemestres(true);
    const retorno = await api
      .get(
        `v1/abrangencias/${consideraHistorico}/semestres?anoLetivo=${anoLetivo}&modalidade=${modalidadeId ||
          0}`
      )
      .catch(e => erros(e))
      .finally(() => {
        setCarregandoSemestres(false);
      });
    if (retorno?.data) {
      const lista = retorno.data.map(periodo => {
        return { desc: periodo, valor: periodo };
      });

      if (lista?.length === 1) {
        setSemestre(lista[0].valor);
      }
      setListaSemestre(lista);
    } else {
      setListaSemestre();
      setSemestre();
    }
  }, [modalidadeId, anoLetivo, consideraHistorico]);

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

  const escolherChamadaEndpointComponeteCurricular = useCallback(() => {
    const ehOpcaoTodas =
      turmasCodigo === '-99' ||
      turmasCodigo?.find(item => item === OPCAO_TODOS) ||
      turmasCodigo === undefined;

    if (ehInfantil) {
      const turmas = ehOpcaoTodas
        ? listaTurmas
            .filter(item => item.valor !== OPCAO_TODOS)
            .map(item => item.valor)
        : turmasCodigo;

      return ServicoComponentesCurriculares.obterComponentesPorListaDeTurmas(
        turmas,
        true
      );
    }
    if (ehTurma) {
      const turmas = ehOpcaoTodas ? [OPCAO_TODOS] : turmasCodigo;

      return ServicoComponentesCurriculares.obterComponetensCurricularesPorTurma(
        codigoUe,
        turmas
      );
    }

    const codigoTodosAnosEscolares = obterCodigoTodosAnosEscolares();
    return ServicoComponentesCurriculares.obterComponetensCurriculares(
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
    ehInfantil,
    listaTurmas,
  ]);

  const obterComponenteCurricular = useCallback(async () => {
    if (anoLetivo) {
      setCarregandoComponentesCurriculares(true);
      const retorno = await escolherChamadaEndpointComponeteCurricular()
        .catch(e => erros(e))
        .finally(() => setCarregandoComponentesCurriculares(false));
      if (retorno?.data?.length) {
        const nomeParametro = ehInfantil ? 'nome' : 'descricao';
        const lista = retorno.data.map(item => ({
          desc: item[nomeParametro],
          valor: String(item.codigo),
        }));

        if (ehTurma && lista.length > 1) {
          lista.unshift({ desc: 'Todos', valor: OPCAO_TODOS });
        }

        setListaComponenteCurricular(lista);
        if (lista?.length === 1) {
          setComponentesCurriculares([lista[0].valor]);
        }
        return;
      }
      setListaComponenteCurricular([]);
    }
  }, [
    anoLetivo,
    ehTurma,
    ehInfantil,
    escolherChamadaEndpointComponeteCurricular,
  ]);

  useEffect(() => {
    const permiteChamadaEndpoint =
      (ehTurma && turmasCodigo?.length) || (!ehTurma && anosEscolares?.length);
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
      obterSemestres();
      return;
    }
    setSemestre(undefined);
    setListaSemestre([]);
  }, [modalidadeId, anoLetivo, obterSemestres]);

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
      !condicao ||
      !formato;

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
    formato,
  ]);

  useEffect(() => {
    obterAnosLetivos(consideraHistorico);
  }, [consideraHistorico, obterAnosLetivos]);

  const onClickVoltar = () => {
    history.push(URL_HOME);
  };

  const onClickCancelar = async () => {
    setAnoLetivo(anoAtual);
    setCodigoDre();
    obterDres();
    setTipoRelatorio(TIPO_RELATORIO.TURMA);
    setCondicao(undefined);
    setValorCondicao(undefined);
    setFormato(FORMATOS.PDF);
    setModoEdicao(false);
  };

  const onClickGerar = async () => {
    setCarregandoGeral(true);
    const turmas = turmasCodigo === OPCAO_TODOS ? [OPCAO_TODOS] : turmasCodigo;
    const params = {
      anoLetivo,
      codigoDre,
      codigoUe,
      modalidade: modalidadeId,
      semestre,
      anosEscolares,
      componentesCurriculares,
      bimestres: [bimestres],
      tipoRelatorio,
      condicao,
      quantidadeAusencia: valorCondicao,
      tipoFormatoRelatorio: formato,
      turmasPrograma,
      codigosTurma: turmas,
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

    setModoEdicao(true);
  };

  const onChangeModalidade = novaModalidade => {
    setModalidadeId(novaModalidade);

    setTurmasCodigo([]);
    setListaSemestre([]);
    setSemestre(undefined);

    setListaAnosEscolares([]);
    setAnosEscolares(undefined);

    setTipoRelatorio(TIPO_RELATORIO.TURMA);
    setModoEdicao(true);
  };

  const onChangeAnoLetivo = ano => {
    setAnoLetivo(ano);

    setCodigoUe();
    setCodigoDre();
    setListaSemestre([]);
    setSemestre(undefined);

    setListaComponenteCurricular([]);
    setComponentesCurriculares(undefined);

    setModoEdicao(true);
  };

  const onChangeAnos = valor => {
    setAnosEscolares(valor);

    setListaComponenteCurricular([]);
    setComponentesCurriculares(undefined);

    setModoEdicao(true);
  };

  const onChangeSemestre = valor => {
    setSemestre(valor);
    setTurmasCodigo([]);
    setModoEdicao(true);
  };

  const onChangeComponenteCurricular = valor => {
    setComponentesCurriculares(valor);
    setModoEdicao(true);
  };

  const onChangeBimestre = valor => {
    setBimestres(valor);
    setModoEdicao(true);
  };

  const onChangeCondicao = valor => {
    setCondicao(valor);
    setModoEdicao(true);
  };

  const onChangeComparacao = valor => {
    setValorCondicao(valor);
    setModoEdicao(true);
  };

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
    setModoEdicao(true);
  };

  const obterTurmas = useCallback(
    async (modalidadeSelecionada, ue, ano, semestreSelecionado, ehEja) => {
      if (ue && modalidadeSelecionada) {
        const OPCAO_TODAS_TURMA = { valor: OPCAO_TODOS, nomeFiltro: 'Todas' };

        if (ehEja && !semestreSelecionado) return;

        if (ue === OPCAO_TODOS) {
          setListaTurmas([OPCAO_TODAS_TURMA]);
          setTurmasCodigo([OPCAO_TODAS_TURMA.valor]);
          return;
        }

        setCarregandoTurmas(true);
        const { data } = await AbrangenciaServico.buscarTurmas(
          ue,
          modalidadeSelecionada,
          semestreSelecionado,
          ano,
          consideraHistorico
        )
          .catch(e => erros(e))
          .finally(() => setCarregandoTurmas(false));

        if (data) {
          const lista = [];
          if (data.length > 1) {
            lista.push({ valor: OPCAO_TODOS, nomeFiltro: 'Todas' });
          }
          data.map(item =>
            lista.push({
              desc: item.nome,
              valor: item.codigo,
              nomeFiltro: item.nomeFiltro,
            })
          );
          setListaTurmas(lista);
          if (lista.length === 1) {
            setTurmasCodigo([lista[0].valor]);
          }
        }
      }
    },
    [consideraHistorico]
  );

  useEffect(() => {
    if (modalidadeId && codigoUe) {
      obterTurmas(modalidadeId, codigoUe, anoLetivo, semestre, ehEJA);
      return;
    }
    setTurmasCodigo();
    setListaTurmas([]);
  }, [modalidadeId, codigoUe, anoLetivo, semestre, obterTurmas, ehEJA]);

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

  useEffect(() => {
    if (anoLetivo) {
      obterDres();
    }
  }, [obterDres, anoLetivo]);

  const onChangeConsideraHistorico = e => {
    setConsideraHistorico(e.target.checked);
    setCodigoUe();
    setCodigoDre();
    setModoEdicao(true);
  };

  return (
    <>
      <Loader loading={carregandoGeral}>
        <Cabecalho pagina="Frequência">
          <BotoesAcaoRelatorio
            onClickVoltar={() => onClickVoltar()}
            onClickCancelar={onClickCancelar}
            onClickGerar={onClickGerar}
            desabilitarBtnGerar={desabilitarBtnGerar}
            modoEdicao={modoEdicao}
          />
        </Cabecalho>

        <Card padding="24px 24px">
          <Col span={24}>
            <Row gutter={[16, 8]}>
              <Col sm={24}>
                <CheckboxComponent
                  label="Exibir histórico?"
                  checked={consideraHistorico}
                  onChangeCheckbox={onChangeConsideraHistorico}
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col sm={24} md={12} xl={4}>
                <Loader loading={carregandoAnosLetivos} ignorarTip>
                  <SelectComponent
                    valueText="desc"
                    label="Ano Letivo"
                    valueOption="valor"
                    lista={listaAnosLetivo}
                    valueSelect={anoLetivo}
                    placeholder="Ano letivo"
                    onChange={onChangeAnoLetivo}
                    disabled={
                      !listaAnosLetivo?.length || listaAnosLetivo?.length === 1
                    }
                  />
                </Loader>
              </Col>

              <Col sm={24} md={12} xl={10}>
                <Loader loading={carregandoDres} ignorarTip>
                  <SelectComponent
                    label="Diretoria Regional de Educação (DRE)"
                    lista={listaDres}
                    valueOption="valor"
                    valueText="desc"
                    disabled={listaDres?.length === 1 || !anoLetivo}
                    onChange={onChangeDre}
                    valueSelect={codigoDre}
                    placeholder="Diretoria Regional de Educação (DRE)"
                    showSearch
                  />
                </Loader>
              </Col>

              <Col sm={24} md={12} xl={10}>
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
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col sm={24} md={12} xl={8}>
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
              </Col>

              <Col sm={24} md={12} xl={8}>
                <Loader loading={carregandoSemestres} ignorarTip>
                  <SelectComponent
                    lista={listaSemestre}
                    valueOption="valor"
                    valueText="desc"
                    label="Semestre"
                    disabled={
                      !modalidadeId || !ehEJA || listaSemestre?.length === 1
                    }
                    valueSelect={semestre}
                    onChange={onChangeSemestre}
                    placeholder="Selecione o semestre"
                  />
                </Loader>
              </Col>

              <Col sm={24} md={12} xl={8}>
                <RadioGroupButton
                  label="Tipo de relatório"
                  opcoes={opcoesTipoRelatorio}
                  valorInicial
                  onChange={e => {
                    setTipoRelatorio(e.target.value);
                    setModoEdicao(true);
                  }}
                  value={tipoRelatorio}
                  desabilitado={
                    !codigoUe ||
                    desabilitarTipoRelatorio ||
                    modalidadeId ||
                    desabilitarSemestre
                  }
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col sm={24} md={12} xl={8}>
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
              </Col>

              <Col sm={24} md={12} xl={8}>
                <RadioGroupButton
                  label="Listar turmas de programa"
                  opcoes={opcoesListarTurmasDePrograma}
                  valorInicial
                  onChange={e => {
                    setTurmasPrograma(e.target.value);
                    setModoEdicao(true);
                  }}
                  value={turmasPrograma}
                  desabilitado={
                    ehTurma ||
                    (anosEscolares?.length &&
                      !!anosEscolares?.find(ano => ano !== OPCAO_TODOS))
                  }
                />
              </Col>

              <Col sm={24} md={12} xl={8}>
                <Loader loading={carregandoTurmas} ignorarTip>
                  <SelectComponent
                    multiple
                    id="turma"
                    lista={listaTurmas}
                    valueOption="valor"
                    valueText="nomeFiltro"
                    label="Turma"
                    disabled={
                      !modalidadeId ||
                      listaTurmas?.length === 1 ||
                      (ehEJA && !semestre)
                    }
                    valueSelect={turmasCodigo}
                    onChange={valores => {
                      onchangeMultiSelect(valores, turmasCodigo, onChangeTurma);
                    }}
                    placeholder="Turma"
                    showSearch
                  />
                </Loader>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col sm={24} md={12} xl={8}>
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
              </Col>

              <Col sm={24} md={12} xl={8}>
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
              </Col>

              <Col sm={24} md={12} xl={8}>
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
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col sm={24} md={12} xl={8}>
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
              </Col>

              <Col sm={24} md={12} xl={8}>
                <RadioGroupButton
                  label="Formato"
                  opcoes={opcoesListaFormatos}
                  valorInicial
                  onChange={e => {
                    setFormato(e.target.value);
                    setModoEdicao(true);
                  }}
                  value={formato}
                  desabilitado={ehTurma}
                />
              </Col>
            </Row>
          </Col>
        </Card>
      </Loader>
    </>
  );
};

export default RelatorioFrequencia;
