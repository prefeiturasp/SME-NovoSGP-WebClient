import { Col, Row, Switch } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  CampoData,
  CampoTexto,
  Label,
  Loader,
  SelectAutocomplete,
  SelectComponent,
  CheckboxComponent,
} from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import { Base } from '~/componentes/colors';
import { OPCAO_TODOS } from '~/constantes';
import {
  SGP_DATE_SELECIONAR_DATA_FIM,
  SGP_DATE_SELECIONAR_DATA_INICIO,
} from '~/constantes/ids/date';
import { SGP_INPUT_TEXT_NOME_EVENTO } from '~/constantes/ids/input';
import {
  SGP_SELECT_DRE,
  SGP_SELECT_TIPO_CALENDARIO,
  SGP_SELECT_TIPO_EVENTO,
  SGP_SELECT_UE,
} from '~/constantes/ids/select';
import { SGP_SWITCH_EXIBIR_EVENTO_VALIDO } from '~/constantes/ids/switch';
import ListaLocalOcorrencia from '~/constantes/localOcorrencia';
import { setFiltroListaEventos } from '~/redux/modulos/calendarioEscolar/actions';
import {
  AbrangenciaServico,
  erros,
  ServicoCalendarios,
  ServicoEvento,
} from '~/servicos';
import { ContainerSwitchExibirEventos } from '../eventos.css';
import EventosListaContext from './eventosListaContext';
import { SGP_CHECKBOX_EXIBIR_HISTORICO } from '~/constantes/ids/checkbox';

const EventosListaFiltros = () => {
  const {
    codigoDre,
    setCodigoDre,
    codigoUe,
    setCodigoUe,
    calendarioSelecionado,
    setCalendarioSelecionado,
    setTipoEventoSelecionado,
    tipoEventoSelecionado,
    seFiltrarNovaConsulta,
    setNomeEvento,
    nomeEvento,
    setDataInicio,
    dataInicio,
    setDataFim,
    dataFim,
    setEhEventosTodaRede,
    ehEventosTodaRede,
  } = useContext(EventosListaContext);

  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [carregandoCalendarios, setCarregandoCalendarios] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);

  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaCalendarios, setListaCalendarios] = useState([]);
  const [listaTipoEventos, setListaTipoEventos] = useState([]);
  const [listaTipoEventosFiltrados, setListaTipoEventosFiltrados] = useState(
    []
  );

  const [timeoutBuscarPorNome, setTimeoutBuscarPorNome] = useState('');

  const usuario = useSelector(store => store.usuario);

  const paramsRota = useParams();
  const dispatch = useDispatch();

  const filtroListaEventos = useSelector(
    state => state.calendarioEscolar.filtroListaEventos
  );

  const setarFiltrosSalvos = !!(
    listaCalendarios?.length &&
    filtroListaEventos?.eventoCalendarioId &&
    filtroListaEventos?.codigoDre &&
    filtroListaEventos?.codigoUe &&
    paramsRota?.tipoCalendarioId
  );

  const onChangeTipoEvento = tipo => {
    setTipoEventoSelecionado(tipo);
    seFiltrarNovaConsulta(true);
  };

  const filtrarEventoPorLocalOcorrencia = useCallback(
    listaLocalOcorrencia =>
      listaTipoEventos.filter(evento =>
        listaLocalOcorrencia.find(
          tipoLocal => evento.localOcorrencia === tipoLocal
        )
      ),
    [listaTipoEventos]
  );

  const escolherDadosParaFiltrar = (dre, ue) => {
    const ehTodasDre = dre === OPCAO_TODOS;
    const ehTodasUe = ue === OPCAO_TODOS;
    const eventosSME = ehTodasDre && ehTodasUe;
    const eventosDRE = !ehTodasDre && ehTodasUe;
    const eventosUE = !ehTodasDre && !ehTodasUe;

    let escolherDados = [];
    if (eventosSME) {
      escolherDados = [
        ListaLocalOcorrencia.SME,
        ListaLocalOcorrencia.SMEUE,
        ListaLocalOcorrencia.TODOS,
      ];
    }
    if (eventosDRE) {
      escolherDados = [ListaLocalOcorrencia.DRE, ListaLocalOcorrencia.TODOS];
    }
    if (eventosUE) {
      escolherDados = [
        ListaLocalOcorrencia.UE,
        ListaLocalOcorrencia.SMEUE,
        ListaLocalOcorrencia.TODOS,
      ];
    }
    return escolherDados;
  };

  const filtrarEventos = useCallback(
    (dre, ue) => {
      const dadosFiltro = escolherDadosParaFiltrar(dre, ue);
      const eventosFiltrados = filtrarEventoPorLocalOcorrencia(dadosFiltro);
      setListaTipoEventosFiltrados(eventosFiltrados);
    },
    [filtrarEventoPorLocalOcorrencia]
  );

  useEffect(() => {
    if (codigoDre || codigoUe) {
      filtrarEventos(codigoDre, codigoUe);
    }
  }, [filtrarEventos, codigoDre, codigoUe]);

  const obterListaEventos = useCallback(async () => {
    const resposta = await ServicoEvento.obterTiposEventos().catch(e =>
      erros(e)
    );

    if (resposta?.data?.items?.length) {
      const eventos = resposta.data.items;
      if (eventos?.length === 1) {
        onChangeTipoEvento(String(eventos[0].id));
      }
      setListaTipoEventos(eventos);
    } else {
      setListaTipoEventos([]);
    }

  }, []);

  const obterTiposCalendarios = useCallback(async descricao => {
    setCarregandoCalendarios(true);

    const resposta = await ServicoCalendarios.obterTiposCalendarioAutoComplete(
      descricao
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoCalendarios(false));

    if (resposta?.data) {
      setListaCalendarios(resposta.data);
    } else {
      setListaCalendarios([]);
    }
  }, []);

  const limparQuandoSemCalendario = () => {
    setNomeEvento();
    setTipoEventoSelecionado();
    setDataInicio();
    setDataFim();
  };

  useEffect(() => {
    if (!calendarioSelecionado?.id) {
      limparQuandoSemCalendario();
    }

  }, [calendarioSelecionado]);

  const selecionaTipoCalendario = descricao => {
    const calendario = listaCalendarios?.find(t => t?.descricao === descricao);
    if (calendario) {
      setCalendarioSelecionado(calendario);
      setListaUes([]);
      setCodigoUe();
    } else {
      setCalendarioSelecionado({ descricao });
    }
  };

  const handleSearch = descricao => {
    if (descricao.length > 2 || descricao.length === 0) {
      obterTiposCalendarios(descricao);
    }
  };

  const filtroListaLimparDre = useCallback(() => {
    dispatch(
      setFiltroListaEventos({
        ...filtroListaEventos,
        codigoDre: '',
      })
    );
  }, [dispatch, filtroListaEventos]);

  const obterDres = useCallback(async () => {
    setCarregandoDres(true);
    const resposta = await AbrangenciaServico.buscarDres()
      .catch(e => erros(e))
      .finally(() => setCarregandoDres(false));

    if (resposta?.data?.length) {
      const lista = resposta.data.sort(FiltroHelper.ordenarLista('nome'));

      if (lista?.length === 1) {
        const { codigo } = lista[0];
        setCodigoDre(codigo);
      }

      if (usuario.possuiPerfilSme && lista?.length > 1) {
        lista.unshift({ codigo: OPCAO_TODOS, nome: 'Todas' });
        if (filtroListaEventos?.codigoDre) {
          setCodigoDre(filtroListaEventos?.codigoDre);
        } else {
          setCodigoDre(OPCAO_TODOS);
        }
      } else if (listaDres?.length > 1) {
        if (filtroListaEventos?.codigoDre) {
          setCodigoDre(filtroListaEventos?.codigoDre);
        }
      }

      setListaDres(lista);
    } else {
      setCodigoDre();
      setListaDres([]);
    }

  }, []);

  useEffect(() => {
    obterTiposCalendarios('');
    obterListaEventos();

    return () => {
      clearTimeout(timeoutBuscarPorNome);
    };

  }, [obterTiposCalendarios, obterListaEventos]);

  const setarDreListaAtual = useCallback(() => {
    if (listaDres?.length === 1) {
      setCodigoDre(listaDres[0].codigo);
    } else if (usuario.possuiPerfilSme && listaDres?.length > 1) {
      if (filtroListaEventos?.codigoDre) {
        setCodigoDre(filtroListaEventos?.codigoDre);
        filtroListaLimparDre();
      } else {
        setCodigoDre(OPCAO_TODOS);
      }
    } else if (listaDres?.length > 1) {
      if (filtroListaEventos?.codigoDre) {
        setCodigoDre(filtroListaEventos?.codigoDre);
        filtroListaLimparDre();
      }
    }


  }, [listaDres, usuario, filtroListaEventos]);

  useEffect(() => {
    const temCaledarioNaotemDres = !!(
      calendarioSelecionado?.id && !listaDres?.length
    );
    const temCaledarioTemDres = !!(
      calendarioSelecionado?.id && listaDres?.length
    );

    if (temCaledarioNaotemDres) {
      obterDres();
    } else if (temCaledarioTemDres) {
      setarDreListaAtual();
    } else {
      setCodigoDre();
    }

  }, [obterDres, calendarioSelecionado, listaDres]);

  const onChangeDre = codigo => {
    setCodigoUe();
    setListaUes([]);
    setCodigoDre(codigo);
  };

  const limparFiltrosSalvos = useCallback(() => {
    dispatch(
      setFiltroListaEventos({
        calendarioSelecionado: null,
        codigoDre: '',
        codigoUe: '',
        eventoCalendarioId: false,
      })
    );
  }, [dispatch]);

  const filtroListaLimparUe = useCallback(() => {
    dispatch(
      setFiltroListaEventos({
        ...filtroListaEventos,
        codigoUe: '',
      })
    );
  }, [dispatch, filtroListaEventos]);

  const obterUes = useCallback(async () => {
    const ueTodos = { nome: 'Todas', codigo: OPCAO_TODOS };

    if (codigoDre === OPCAO_TODOS) {
      setListaUes([ueTodos]);
      setCodigoUe(OPCAO_TODOS);
      return;
    }

    const modalidadeConvertida = !calendarioSelecionado?.modalidade
      ? 0
      : ServicoCalendarios.converterModalidade(
          calendarioSelecionado?.modalidade
        );

    setCarregandoUes(true);
    const resposta = await AbrangenciaServico.buscarUes(
      codigoDre,
      '',
      false,
      modalidadeConvertida,consideraHistorico
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoUes(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;

      if (lista?.length === 1) {
        const { codigo } = lista[0];
        setCodigoUe(codigo);
      }

      if (usuario.possuiPerfilSmeOuDre && lista?.length > 1) {
        lista.unshift(ueTodos);
        if (codigoDre && codigoDre !== OPCAO_TODOS) {
          if (filtroListaEventos?.codigoUe) {
            setCodigoUe(filtroListaEventos?.codigoUe);
            filtroListaLimparUe();
          } else {
            setCodigoUe(OPCAO_TODOS);
          }
        }
      } else if (lista?.length > 1) {
        if (filtroListaEventos?.codigoUe) {
          setCodigoDre(filtroListaEventos?.codigoUe);
          filtroListaLimparUe();
        }
      }

      setListaUes(lista);
      limparFiltrosSalvos();
    } else {
      setCodigoUe();
      setListaUes([]);
    }

  }, [codigoDre, calendarioSelecionado, usuario]);

  useEffect(() => {
    if (codigoDre && calendarioSelecionado?.id) {
      obterUes();
    } else {
      setListaUes([]);
      setCodigoUe();
    }

  }, [codigoDre, calendarioSelecionado, obterUes]);

  const onChangeUe = codigo => {
    setCodigoUe(codigo);
  };

  const onChangeNomeEvento = e => {
    const valor = e.target.value;
    setNomeEvento(valor);

    if (timeoutBuscarPorNome) {
      clearTimeout(timeoutBuscarPorNome);
    }
    if (valor) {
      const timeout = setTimeout(() => {
        seFiltrarNovaConsulta(true);
      }, 800);

      setTimeoutBuscarPorNome(timeout);
    } else {
      seFiltrarNovaConsulta(true);
    }
  };

  const filtrarDatas = (inicio, fim) =>
    (inicio && fim && fim >= inicio) || (!inicio && !fim);

  const temErroDataFim = () =>
    (dataInicio && !dataFim) || (dataInicio && dataFim && dataInicio > dataFim);

  const mensagemErroDataFim = () => {
    if (dataInicio && !dataFim) {
      return 'Data obrigatória';
    }
    if (dataInicio && dataFim && dataInicio > dataFim) {
      return 'Data inicial maior que final';
    }
    return '';
  };

  useEffect(() => {
    const tipoCalendarioId = paramsRota?.tipoCalendarioId;

    if (!tipoCalendarioId && filtroListaEventos?.codigoDre) {
      limparFiltrosSalvos();
    }

    if (setarFiltrosSalvos) {
      // Quando voltar da tela de cadastro de Eventos setar filtros!
      const tipoCalendarioIdParseado = Number(tipoCalendarioId);
      const tipoCalendarioParaSetar = listaCalendarios.find(
        item => item.id === tipoCalendarioIdParseado
      );

      if (tipoCalendarioParaSetar) {
        setCalendarioSelecionado(tipoCalendarioParaSetar);
      }
    }

  }, [paramsRota, listaCalendarios, filtroListaEventos, limparFiltrosSalvos]);

  const onCheckedConsideraHistorico = e => {
    limparFiltrosSelecionados();
    setConsideraHistorico(e.target.checked);
  };
  const limparFiltrosSelecionados = () => {
    setCodigoUe();
    setListaUes([]);
    setCodigoDre();
  };


  return (
    <Col span={24}>
      <Row gutter={[16, 16]}>
        <Col sm={24} md={12} xl={8}>
        <div className="col-sm-24 mb-4">
              <CheckboxComponent
                id={SGP_CHECKBOX_EXIBIR_HISTORICO}
                label="Exibir histórico?"
                onChangeCheckbox={onCheckedConsideraHistorico}
                checked={consideraHistorico}
              />
            </div>
          <Loader loading={carregandoCalendarios} tip="">
            <SelectAutocomplete
              id={SGP_SELECT_TIPO_CALENDARIO}
              label="Calendário"
              showList
              isHandleSearch
              placeholder="Selecione o calendário"
              className="ant-col-md-24"
              name="tipoCalendarioId"
              lista={listaCalendarios || []}
              valueField="id"
              textField="descricao"
              onSelect={valor => selecionaTipoCalendario(valor)}
              onChange={valor => selecionaTipoCalendario(valor)}
              handleSearch={handleSearch}
              value={calendarioSelecionado?.descricao || ''}
              allowClear={false}
            />
          </Loader>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col md={24} xl={12}>
          <Loader loading={carregandoDres} tip="">
            <SelectComponent
              id={SGP_SELECT_DRE}
              label="Diretoria Regional de Educação (DRE)"
              lista={listaDres || []}
              valueOption="codigo"
              valueText="nome"
              disabled={!calendarioSelecionado?.id || listaDres?.length === 1}
              onChange={onChangeDre}
              valueSelect={codigoDre || undefined}
              placeholder="Selecione uma DRE"
              showSearch
            />
          </Loader>
        </Col>
        <Col md={24} xl={12}>
          <Loader loading={carregandoUes} tip="">
            <SelectComponent
              id={SGP_SELECT_UE}
              label="Unidade Escolar (UE)"
              lista={listaUes || []}
              valueOption="codigo"
              valueText="nome"
              disabled={!codigoDre || listaUes?.length === 1}
              onChange={onChangeUe}
              valueSelect={codigoUe || undefined}
              placeholder="Selecione uma UE"
              showSearch
            />
          </Loader>
        </Col>
        <Col sm={24} md={12} xl={8}>
          <CampoTexto
            id={SGP_INPUT_TEXT_NOME_EVENTO}
            label="Nome do evento"
            placeholder="Pesquise o evento pelo nome"
            onChange={onChangeNomeEvento}
            value={nomeEvento}
            desabilitado={!calendarioSelecionado?.id}
            iconeBusca
            allowClear
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <SelectComponent
            id={SGP_SELECT_TIPO_EVENTO}
            label="Tipo de evento"
            lista={listaTipoEventosFiltrados}
            valueOption="id"
            valueText="descricao"
            onChange={onChangeTipoEvento}
            valueSelect={tipoEventoSelecionado || undefined}
            placeholder="Selecione o tipo de evento"
            disabled={
              !calendarioSelecionado?.id || listaTipoEventos?.length === 1
            }
          />
        </Col>
        <Col sm={12} md={6} xl={4}>
          <CampoData
            id={SGP_DATE_SELECIONAR_DATA_INICIO}
            label="Data início"
            formatoData="DD/MM/YYYY"
            onChange={data => {
              setDataInicio(data);
              if (filtrarDatas(data, dataFim)) {
                seFiltrarNovaConsulta(true);
              }
            }}
            placeholder="Data início"
            desabilitado={!calendarioSelecionado?.id}
            valor={dataInicio}
            temErro={!dataInicio && dataFim}
            mensagemErro={!dataInicio && dataFim ? 'Data obrigatória' : ''}
          />
        </Col>
        <Col sm={12} md={6} xl={4}>
          <CampoData
            id={SGP_DATE_SELECIONAR_DATA_FIM}
            label="Data fim"
            formatoData="DD/MM/YYYY"
            onChange={data => {
              setDataFim(data);
              if (filtrarDatas(dataInicio, data)) {
                seFiltrarNovaConsulta(true);
              }
            }}
            placeholder="Data fim"
            valor={dataFim}
            desabilitado={!calendarioSelecionado?.id}
            temErro={temErroDataFim()}
            mensagemErro={mensagemErroDataFim()}
          />
        </Col>
        {usuario?.possuiPerfilSme &&
        codigoDre === OPCAO_TODOS &&
        codigoUe === OPCAO_TODOS ? (
          <Col span={24}>
            <ContainerSwitchExibirEventos>
              <Switch
                id={SGP_SWITCH_EXIBIR_EVENTO_VALIDO}
                onChange={() => {
                  setEhEventosTodaRede(!ehEventosTodaRede);
                  seFiltrarNovaConsulta(true);
                }}
                checked={ehEventosTodaRede}
                size="default"
                style={{ marginRight: '10px', color: Base.Roxo }}
              />
              <Label text="Exibir somente eventos válidos para toda a rede" />
            </ContainerSwitchExibirEventos>
          </Col>
        ) : (
          ''
        )}
      </Row>
    </Col>
  );
};

export default EventosListaFiltros;
