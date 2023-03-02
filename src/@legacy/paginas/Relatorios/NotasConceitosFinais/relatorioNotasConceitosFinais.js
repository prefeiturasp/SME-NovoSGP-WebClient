import React, { useCallback, useEffect, useState } from 'react';
import { CheckboxComponent, Loader, SelectComponent } from '~/componentes';
import { Cabecalho, FiltroHelper } from '~/componentes-sgp';
import CampoNumero from '~/componentes/campoNumero';
import Card from '~/componentes/card';
import { URL_HOME } from '~/constantes/url';
import modalidade from '~/dtos/modalidade';
import AbrangenciaServico from '~/servicos/Abrangencia';
import { erros, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';
import history from '~/servicos/history';
import ServicoFiltroRelatorio from '~/servicos/Paginas/FiltroRelatorio/ServicoFiltroRelatorio';
import ServicoRelatorioNotasConceitos from '~/servicos/Paginas/Relatorios/NotasConceitos/servicoRelatorioNotasConceitos';
import ServicoNotaConceito from '~/servicos/Paginas/DiarioClasse/ServicoNotaConceito';
import tipoNota from '~/dtos/tipoNota';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import { OPCAO_TODOS } from '~/constantes/constantes';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import { ordenarListaMaiorParaMenor } from '~/utils';

const RelatorioNotasConceitosFinais = () => {
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaSemestre, setListaSemestre] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaAnosEscolares, setListaAnosEscolares] = useState([]);
  const [listaComponenteCurricular, setListaComponenteCurricular] = useState(
    []
  );
  const [listaBimestre, setListaBimestre] = useState([]);

  const [anoLetivo, setAnoLetivo] = useState(undefined);
  const [codigoDre, setCodigoDre] = useState(undefined);
  const [codigoUe, setCodigoUe] = useState(undefined);
  const [modalidadeId, setModalidadeId] = useState(undefined);
  const [semestre, setSemestre] = useState(undefined);
  const [anosEscolares, setAnosEscolares] = useState(undefined);
  const [componentesCurriculares, setComponentesCurriculares] =
    useState(undefined);
  const [bimestres, setBimestres] = useState(undefined);
  const [valorCondicao, setValorCondicao] = useState(undefined);
  const [tipoNotaSelecionada, setTipoNotaSelecionada] = useState(undefined);
  const [listaConceitos, setListaConceitos] = useState([]);
  const [campoBloqueado, setCampoBloqueado] = useState(false);

  const listaCondicaoInicial = [
    { valor: '0', desc: 'Todas' },
    { valor: '1', desc: 'Igual' },
    { valor: '2', desc: 'Maior ' },
    { valor: '3', desc: 'Menor' },
  ];
  const [listaCondicao, setListaCondicao] = useState(listaCondicaoInicial);
  const [condicao, setCondicao] = useState(undefined);
  const [clicouBotaoGerar, setClicouBotaoGerar] = useState(false);
  const [desabilitarBtnGerar, setDesabilitarBtnGerar] = useState(true);
  const anoAtual = window.moment().format('YYYY');
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);

  const listaFormatos = [
    { valor: '1', desc: 'PDF' },
    { valor: '4', desc: 'Excel' },
  ];
  const listaTipoNota = [
    { valor: tipoNota.todas, desc: 'Todas' },
    { valor: tipoNota.nota, desc: 'Nota' },
    { valor: tipoNota.conceito, desc: 'Conceito' },
    { valor: tipoNota.sintese, desc: 'Síntese' },
  ];
  const [formato, setFormato] = useState('1');

  const [carregandoGeral, setCarregandoGeral] = useState(false);

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoGeral(true);
    const resposta = await FiltroHelper.obterAnosLetivos({
      consideraHistorico,
    }).catch(e => {
      erros(e);
      setCarregandoGeral(false);
    });

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

    setCarregandoGeral(false);
  }, [consideraHistorico, anoAtual]);

  const obterModalidades = async ue => {
    if (ue) {
      setCarregandoGeral(true);
      const retorno = await ServicoFiltroRelatorio.obterModalidades(
        ue,
        anoLetivo,
        consideraHistorico
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

  const obterUes = useCallback(async () => {
    if (codigoDre) {
      setCarregandoGeral(true);
      const retorno = await ServicoFiltroRelatorio.obterUes(
        codigoDre,
        consideraHistorico,
        anoLetivo
      ).catch(e => {
        erros(e);
        setCarregandoGeral(false);
      });
      if (retorno && retorno.data) {
        const lista = retorno.data.map(item => ({
          desc: item.nome,
          valor: String(item.codigo),
        }));

        if (lista && lista.length && lista.length === 1) {
          setCodigoUe(lista[0].valor);
        }
        setListaUes(lista);
      } else {
        setListaUes([]);
      }
      setCarregandoGeral(false);
    }
  }, [anoLetivo, codigoDre, consideraHistorico]);

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

    setModoEdicao(true);
  };

  const obterDres = useCallback(async () => {
    setCarregandoGeral(true);
    const retorno = await AbrangenciaServico.buscarDres(
      `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoGeral(false));

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

  const obterSemestres = async (
    modalidadeSelecionada,
    anoLetivoSelecionado
  ) => {
    setCarregandoGeral(true);
    const retorno = await api
      .get(
        `v1/abrangencias/${consideraHistorico}/semestres?anoLetivo=${anoLetivoSelecionado}&modalidade=${
          modalidadeSelecionada || 0
        }`
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
  };

  useEffect(() => {
    if (codigoUe) {
      obterModalidades(codigoUe);
    } else {
      setModalidadeId(undefined);
      setListaModalidades([]);
    }
  }, [codigoUe]);

  useEffect(() => {
    if (codigoDre) {
      obterUes();
    } else {
      setCodigoUe(undefined);
      setListaUes([]);
    }
  }, [codigoDre, obterUes]);

  const obterAnosEscolares = useCallback(
    async (mod, ue, anoLetivoSelecionado) => {
      if (String(mod) === String(modalidade.EJA)) {
        setListaAnosEscolares([{ descricao: 'Todos', valor: OPCAO_TODOS }]);
        setAnosEscolares([OPCAO_TODOS]);
      } else {
        setCarregandoGeral(true);
        const respota = await AbrangenciaServico.buscarAnosEscolares(
          ue,
          mod,
          consideraHistorico
        ).catch(e => {
          erros(e);
          setCarregandoGeral(false);
        });

        if (respota && respota.data && respota.data.length) {
          setListaAnosEscolares(
            [{ descricao: 'Todos', valor: OPCAO_TODOS }].concat(respota.data)
          );

          if (
            respota.data &&
            respota.data.length &&
            respota.data.length === 1
          ) {
            setAnosEscolares(respota.data[0].valor);
          }
        } else {
          setListaAnosEscolares([]);
        }
        setCarregandoGeral(false);
      }
    },

    []
  );

  useEffect(() => {
    if (modalidadeId && codigoUe && anoLetivo) {
      obterAnosEscolares(modalidadeId, codigoUe, anoLetivo);
    } else {
      setAnosEscolares(undefined);
      setListaAnosEscolares([]);
    }
  }, [modalidadeId, codigoUe, anoLetivo, obterAnosEscolares]);

  const obterCodigoTodosAnosEscolares = useCallback(() => {
    let todosAnosEscolares = anosEscolares;
    const selecionouTodos = []
      .concat(anosEscolares)
      .find(ano => ano === OPCAO_TODOS);
    if (selecionouTodos) {
      todosAnosEscolares = listaAnosEscolares.map(item => item.valor);
    }
    return todosAnosEscolares;
  }, [anosEscolares, listaAnosEscolares]);

  const obterComponenteCurricular = useCallback(async () => {
    const codigoTodosAnosEscolares = obterCodigoTodosAnosEscolares();
    if (anoLetivo) {
      setCarregandoGeral(true);
      const retorno = await ServicoFiltroRelatorio.obterComponetensCurriculares(
        codigoUe,
        modalidadeId,
        anoLetivo,
        codigoTodosAnosEscolares
      ).catch(e => {
        erros(e);
        setCarregandoGeral(false);
      });
      if (retorno && retorno.data && retorno.data.length) {
        const lista = retorno.data.map(item => {
          return { desc: item.descricao, valor: String(item.codigo) };
        });

        setListaComponenteCurricular(lista);
        if (lista && lista.length && lista.length === 1) {
          setComponentesCurriculares(lista[0].valor);
        }
      } else {
        setListaComponenteCurricular([]);
      }
      setCarregandoGeral(false);
    }
  }, [modalidadeId, anoLetivo, obterCodigoTodosAnosEscolares]);

  useEffect(() => {
    if (anosEscolares && anosEscolares.length) {
      obterComponenteCurricular();
    } else {
      setComponentesCurriculares(undefined);
      setListaComponenteCurricular([]);
    }
  }, [anosEscolares, obterComponenteCurricular]);

  const obterBimestres = useCallback(() => {
    const bi = [];
    bi.push({ desc: '1º', valor: 1 });
    bi.push({ desc: '2º', valor: 2 });

    if (modalidadeId !== modalidade.EJA) {
      bi.push({ desc: '3º', valor: 3 });
      bi.push({ desc: '4º', valor: 4 });
    }

    bi.push({ desc: 'Final', valor: 0 });
    bi.push({ desc: 'Todos', valor: -99 });
    setListaBimestre(bi);
  }, [modalidadeId]);

  useEffect(() => {
    if (modalidadeId) {
      obterBimestres();
    } else {
      setListaBimestre([]);
      setBimestres(undefined);
    }
  }, [modalidadeId, obterBimestres]);

  useEffect(() => {
    if (modalidadeId && anoLetivo) {
      if (String(modalidadeId) === String(modalidade.EJA)) {
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

  const obterConceitos = async anoLetivoSelecionado => {
    setCarregandoGeral(true);
    const conceitos = await ServicoNotaConceito.obterTodosConceitos(
      `01-01-${anoLetivoSelecionado}`
    )
      .catch(e => erros(e))
      .finally(setCarregandoGeral(false));
    setListaConceitos(conceitos?.data);
  };

  const obterSinteses = async anoLetivoSelecionado => {
    setCarregandoGeral(true);
    const conceitos = await ServicoNotaConceito.obterTodasSinteses(
      anoLetivoSelecionado
    )
      .catch(e => erros(e))
      .finally(setCarregandoGeral(false));
    setListaConceitos(conceitos?.data);
  };

  useEffect(() => {
    if (anoLetivo && tipoNotaSelecionada) {
      if (tipoNotaSelecionada === tipoNota.conceito) obterConceitos(anoLetivo);
      else obterSinteses(anoLetivo);
    }
  }, [tipoNotaSelecionada, anoLetivo]);

  const valorCondicaoDesabilitar =
    tipoNotaSelecionada === tipoNota.todas || condicao === '0'
      ? false
      : valorCondicao === undefined || valorCondicao === '';

  useEffect(() => {
    const desabilitar =
      !anoLetivo ||
      !codigoDre ||
      !codigoUe ||
      !modalidadeId ||
      !anosEscolares ||
      !componentesCurriculares?.length ||
      !bimestres ||
      !condicao ||
      !tipoNota ||
      valorCondicaoDesabilitar ||
      (String(modalidadeId) === String(modalidade.EJA) ? !semestre : false) ||
      !formato ||
      clicouBotaoGerar;

    setDesabilitarBtnGerar(desabilitar);
  }, [
    anoLetivo,
    codigoDre,
    codigoUe,
    modalidadeId,
    anosEscolares,
    componentesCurriculares,
    semestre,
    condicao,
    valorCondicaoDesabilitar,
    formato,
    bimestres,
    clicouBotaoGerar,
  ]);

  useEffect(() => {
    if (anoLetivo) {
      obterDres();
    }
  }, [obterDres, anoLetivo]);

  useEffect(() => {
    obterAnosLetivos();
  }, [consideraHistorico, obterAnosLetivos]);

  const onClickVoltar = () => {
    history.push(URL_HOME);
  };

  const onClickCancelar = () => {
    setConsideraHistorico(false);
    setAnoLetivo(undefined);
    setCodigoDre(undefined);
    setCondicao(undefined);
    setValorCondicao(undefined);
    setListaAnosLetivo([]);
    setListaDres([]);
    setTipoNotaSelecionada(undefined);

    obterAnosLetivos();

    setFormato('PDF');
    setModoEdicao(false);
  };

  const onClickGerar = async () => {
    setCarregandoGeral(true);
    setClicouBotaoGerar(true);

    const params = {
      anoLetivo,
      dreCodigo: codigoDre === OPCAO_TODOS ? '' : codigoDre,
      ueCodigo: codigoUe === OPCAO_TODOS ? '' : codigoUe,
      modalidade: modalidadeId,
      semestre,
      anos:
        anosEscolares.toString() !== OPCAO_TODOS
          ? [].concat(anosEscolares)
          : [],
      componentesCurriculares:
        componentesCurriculares.toString() !== OPCAO_TODOS
          ? [].concat(componentesCurriculares)
          : [],
      bimestres: [bimestres],
      condicao,
      valorCondicao,
      tipoNota: tipoNotaSelecionada,
      tipoFormatoRelatorio: formato,
    };
    setCarregandoGeral(true);
    const retorno = await ServicoRelatorioNotasConceitos.gerar(params)
      .catch(e => {
        erros(e);
      })
      .finally(setCarregandoGeral(false));
    if (retorno && retorno.status === 200) {
      sucesso(
        'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
      );
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

    setModoEdicao(true);
  };

  const onChangeModalidade = novaModalidade => {
    setModalidadeId(novaModalidade);

    setListaSemestre([]);
    setSemestre(undefined);

    setListaAnosEscolares([]);
    setAnosEscolares(undefined);

    setModoEdicao(true);
  };

  const onChangeAnoLetivo = ano => {
    setAnoLetivo(ano);

    setModalidadeId(undefined);

    setListaSemestre([]);
    setSemestre(undefined);

    setListaAnosEscolares([]);
    setAnosEscolares(undefined);

    setCodigoDre();
    setCodigoUe();

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
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeComponenteCurricular = valor => {
    setComponentesCurriculares(valor);
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeBimestre = valor => {
    setBimestres(valor);
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeCondicao = valor => {
    if (valor === '0') {
      setCampoBloqueado(true);
    }
    setCondicao(valor);
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeComparacao = valor => {
    setValorCondicao(valor);
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeTipoNota = valor => {
    let valorCampoCondicao;
    let bloqueado = false;
    let novaListaCondicao = listaCondicaoInicial;
    const valorOpcaoMaior = 2;

    if (valor === tipoNota.todas) {
      valorCampoCondicao = '0';
      bloqueado = true;
    }
    if (valor === tipoNota.conceito) {
      valorCampoCondicao = '1';
      novaListaCondicao = listaCondicaoInicial
        .map(item => {
          if (String(item.valor) === '0') {
            return {
              ...item,
              desc: 'Todos',
            };
          }
          return item;
        })
        .filter(item => Number(item.valor) < valorOpcaoMaior);
    }
    if (valor === tipoNota.sintese) {
      valorCampoCondicao = '1';
      novaListaCondicao = listaCondicaoInicial.filter(
        item => Number(item.valor) < valorOpcaoMaior
      );
    }
    setListaCondicao(novaListaCondicao);
    setValorCondicao(undefined);
    setCondicao(valorCampoCondicao);
    setTipoNotaSelecionada(valor);
    setCampoBloqueado(bloqueado);
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeFormato = valor => {
    setFormato(valor);
    setClicouBotaoGerar(false);
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

    if (todosEhUnicoJaSelecionado) {
      if (
        valoresParaSelecionar &&
        valoresParaSelecionar.length > 1 &&
        valoresParaSelecionar.includes(OPCAO_TODOS)
      ) {
        valoresParaSelecionar = valoresParaSelecionar.filter(
          item => item !== OPCAO_TODOS
        );
      }
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

  const onChangeConsideraHistorico = e => {
    setConsideraHistorico(e.target.checked);
    setAnoLetivo();

    setModalidadeId(undefined);

    setListaSemestre([]);
    setSemestre(undefined);

    setListaAnosEscolares([]);
    setAnosEscolares(undefined);

    setCodigoDre();
    setCodigoUe();

    setModoEdicao(true);
  };

  return (
    <>
      <AlertaModalidadeInfantil
        exibir={String(modalidadeId) === String(modalidade.INFANTIL)}
        validarModalidadeFiltroPrincipal={false}
      />
      <Cabecalho pagina="Notas e conceitos">
        <BotoesAcaoRelatorio
          onClickVoltar={onClickVoltar}
          onClickCancelar={onClickCancelar}
          onClickGerar={onClickGerar}
          desabilitarBtnGerar={desabilitarBtnGerar}
          modoEdicao={modoEdicao}
        />
      </Cabecalho>
      <Loader loading={carregandoGeral}>
        <Card>
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12 mb-2">
                <CheckboxComponent
                  label="Exibir histórico?"
                  checked={consideraHistorico}
                  onChangeCheckbox={e => onChangeConsideraHistorico(e)}
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
              <div className="col-sm-12 col-md-6 col-lg-9 col-xl-5 mb-2">
                <SelectComponent
                  label="DRE"
                  lista={listaDres}
                  valueOption="valor"
                  valueText="desc"
                  disabled={listaDres?.length === 1}
                  onChange={onChangeDre}
                  valueSelect={codigoDre}
                  placeholder="Diretoria Regional de Educação (DRE)"
                  showSearch
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-9 col-xl-5 mb-2">
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
              <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-2">
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
              <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-2">
                <SelectComponent
                  lista={listaSemestre}
                  valueOption="valor"
                  valueText="desc"
                  label="Semestre"
                  disabled={
                    !modalidadeId ||
                    String(modalidadeId) !== String(modalidade.EJA) ||
                    (listaSemestre && listaSemestre.length === 1)
                  }
                  valueSelect={semestre}
                  onChange={onChangeSemestre}
                  placeholder="Selecione o semestre"
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-2">
                <SelectComponent
                  lista={listaAnosEscolares}
                  valueOption="valor"
                  valueText="descricao"
                  label="Ano"
                  disabled={
                    listaAnosEscolares && listaAnosEscolares.length === 1
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
              </div>
              <div className="col-sm-12 col-md-9 col-lg-3 col-xl-3 mb-2">
                <SelectComponent
                  lista={listaComponenteCurricular}
                  valueOption="valor"
                  valueText="desc"
                  label="Componente Curricular"
                  disabled={
                    listaComponenteCurricular &&
                    listaComponenteCurricular.length === 1
                  }
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
              </div>
              <div className="col-sm-12 col-md-3 col-lg-3 col-xl-2 mb-2">
                <SelectComponent
                  lista={listaBimestre}
                  valueOption="valor"
                  valueText="desc"
                  label="Bimestre"
                  disabled={listaBimestre && listaBimestre.length === 1}
                  valueSelect={bimestres}
                  onChange={onChangeBimestre}
                  placeholder="Selecione o bimestre"
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3 col-xl-2 mb-2">
                <SelectComponent
                  lista={listaTipoNota}
                  valueOption="valor"
                  valueText="desc"
                  label="Tipo de nota"
                  disabled={!anoLetivo}
                  valueSelect={tipoNotaSelecionada}
                  onChange={onChangeTipoNota}
                  placeholder="Selecione o tipo de nota"
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3 col-xl-2 mb-2">
                <SelectComponent
                  lista={listaCondicao}
                  valueOption="valor"
                  valueText="desc"
                  label="Condição"
                  disabled={
                    (listaCondicao && listaCondicao.length === 1) ||
                    campoBloqueado
                  }
                  valueSelect={condicao}
                  onChange={onChangeCondicao}
                  placeholder="Selecione a condição"
                />
              </div>

              <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-2">
                {tipoNotaSelecionada === tipoNota.nota ? (
                  <CampoNumero
                    onChange={onChangeComparacao}
                    value={valorCondicao}
                    min={0}
                    max={10}
                    step={0.5}
                    label="Valor"
                    className="w-100"
                    placeholder="Selecione o valor"
                    disabled={!tipoNotaSelecionada || campoBloqueado}
                  />
                ) : (
                  <SelectComponent
                    label="Valor"
                    lista={listaConceitos}
                    valueOption="id"
                    valueText="valor"
                    valueSelect={valorCondicao}
                    onChange={onChangeComparacao}
                    placeholder="Selecione o valor"
                    disabled={!tipoNotaSelecionada || campoBloqueado}
                  />
                )}
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-2">
                <SelectComponent
                  label="Formato"
                  lista={listaFormatos}
                  valueOption="valor"
                  valueText="desc"
                  valueSelect={formato}
                  onChange={onChangeFormato}
                  placeholder="Selecione o formato"
                />
              </div>
            </div>
          </div>
        </Card>
      </Loader>
    </>
  );
};

export default RelatorioNotasConceitosFinais;
