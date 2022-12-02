/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';

import { ListaPaginada } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_TABLE_ENCAMINHAMENTO_NAAPA } from '~/constantes/ids/table';
import { RotasDto } from '~/dtos';
import { store } from '~/redux';
import { setTabAtivaEncaminhamentoNAAPA } from '~/redux/modulos/encaminhamentoNAAPA/actions';
import { history } from '~/servicos';
import { verificarDataFimMaiorInicio } from '~/utils';

const ListaEncaminhamentoNAAPAPaginada = props => {
  const {
    ue,
    dre,
    turmaId,
    situacao,
    anoLetivo,
    nomeAluno,
    prioridade,
    consideraHistorico,
    dataAberturaQueixaFim,
    dataAberturaQueixaInicio,
  } = props;

  const [filtros, setFiltros] = useState();

  const filtroEhValido = !!(anoLetivo && dre?.id && ue?.id);

  const colunas = [
    {
      title: 'Criança/Estudante',
      dataIndex: 'nomeAluno ',
      ellipsis: true,
      render: (_, linha) => `${linha?.nomeAluno} (${linha?.codigoAluno})`,
    },
    {
      title: 'Data de entrada da queixa',
      dataIndex: 'dataAberturaQueixaInicio',
      ellipsis: true,
      render: dataInicio =>
        dataInicio ? window.moment(dataInicio).format('DD/MM/YYYY') : '',
    },
    {
      title: 'Prioridade',
      dataIndex: 'prioridade',
      ellipsis: true,
    },
    {
      title: 'Situação',
      dataIndex: 'situacao',
      ellipsis: true,
    },
  ];

  if (ue?.codigo === OPCAO_TODOS) {
    colunas.unshift({
      title: 'Unidade Escolar (UE)',
      dataIndex: 'ue',
      ellipsis: true,
    });
  }

  const filtrar = useCallback(() => {
    const params = {
      exibirHistorico: consideraHistorico,
      anoLetivo,
      dreId: dre?.id,
      codigoUe: ue?.codigo,
      turmaId: turmaId === OPCAO_TODOS ? '' : turmaId,
      nomeAluno,
      dataAberturaQueixaInicio: dataAberturaQueixaInicio
        ? dataAberturaQueixaInicio.format('YYYY-MM-DD')
        : '',
      dataAberturaQueixaFim: dataAberturaQueixaFim
        ? dataAberturaQueixaFim.format('YYYY-MM-DD')
        : '',
      situacao,
      prioridade,
    };

    const dataFimMaiorInicio = verificarDataFimMaiorInicio(
      dataAberturaQueixaInicio,
      dataAberturaQueixaFim
    );

    if (dataFimMaiorInicio) {
      setFiltros({ ...params });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    consideraHistorico,
    anoLetivo,
    dre,
    ue,
    turmaId,
    nomeAluno,
    dataAberturaQueixaInicio,
    dataAberturaQueixaFim,
    situacao,
    prioridade,
  ]);

  useEffect(() => {
    filtrar();
  }, [filtrar]);

  const exibirTabela =
    filtros?.anoLetivo && filtros?.dreId && filtros?.codigoUe;

  return exibirTabela ? (
    <ListaPaginada
      url="v1/encaminhamento-naapa"
      id={SGP_TABLE_ENCAMINHAMENTO_NAAPA}
      colunas={colunas}
      filtro={filtros}
      onClick={linha => {
        store.dispatch(setTabAtivaEncaminhamentoNAAPA());
        history.push(`${RotasDto.ENCAMINHAMENTO_NAAPA}/${linha?.id}`);
      }}
      filtroEhValido={filtroEhValido}
    />
  ) : (
    <></>
  );
};

export default ListaEncaminhamentoNAAPAPaginada;
