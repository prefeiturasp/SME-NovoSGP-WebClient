import { Col } from 'antd';
import * as moment from 'moment';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Base, ListaPaginada } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { modalidadeTipoCalendario, RotasDto } from '~/dtos';
import FechaReabListaContext from './fechaReabListaContext';

export const CampoBimestre = styled.div`
  i {
    color: ${Base.Verde};
  }
`;

const FechaReabListaPaginada = () => {
  const {
    codigoUe,
    calendarioSelecionado,
    codigoDre,
    setIdsReaberturasSelecionadas,
    filtrarNovaConsulta,
    seFiltrarNovaConsulta,
  } = useContext(FechaReabListaContext);

  const navigate = useNavigate();

  const [filtros, setFiltros] = useState({});
  const [filtroEhValido, setFiltroEhValido] = useState(false);
  const [colunasBimestre, setColunasBimestre] = useState();

  useEffect(() => {
    if (filtros?.tipoCalendarioId) {
      setFiltroEhValido(!!(filtros?.tipoCalendarioId && codigoDre && codigoUe));
    }
  }, [filtros, codigoDre, codigoUe]);

  const filtrar = useCallback(() => {
    if (calendarioSelecionado?.id && codigoDre && codigoUe) {
      const params = {
        tipoCalendarioId: calendarioSelecionado?.id,
        dreCodigo: codigoDre === OPCAO_TODOS ? '' : codigoDre,
        ueCodigo: codigoUe === OPCAO_TODOS ? '' : codigoUe,
      };
      setFiltros({ ...params });
    } else {
      setFiltros({});
      setFiltroEhValido(false);
    }
  }, [calendarioSelecionado, codigoDre, codigoUe]);

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
      title: 'Descrição',
      dataIndex: 'descricao',
      width: '65%',
    },
    {
      title: 'Início',
      dataIndex: 'dataInicio',
      width: '15%',
      render: data => formatarCampoData(data),
    },
    {
      title: 'Fim',
      dataIndex: 'dataFim',
      width: '15%',
      render: data => formatarCampoData(data),
    },
    {
      title: 'Bimestres',
      children: colunasBimestre,
    },
  ];

  const onClickEditar = item => {
    navigate(`${RotasDto.PERIODO_FECHAMENTO_REABERTURA}/editar/${item.id}`);
  };

  const onSelecionarItems = ids => {
    setIdsReaberturasSelecionadas(ids);
  };

  const criarCampoBimestre = (index, data) => {
    const bimestre = data[index];
    return bimestre ? (
      <CampoBimestre>
        <i className="fas fa-check" />
      </CampoBimestre>
    ) : (
      <></>
    );
  };

  const getColunasBimestreAnual = () => {
    return [
      {
        title: '1',
        dataIndex: 'bimestres',
        key: '1',
        render: data => criarCampoBimestre(0, data),
      },
      {
        title: '2',
        dataIndex: 'bimestres',
        key: '2',
        render: data => criarCampoBimestre(1, data),
      },
      {
        title: '3',
        dataIndex: 'bimestres',
        key: '3',
        render: data => criarCampoBimestre(2, data),
      },
      {
        title: '4',
        dataIndex: 'bimestres',
        key: '4',
        render: data => criarCampoBimestre(3, data),
      },
    ];
  };

  const getColunasBimestreSemestral = () => {
    return [
      {
        title: '1',
        dataIndex: 'bimestres',
        key: '1',
        render: data => criarCampoBimestre(0, data),
      },
      {
        title: '2',
        dataIndex: 'bimestres',
        key: '2',
        render: data => criarCampoBimestre(1, data),
      },
    ];
  };

  useEffect(() => {
    if (calendarioSelecionado?.modalidade) {
      const colBim =
        calendarioSelecionado?.modalidade === modalidadeTipoCalendario.EJA
          ? getColunasBimestreSemestral()
          : getColunasBimestreAnual();
      setColunasBimestre([...colBim]);
    }
  }, [calendarioSelecionado]);

  return (
    <Col span={24} style={{ marginTop: '20px' }}>
      {filtros?.tipoCalendarioId && codigoDre && codigoUe ? (
        <ListaPaginada
          url="v1/fechamentos/reaberturas"
          id="lista-fechamento-reaberturas"
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

export default FechaReabListaPaginada;
