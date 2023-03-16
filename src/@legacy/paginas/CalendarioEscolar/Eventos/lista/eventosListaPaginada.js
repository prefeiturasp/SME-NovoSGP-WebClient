import { Col } from 'antd';
import * as moment from 'moment';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ListaPaginada } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { RotasDto } from '~/dtos';
import entidadeStatusDto from '~/dtos/entidadeStatusDto';
import { setFiltroListaEventos } from '~/redux/modulos/calendarioEscolar/actions';
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
    ehEventosTodaRede,
  } = useContext(EventosListaContext);

  const [filtros, setFiltros] = useState({});
  const [filtroEhValido, setFiltroEhValido] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (filtros?.tipoCalendarioId) {
      setFiltroEhValido(!!(filtros?.tipoCalendarioId && codigoDre && codigoUe));
    }
  }, [filtros, codigoDre, codigoUe]);

  const filtrar = useCallback(() => {
    if (calendarioSelecionado?.id && codigoDre && codigoUe) {
      const params = {
        tipoCalendarioId: calendarioSelecionado?.id,
        dreId: codigoDre === OPCAO_TODOS ? '' : codigoDre,
        ueId: codigoUe === OPCAO_TODOS ? '' : codigoUe,
        ehTodasDres: codigoDre === OPCAO_TODOS,
        ehTodasUes: codigoUe === OPCAO_TODOS,
        tipoEventoId: tipoEventoSelecionado,
        nomeEvento,
        dataInicio: dataInicio ? moment(dataInicio).format('MM-DD-YYYY') : '',
        dataFim: dataFim ? moment(dataFim).format('MM-DD-YYYY') : '',
        ehEventosTodaRede,
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
    ehEventosTodaRede,
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

  const descStatus = linha => {
    return linha.status === entidadeStatusDto.AguardandoAprovacao
      ? '(Aguardando aprovação)'
      : '';
  };

  const montarColunaNome = (nome, linha) => {
    return (
      <>
        <div>{`${nome} ${descStatus(linha)}`}</div>
        {linha.descricaoDreUe ? <div>{linha.descricaoDreUe}</div> : ''}
      </>
    );
  };

  const colunas = [
    {
      title: 'Nome do evento',
      dataIndex: 'nome',
      render: montarColunaNome,
    },
    {
      title: 'Tipo de evento',
      dataIndex: 'tipo',
      render: (_, row) => <span> {row.tipoEvento.descricao}</span>,
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
    navigate(
      `${RotasDto.EVENTOS}/editar/${evento.id}/${calendarioSelecionado?.id}`
    );
  };

  const onSelecionarItems = items => {
    setEventosSelecionados(items);
  };

  return (
    <Col span={24} style={{ marginTop: '20px' }}>
      {filtros?.tipoCalendarioId && codigoDre && codigoUe ? (
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
