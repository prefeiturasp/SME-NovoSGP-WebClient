/* eslint-disable react/prop-types */
import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { ListaPaginada } from '~/componentes';
import { RotasDto } from '~/dtos';

const ListaOcorrenciasPaginada = props => {
  const {
    setFiltros,
    filtros,
    setOcorrenciasSelecionadas,
    filtroEhValido,
    consideraHistorico,
    anoLetivo,
    dre,
    ue,
    modalidade,
    semestre,
    turmaId,
    alunoNome,
    servidorNome,
    dataOcorrenciaInicio,
    dataOcorrenciaFim,
    tipoOcorrencia,
    titulo,
  } = props;

  const navigate = useNavigate();

  const colunas = [
    {
      title: 'Data',
      dataIndex: 'dataOcorrencia',
      width: '100px',
    },
    {
      title: 'Unidade Escolar (UE)',
      dataIndex: 'ueOcorrencia',
      width: '30%',
      ellipsis: true,
    },
    {
      title: 'Turma',
      dataIndex: 'turma',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Crianças/Estudantes',
      dataIndex: 'alunoOcorrencia',
      width: '30%',
      ellipsis: true,
    },
    {
      title: 'Servidores/Funcionários',
      dataIndex: 'servidorOcorrencia',
      width: '30%',
      ellipsis: true,
    },
    {
      title: 'Título da ocorrência',
      dataIndex: 'titulo',
      ellipsis: true,
      width: '20%',
    },
  ];

  const onSelecionarItems = items => {
    if (items?.length) {
      setOcorrenciasSelecionadas([...items]);
    } else {
      setOcorrenciasSelecionadas([]);
    }
  };

  const filtrar = useCallback(() => {
    const params = {
      consideraHistorico,
      anoLetivo,
      dreId: dre?.id,
      ueId: ue?.id,
      modalidade,
      turmaId,
      semestre,
      alunoNome,
      servidorNome,
      dataOcorrenciaInicio: dataOcorrenciaInicio
        ? dataOcorrenciaInicio?.format('YYYY-MM-DD')
        : '',
      dataOcorrenciaFim: dataOcorrenciaFim
        ? dataOcorrenciaFim?.format('YYYY-MM-DD')
        : '',
      tipoOcorrencia,
      titulo,
    };
    setFiltros({ ...params });
  }, [
    consideraHistorico,
    anoLetivo,
    dre,
    ue,
    modalidade,
    semestre,
    turmaId,
    alunoNome,
    servidorNome,
    dataOcorrenciaInicio,
    dataOcorrenciaFim,
    tipoOcorrencia,
    titulo,
  ]);

  useEffect(() => {
    filtrar();
  }, [filtrar]);

  return filtros?.anoLetivo && filtros?.dreId && filtros?.ueId ? (
    <ListaPaginada
      url="v1/ocorrencias"
      id="SGP_TABLE_OCORRENCIAS"
      colunaChave="id"
      colunas={colunas}
      filtro={filtros}
      onClick={ocorrencia =>
        navigate(`${RotasDto.OCORRENCIAS}/editar/${ocorrencia.id}`)
      }
      multiSelecao
      selecionarItems={onSelecionarItems}
      filtroEhValido={filtroEhValido}
    />
  ) : (
    <></>
  );
};

export default ListaOcorrenciasPaginada;
