import { Col } from 'antd';
import * as moment from 'moment';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ListaPaginada } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { RotasDto } from '~/dtos';
import { setFiltroCalendarioEscolar } from '~/redux/modulos/calendarioEscolar/actions';
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
  } = useContext(EventosListaContext);

  const [filtros, setFiltros] = useState({});
  const [filtroEhValido, setFiltroEhValido] = useState(false);

  const { filtroCalendarioEscolar } = useSelector(
    state => state.calendarioEscolar.filtroCalendarioEscolar
  );

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
    return <span> {dataFormatada}</span>;
  };

  const colunas = [
    {
      title: 'Nome do evento',
      dataIndex: 'nome',
      width: '45%',
    },
    {
      title: 'Tipo de evento',
      dataIndex: 'tipo',
      width: '20%',
      render: (text, row) => <span> {row.tipoEvento.descricao}</span>,
    },
    {
      title: 'Data início',
      dataIndex: 'dataInicio',
      width: '15%',
      render: data => formatarCampoData(data),
    },
    {
      title: 'Data fim',
      dataIndex: 'dataFim',
      width: '15%',
      render: data => formatarCampoData(data),
    },
  ];

  const onClickEditar = evento => {
    setFiltroCalendarioEscolar({
      ...filtroCalendarioEscolar,
      eventoCalendarioId: true,
    });
    history.push(
      `${RotasDto.EVENTOS}/editar/${evento.id}/${calendarioSelecionado?.id}`
    );
  };

  const onSelecionarItems = items => {
    setEventosSelecionados(items);
  };

  return (
    <Col span={24}>
      {calendarioSelecionado?.id && codigoDre && codigoUe ? (
        <ListaPaginada
          url="v1/calendarios/eventos"
          id="lista-eventos"
          colunaChave="id"
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
