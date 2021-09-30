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
} from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import { Base } from '~/componentes/colors';
import { OPCAO_TODOS } from '~/constantes';
import { setFiltroListaEventos } from '~/redux/modulos/calendarioEscolar/actions';
import {
  AbrangenciaServico,
  erros,
  ServicoCalendarios,
  ServicoEvento,
} from '~/servicos';
import { ContainerSwitchExibirEventos } from '../eventos.css';
import EventosListaContext from './eventosListaContext';

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
    setExibirEventosTodaRede,
    exibirEventosTodaRede,
  } = useContext(EventosListaContext);

  const [carregandoCalendarios, setCarregandoCalendarios] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);

  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaCalendarios, setListaCalendarios] = useState([]);
  const [listaTipoEventos, setListaTipoEventos] = useState([]);

  const usuario = useSelector(store => store.usuario);

  const paramsRota = useParams();
  const dispatch = useDispatch();

  const filtroListaEventos = useSelector(
    state => state.calendarioEscolar.filtroListaEventos
  );

  const onChangeTipoEvento = tipo => {
    setTipoEventoSelecionado(tipo);
    seFiltrarNovaConsulta(true);
  };

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
        setCodigoDre(OPCAO_TODOS);
      }

      setListaDres(lista);
    } else {
      setCodigoDre();
      setListaDres([]);
    }
  }, []);

  useEffect(() => {
    obterTiposCalendarios('');
    obterDres();
    obterListaEventos();
  }, [obterTiposCalendarios, obterDres, obterListaEventos]);

  const onChangeDre = codigo => {
    setCodigoUe();
    setListaUes();
    setCodigoDre(codigo);
  };

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
      modalidadeConvertida
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
      }

      setListaUes(lista);
    } else {
      setCodigoUe();
      setListaUes([]);
    }
  }, [codigoDre, calendarioSelecionado]);

  useEffect(() => {
    if (codigoDre) {
      obterUes();
    } else {
      setListaUes([]);
    }
  }, [codigoDre, obterUes]);

  const onChangeUe = codigo => {
    setCodigoUe(codigo);
  };

  const onChangeNomeEvento = e => {
    setNomeEvento(e.target.value);
    seFiltrarNovaConsulta(true);
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

  useEffect(() => {
    const tipoCalendarioId = paramsRota?.tipoCalendarioId;

    if (!tipoCalendarioId && filtroListaEventos?.codigoDre) {
      limparFiltrosSalvos();
    }

    if (
      listaCalendarios?.length &&
      filtroListaEventos?.eventoCalendarioId &&
      paramsRota?.tipoCalendarioId
    ) {
      // Quando voltar da tela de cadastro de Eventos setar filtros!
      const tipoCalendarioIdParseado = Number(tipoCalendarioId);
      const tipoCalendarioParaSetar = listaCalendarios.find(
        item => item.id === tipoCalendarioIdParseado
      );

      if (tipoCalendarioParaSetar) {
        setCalendarioSelecionado(tipoCalendarioParaSetar);
        if (filtroListaEventos?.codigoDre) {
          setCodigoDre(filtroListaEventos?.codigoDre);
        }
        if (filtroListaEventos?.codigoUe) {
          setCodigoUe(filtroListaEventos?.codigoUe);
        }
      }
    }
  }, [paramsRota, listaCalendarios, filtroListaEventos, limparFiltrosSalvos]);

  return (
    <Col span={24}>
      <Row gutter={[16, 16]}>
        <Col sm={24} md={12} xl={8}>
          <Loader loading={carregandoCalendarios} tip="">
            <SelectAutocomplete
              label="Calendário"
              showList
              isHandleSearch
              placeholder="Selecione o calendário"
              className="ant-col-md-24"
              name="tipoCalendarioId"
              id="select-tipo-calendario"
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
              id="dre"
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
              id="ue"
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
            label="Tipo de evento"
            id="select-tipo-evento"
            lista={listaTipoEventos}
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
                onChange={() => {
                  setExibirEventosTodaRede(!exibirEventosTodaRede);
                  seFiltrarNovaConsulta(true);
                }}
                checked={exibirEventosTodaRede}
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
