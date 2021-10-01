import { Col } from 'antd';
import * as moment from 'moment';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ListaPaginada } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { RotasDto } from '~/dtos';
import { setFiltroListaEventos } from '~/redux/modulos/calendarioEscolar/actions';
import { history } from '~/servicos';
import EventosListaContext from './eventosListaContext';

const EventosListaPaginada = () => {
  const {
    codigoUe,
    calendarioSelecionado,
    codigoDre,
    setEventosSelecionados,
    filtrarNovaConsulta,
    seFiltrarNovaConsulta,
    tipoEventoSelecionado,
    nomeEvento,
    dataInicio,
    dataFim,
    exibirEventosTodaRede,
  } = useContext(EventosListaContext);

  const [filtros, setFiltros] = useState({});
  const [filtroEhValido, setFiltroEhValido] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (filtros?.tipoCalendarioId) {
      setFiltroEhValido(!!(filtros?.tipoCalendarioId && codigoDre && codigoUe));
    }
  }, [filtros]);

  const filtrar = useCallback(() => {
    if (codigoUe) {
      const params = {
        tipoCalendarioId: calendarioSelecionado?.id,
        dreId: codigoDre === OPCAO_TODOS ? '' : codigoDre,
        ueId: codigoUe === OPCAO_TODOS ? '' : codigoUe,
        ehTodasDres: codigoDre === OPCAO_TODOS,
        ehTodasUes: codigoUe === OPCAO_TODOS,
        tipoEventoId: tipoEventoSelecionado,
        nomeEvento,
        dataInicio: dataInicio ? moment(dataInicio).format('DD-MM-YYYY') : '',
        dataFim: dataFim ? moment(dataFim).format('DD-MM-YYYY') : '',
        exibirEventosTodaRede,
      };
      setFiltros({ ...params });
    } else {
      setFiltros({});
      setFiltroEhValido(false);
    }
  }, [
    calendarioSelecionado,
    codigoDre,
    codigoUe,
    tipoEventoSelecionado,
    nomeEvento,
    dataInicio,
    dataFim,
    exibirEventosTodaRede,
  ]);

  useEffect(() => {
    filtrar();
  }, [calendarioSelecionado, codigoDre, codigoUe]);

  useEffect(() => {
    if (filtrarNovaConsulta) {
      filtrar();
      seFiltrarNovaConsulta(false);
    }
  }, [filtrarNovaConsulta]);

  const formatarCampoData = data => {
    let dataFormatada = '';
    if (data) {
      dataFormatada = moment(data).format('DD/MM/YYYY');
    }
    return dataFormatada;
  };

  const colunas = [
    {
      title: 'Nome do evento',
      dataIndex: 'nome',
    },
    {
      title: 'Tipo de evento',
      dataIndex: 'tipo',
      render: (text, row) => <span> {row.tipoEvento.descricao}</span>,
    },
    {
      title: 'Cadastrado por',
      dataIndex: 'criadoPor',
      render: (criadoPor, linha) => `${criadoPor} (${linha.criadoRF})`,
    },
    {
      title: 'Data do cadastro',
      dataIndex: 'criadoEm',
      render: data => formatarCampoData(data),
    },
    {
      title: 'Data início e fim',
      dataIndex: 'dataInicio',
      render: (inicio, linha) => {
        return `${formatarCampoData(inicio)} - ${formatarCampoData(
          linha.dataFim
        )}`;
      },
    },
  ];
  const salvarFiltros = () => {
    dispatch(
      setFiltroListaEventos({
        calendarioSelecionado,
        codigoDre,
        codigoUe,
        eventoCalendarioId: true,
      })
    );
  };

  const onClickEditar = evento => {
    salvarFiltros();
    history.push(
      `${RotasDto.EVENTOS}/editar/${evento.id}/${calendarioSelecionado?.id}`
    );
  };

  const onSelecionarItems = items => {
    setEventosSelecionados(items);
  };

  return (
    <Col span={24} style={{ marginTop: '20px' }}>
      {calendarioSelecionado?.id && codigoDre && codigoUe ? (
        <ListaPaginada
          url="v1/calendarios/eventos"
          id="lista-eventos"
          colunas={colunas}
          filtro={filtros}
          onClick={onClickEditar}
          selecionarItems={onSelecionarItems}
          multiSelecao
          filtroEhValido={filtroEhValido}
        />
      ) : (
        ''
      )}
    </Col>
  );
};

export default EventosListaPaginada;
