import * as moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  CampoData,
  CheckboxComponent,
  Loader,
  RadioGroupButton,
  SelectAutocomplete,
  SelectComponent,
} from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import Card from '~/componentes/card';
import { ModalidadeDTO } from '~/dtos';
import AbrangenciaServico from '~/servicos/Abrangencia';
import { erros, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';
import history from '~/servicos/history';
import ServicoComunicados from '~/servicos/Paginas/Gestao/Comunicados/ServicoComunicados';
import ServicoFiltroRelatorio from '~/servicos/Paginas/FiltroRelatorio/ServicoFiltroRelatorio';
import ServicoDashboardEscolaAqui from '~/servicos/Paginas/Dashboard/ServicoDashboardEscolaAqui';
import ServicoRelatorioLeitura from '~/servicos/Paginas/Relatorios/EscolaAqui/Leitura/ServicoRelatorioLeitura';
import FiltroHelper from '~componentes-sgp/filtro/helper';
import { OPCAO_TODOS } from '~/constantes/constantes';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import { URL_HOME } from '~/constantes';

const RelatorioLeitura = () => {
  const usuario = useSelector(store => store.usuario);
  const { possuiPerfilSme, possuiPerfilDre } = usuario;

  const [exibirLoaderGeral, setExibirLoaderGeral] = useState(false);
  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [carregandoModalidade, setCarregandoModalidade] = useState(false);
  const [carregandoAnosEscolares, setCarregandoAnosEscolares] = useState(false);
  const [carregandoTurma, setCarregandoTurma] = useState(false);
  const [carregandoComunicados, setCarregandoComunicados] = useState(false);

  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [listaAnosEscolares, setListaAnosEscolares] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaTurmasOriginal, setListaTurmasOriginal] = useState([]);
  const [listaComunicado, setListaComunicado] = useState([]);

  const [anoLetivo, setAnoLetivo] = useState();
  const [codigoDre, setCodigoDre] = useState();
  const [codigoUe, setCodigoUe] = useState();
  const [modalidadeId, setModalidadeId] = useState();
  const [semestre, setSemestre] = useState();
  const [anosEscolares, setAnosEscolares] = useState();
  const [turmaId, setTurmaId] = useState();
  const [dataInicio, setDataInicio] = useState();
  const [dataFim, setDataFim] = useState();
  const [comunicado, setComunicado] = useState();
  const [pesquisaComunicado, setPesquisaComunicado] = useState('');
  const [
    listarResponsaveisEstudantes,
    setListarResponsaveisEstudantes,
  ] = useState(false);
  const [listarComunicadosExpirados, setListarComunicadosExpirados] = useState(
    false
  );

  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [desabilitarGerar, setDesabilitarGerar] = useState(true);
  const [clicouBotaoGerar, setClicouBotaoGerar] = useState(false);
  const [timeoutCampoPesquisa, setTimeoutCampoPesquisa] = useState();

  const opcoesRadioSimNao = [
    { label: 'Não', value: false },
    { label: 'Sim', value: true },
  ];

  const onChangeAnoLetivo = async valor => {
    setCodigoDre();
    setCodigoUe();
    setModalidadeId();
    setTurmaId();
    setAnoLetivo(valor);
  };

  const onChangeDre = valor => {
    setCodigoDre(valor);
    setCodigoUe();
    setModalidadeId();
    setTurmaId();
    setCodigoUe(undefined);
    setClicouBotaoGerar(false);
  };

  const onChangeUe = valor => {
    setModalidadeId();
    setTurmaId();
    setCodigoUe(valor);
  };

  const onChangeModalidade = valor => {
    setTurmaId();
    setModalidadeId(valor);
    setClicouBotaoGerar(false);
  };

  const onChangeSemestre = valor => {
    setSemestre(valor);
    setClicouBotaoGerar(false);
  };

  const onChangeAno = valor => {
    setAnosEscolares(valor);
    setTurmaId();
  };

  const onChangeTurma = valor => {
    setTurmaId(valor);
    setClicouBotaoGerar(false);
  };

  const [anoAtual] = useState(window.moment().format('YYYY'));

  const obterDres = useCallback(async () => {
    if (anoLetivo) {
      setCarregandoDres(true);
      const resposta = await AbrangenciaServico.buscarDres(
        `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`,
        consideraHistorico
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoDres(false));

      if (resposta?.data?.length) {
        const lista = resposta.data.map(item => ({
          desc: item.nome,
          valor: String(item.codigo),
          abrev: item.abreviacao,
        }));

        if (lista?.length > 1 && possuiPerfilSme) {
          lista.unshift({ valor: OPCAO_TODOS, desc: 'Enviado para todas' });
        }

        setListaDres(lista);

        if (lista?.length === 1) {
          setCodigoDre(lista[0].valor);
        }
      } else {
        setListaDres([]);
        setCodigoDre(undefined);
      }
    }
  }, [anoLetivo, consideraHistorico, possuiPerfilSme]);

  useEffect(() => {
    obterDres();
  }, [obterDres, anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (codigoDre === OPCAO_TODOS) {
      setCodigoUe(OPCAO_TODOS);
    }
  }, [codigoDre]);

  useEffect(() => {
    let desabilitar = !anoLetivo || !codigoDre || !codigoUe || clicouBotaoGerar;

    const temDreUeSelecionada =
      codigoDre &&
      codigoUe &&
      codigoDre !== OPCAO_TODOS &&
      codigoUe !== OPCAO_TODOS;

    if (!desabilitar && temDreUeSelecionada && !modalidadeId) {
      desabilitar = true;
    }

    if (
      !desabilitar &&
      temDreUeSelecionada &&
      modalidadeId &&
      modalidadeId === ModalidadeDTO.EJA &&
      !semestre
    ) {
      desabilitar = true;
    }

    setDesabilitarGerar(desabilitar);
  }, [
    anoLetivo,
    codigoDre,
    codigoUe,
    turmaId,
    modalidadeId,
    semestre,
    clicouBotaoGerar,
  ]);

  useEffect(() => {
    if (
      !codigoDre ||
      !codigoUe ||
      codigoDre === OPCAO_TODOS ||
      codigoUe === OPCAO_TODOS
    ) {
      setListarResponsaveisEstudantes(false);
    }
  }, [codigoDre, codigoUe]);

  useEffect(() => {
    setAnoLetivo(anoAtual);
  }, [consideraHistorico, anoAtual]);

  const obterUes = useCallback(async () => {
    if (codigoDre) {
      if (codigoDre === OPCAO_TODOS) {
        setListaUes([{ valor: OPCAO_TODOS, desc: 'Enviado para todas' }]);
        return;
      }

      setCarregandoUes(true);
      const resposta = await AbrangenciaServico.buscarUes(
        codigoDre,
        `v1/abrangencias/${consideraHistorico}/dres/${codigoDre}/ues?anoLetivo=${anoLetivo}&consideraNovasUEs=${true}`,
        true
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoUes(false));

      if (resposta?.data?.length) {
        const lista = resposta.data.map(item => ({
          desc: item.nome,
          valor: String(item.codigo),
        }));

        if (lista?.length > 1 && (possuiPerfilSme || possuiPerfilDre)) {
          lista.unshift({ valor: OPCAO_TODOS, desc: 'Enviado para todas' });
        }

        if (lista?.length === 1) {
          setCodigoUe(lista[0].valor);
        }

        setListaUes(lista);
      } else {
        setListaUes([]);
      }
    }
  }, [
    consideraHistorico,
    anoLetivo,
    codigoDre,
    possuiPerfilDre,
    possuiPerfilSme,
  ]);

  useEffect(() => {
    if (codigoDre) {
      obterUes();
    } else {
      setCodigoUe();
      setListaUes([]);
    }
  }, [codigoDre, anoLetivo, consideraHistorico, obterUes]);

  const obterModalidades = async (ue, ano) => {
    if (ue && ano) {
      setCarregandoModalidade(true);
      const {
        data,
      } = await ServicoFiltroRelatorio.obterModalidadesPorAbrangencia(ue, true);

      if (data) {
        const lista = data.map(item => ({
          desc: item.descricao,
          valor: String(item.valor),
        }));

        if (lista && lista.length && lista.length === 1) {
          setModalidadeId(lista[0].valor);
        }
        setListaModalidades(lista);
      }
      setCarregandoModalidade(false);
    }
  };

  useEffect(() => {
    if (anoLetivo && codigoUe) {
      obterModalidades(codigoUe, anoLetivo);
    } else {
      setModalidadeId();
      setListaModalidades([]);
    }
  }, [anoLetivo, codigoUe]);

  const obterTurmas = useCallback(async () => {
    if (codigoDre && codigoUe && modalidadeId) {
      setCarregandoTurma(true);
      const { data } = await AbrangenciaServico.buscarTurmas(
        codigoUe,
        modalidadeId,
        '',
        anoLetivo,
        consideraHistorico,
        false,
        undefined,
        true
      );
      if (data) {
        const turmas = [];

        data.map(item =>
          turmas.push({
            desc: item.nome,
            valor: item.codigo,
            id: item.id,
            ano: item.ano,
            nomeFiltro: item.nomeFiltro,
          })
        );
        if (turmas.length > 1) {
          turmas.unshift({ valor: OPCAO_TODOS, nomeFiltro: 'Todas' });
        }

        setListaTurmas(turmas);
        setListaTurmasOriginal(turmas);
        if (turmas.length === 1) {
          setTurmaId(turmas[0].valor);
        }
      }
      setCarregandoTurma(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalidadeId]);

  const filterTurmasAnoSelecionado = useCallback(() => {
    const turmas = listaTurmasOriginal.filter(a => a.ano === anosEscolares);
    
    if (turmas?.length > 1) {
      turmas.unshift({ valor: OPCAO_TODOS, desc: 'Todas', nomeFiltro: 'Todas' });
    }
    setListaTurmas(turmas);
  }, [anosEscolares, listaTurmasOriginal]);

  useEffect(() => {
    if (anosEscolares) {
      filterTurmasAnoSelecionado();
    } else {
      setListaTurmas(listaTurmasOriginal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anosEscolares, listaTurmasOriginal]);

  useEffect(() => {
    if (modalidadeId && codigoUe && codigoDre) {
      obterTurmas();
    } else {
      setTurmaId();
      setListaTurmas([]);
      setListaTurmasOriginal([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalidadeId]);

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnosLetivos(true);
    let anosLetivos = [];

    const anosLetivoComHistorico = await FiltroHelper.obterAnosLetivos({
      consideraHistorico: true,
    });
    const anosLetivoSemHistorico = await FiltroHelper.obterAnosLetivos({
      consideraHistorico: false,
    });

    anosLetivos = anosLetivos.concat(anosLetivoComHistorico);

    anosLetivoSemHistorico.forEach(ano => {
      if (!anosLetivoComHistorico.find(a => a.valor === ano.valor)) {
        anosLetivos.push(ano);
      }
    });

    if (!anosLetivos.length) {
      anosLetivos.push({
        desc: anoAtual,
        valor: anoAtual,
      });
    }

    if (anosLetivos && anosLetivos.length) {
      const temAnoAtualNaLista = anosLetivos.find(
        item => String(item.valor) === String(anoAtual)
      );
      if (temAnoAtualNaLista) setAnoLetivo(anoAtual);
      else setAnoLetivo(anosLetivos[0].valor);
    }

    setListaAnosLetivo(anosLetivos);
    setCarregandoAnosLetivos(false);
  }, [anoAtual]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  const obterSemestres = async (
    modalidadeSelecionada,
    anoLetivoSelecionado
  ) => {
    const retorno = await api.get(
      `v1/abrangencias/false/semestres?anoLetivo=${anoLetivoSelecionado}&modalidade=${modalidadeSelecionada ||
        0}`
    );
    if (retorno && retorno.data) {
      const lista = retorno.data.map(periodo => {
        return { desc: periodo, valor: periodo };
      });

      if (lista && lista.length && lista.length === 1) {
        setSemestre(lista[0].valor);
      }
      setListaSemestres(lista);
    }
  };

  useEffect(() => {
    if (
      modalidadeId &&
      anoLetivo &&
      String(modalidadeId) === String(ModalidadeDTO.EJA)
    ) {
      obterSemestres(modalidadeId, anoLetivo);
    } else {
      setSemestre();
      setListaSemestres([]);
    }
  }, [obterAnosLetivos, modalidadeId, anoLetivo]);

  const obterAnosEscolaresPorModalidade = useCallback(async () => {
    const resposta = await ServicoComunicados.buscarAnosPorModalidade(
      [modalidadeId],
      codigoUe
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoAnosEscolares(false));

    if (resposta.data?.length) {
      const dadosMap = resposta.data.map(item => {
        return {
          valor: item.ano,
          descricao: item.ano,
        };
      });
      setListaAnosEscolares(dadosMap);
    } else {
      setListaAnosEscolares([]);
    }
  }, [modalidadeId, codigoUe]);

  useEffect(() => {
    if (
      modalidadeId &&
      (Number(modalidadeId) === ModalidadeDTO.ENSINO_MEDIO ||
        Number(modalidadeId) === ModalidadeDTO.FUNDAMENTAL)
    ) {
      obterAnosEscolaresPorModalidade();
    } else {
      setAnosEscolares();
      setListaAnosEscolares([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalidadeId]);

  const cancelar = async () => {
    await setCodigoUe();
    await setCodigoDre();
    await setListaComunicado();
    await setComunicado();
    await await setListarComunicadosExpirados(false);
    await setListarResponsaveisEstudantes(false);
    await setPesquisaComunicado();
    await setDataFim();
    await setDataInicio();
    await setTurmaId();
    await setAnosEscolares();
    await setSemestre();
    await setModalidadeId();
    await setAnoLetivo();
    await setAnoLetivo(anoAtual);
  };

  const obterCominicadoId = useCallback(
    descricaoComunicado => {
      let comunicadoId = '';
      if (descricaoComunicado) {
        const comunicadoAtual = listaComunicado.find(
          item => item.descricao === descricaoComunicado
        );
        if (comunicadoAtual?.id) {
          comunicadoId = comunicadoAtual.id;
        }
      }

      return comunicadoId;
    },
    [listaComunicado]
  );

  const gerar = async () => {
    const params = {
      codigoDre,
      codigoUe,
      anoLetivo,
      semestre,
      ano: anoLetivo,
      turma: turmaId,
      dataInicio,
      dataFim,
      notificacaoId: obterCominicadoId(comunicado),
      listarResponsaveisEstudantes,
      listarComunicadosExpirados,
    };

    setExibirLoaderGeral(true);
    setClicouBotaoGerar(true);

    const retorno = await ServicoRelatorioLeitura.gerar(params)
      .catch(e => erros(e))
      .finally(setExibirLoaderGeral(false));
    if (retorno && retorno.status === 200) {
      sucesso(
        'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
      );
    }
  };

  const desabilitarData = current => {
    if (current && anoLetivo) {
      const ano = moment(`${anoLetivo}-01-01`);
      return current < ano.startOf('year') || current > ano.endOf('year');
    }
    return false;
  };

  const handleSearch = descricao => {
    if (descricao.length > 3 || descricao.length === 0) {
      if (timeoutCampoPesquisa) {
        clearTimeout(timeoutCampoPesquisa);
      }
      const timeout = setTimeout(() => {
        setPesquisaComunicado(descricao);
      }, 500);
      setTimeoutCampoPesquisa(timeout);
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      if (isSubscribed && anoLetivo && codigoDre && codigoUe && modalidadeId) {
        if (
          modalidadeId &&
          String(modalidadeId) === String(ModalidadeDTO.EJA) &&
          !semestre
        ) {
          return;
        }

        setCarregandoComunicados(true);
        const resposta = await ServicoDashboardEscolaAqui.obterComunicadosAutoComplete(
          anoLetivo || '',
          codigoDre === OPCAO_TODOS ? '' : codigoDre || '',
          codigoUe === OPCAO_TODOS ? '' : codigoUe || '',
          modalidadeId,
          semestre || '',
          anosEscolares || '',
          turmaId === OPCAO_TODOS ? '' : turmaId || '',
          dataInicio || '',
          dataFim || '',
          pesquisaComunicado || ''
        )
          .catch(e => erros(e))
          .finally(() => setCarregandoComunicados(false));

        if (resposta?.data?.length) {
          const lista = resposta.data.map(item => {
            return {
              id: item.id,
              descricao: `${item.id} - ${item.titulo} - ${moment(
                item.dataEnvio
              ).format('DD/MM/YYYY')}`,
            };
          });
          setListaComunicado([]);
          setListaComunicado(lista);
        } else {
          setListaComunicado([]);
        }
        if (!pesquisaComunicado) {
          setComunicado();
        }
      } else {
        setListaComunicado([]);
        setComunicado();
        setPesquisaComunicado();
      }
    })();

    return () => {
      isSubscribed = false;
    };
  }, [
    anoLetivo,
    codigoDre,
    codigoUe,
    modalidadeId,
    semestre,
    anosEscolares,
    turmaId,
    dataInicio,
    dataFim,
    pesquisaComunicado,
  ]);

  const onChangeIntervaloDatas = valor => {
    const [dtInicio, dtFim] = valor;
    if (dtFim) {
      setDataInicio(dtInicio);
      setDataFim(dtFim);
      setClicouBotaoGerar(false);
    }
  };

  return (
    <Loader loading={exibirLoaderGeral}>
      <Cabecalho pagina="Relatório de leitura">
        <BotoesAcaoRelatorio
          onClickVoltar={() => {
            history.push(URL_HOME);
          }}
          onClickCancelar={cancelar}
          onClickGerar={gerar}
          desabilitarBtnGerar={desabilitarGerar}
        />
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 mb-2">
              <CheckboxComponent
                label="Exibir histórico?"
                onChangeCheckbox={e => {
                  setAnoLetivo();
                  setCodigoDre();
                  setDataInicio();
                  setDataFim();
                  setConsideraHistorico(e.target.checked);
                }}
                checked={consideraHistorico}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-4 col-lg-2 col-xl-2 mb-3">
              <Loader loading={carregandoAnosLetivos}>
                <SelectComponent
                  id="drop-ano-letivo"
                  label="Ano Letivo"
                  lista={listaAnosLetivo}
                  valueOption="valor"
                  valueText="desc"
                  disabled={
                    !consideraHistorico || listaAnosLetivo?.length === 1
                  }
                  onChange={onChangeAnoLetivo}
                  valueSelect={anoLetivo}
                  placeholder="Ano letivo"
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5 mb-3">
              <Loader loading={carregandoDres}>
                <SelectComponent
                  id="drop-dre"
                  label="Diretoria Regional de Educação (DRE)"
                  lista={listaDres}
                  valueOption="valor"
                  valueText="desc"
                  disabled={!anoLetivo || listaDres?.length === 1}
                  onChange={onChangeDre}
                  valueSelect={codigoDre}
                  placeholder="Diretoria Regional De Educação (DRE)"
                  showSearch
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5 mb-3">
              <Loader loading={carregandoUes}>
                <SelectComponent
                  id="drop-ue"
                  label="Unidade Escolar (UE)"
                  lista={listaUes}
                  valueOption="valor"
                  valueText="desc"
                  disabled={!codigoDre || listaUes?.length === 1}
                  onChange={onChangeUe}
                  valueSelect={codigoUe}
                  placeholder="Unidade Escolar (UE)"
                  showSearch
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 mb-3">
              <Loader loading={carregandoModalidade}>
                <SelectComponent
                  id="drop-modalidade"
                  label="Modalidade"
                  lista={listaModalidades}
                  valueOption="valor"
                  valueText="desc"
                  disabled={!codigoUe || listaModalidades?.length === 1}
                  onChange={onChangeModalidade}
                  valueSelect={modalidadeId}
                  placeholder="Modalidade"
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-4 mb-3">
              <SelectComponent
                id="drop-semestre"
                lista={listaSemestres}
                valueOption="valor"
                valueText="desc"
                label="Semestre"
                disabled={
                  !modalidadeId ||
                  listaSemestres?.length === 1 ||
                  String(modalidadeId) !== String(ModalidadeDTO.EJA)
                }
                valueSelect={semestre}
                onChange={onChangeSemestre}
                placeholder="Semestre"
              />
            </div>
            <div className="col-sm-12 col-md-4 mb-3">
              <Loader loading={carregandoAnosEscolares}>
                <SelectComponent
                  id="select-ano-escolar"
                  lista={listaAnosEscolares}
                  valueOption="valor"
                  valueText="descricao"
                  label="Ano"
                  disabled={!modalidadeId || listaAnosEscolares?.length === 1}
                  valueSelect={anosEscolares}
                  onChange={onChangeAno}
                  placeholder="Selecione o ano"
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-4 mb-3">
              <Loader loading={carregandoTurma}>
                <SelectComponent
                  id="drop-turma"
                  lista={listaTurmas}
                  valueOption="valor"
                  valueText="nomeFiltro"
                  label="Turma"
                  disabled={
                    !modalidadeId ||
                    listaTurmas?.length === 1 ||
                    codigoUe === OPCAO_TODOS
                  }
                  valueSelect={turmaId}
                  placeholder="Turma"
                  onChange={onChangeTurma}
                  showSearch
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-4 mb-3">
              <CampoData
                className="intervalo-datas"
                label="Data de envio"
                formatoData="DD/MM/YYYY"
                onChange={onChangeIntervaloDatas}
                desabilitarData={desabilitarData}
                valor={[dataInicio, dataFim]}
                intervaloDatas
              />
            </div>
            <div className="col-sm-12 col-md-4 mb-3">
              <Loader loading={carregandoComunicados}>
                <SelectAutocomplete
                  id="autocomplete-comunicados"
                  label="Comunicado"
                  showList
                  isHandleSearch
                  placeholder="Selecione um comunicado"
                  className="col-md-12"
                  lista={listaComunicado}
                  valueField="id"
                  textField="descricao"
                  onSelect={setComunicado}
                  onChange={valor => {
                    setComunicado(valor);
                    setClicouBotaoGerar(false);
                  }}
                  handleSearch={handleSearch}
                  value={comunicado}
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-3">
              <RadioGroupButton
                label="Listar responsáveis/estudantes"
                opcoes={opcoesRadioSimNao}
                valorInicial
                onChange={e => {
                  setListarResponsaveisEstudantes(e.target.value);
                  setClicouBotaoGerar(false);
                }}
                value={listarResponsaveisEstudantes}
                desabilitado={
                  !codigoDre ||
                  !codigoUe ||
                  codigoDre === OPCAO_TODOS ||
                  codigoUe === OPCAO_TODOS
                }
              />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-3">
              <RadioGroupButton
                label="Listar comunicados expirados"
                opcoes={opcoesRadioSimNao}
                valorInicial
                onChange={e => {
                  setClicouBotaoGerar(false);
                  setListarComunicadosExpirados(e.target.value);
                }}
                value={listarComunicadosExpirados}
              />
            </div>
          </div>
        </div>
      </Card>
    </Loader>
  );
};

export default RelatorioLeitura;
