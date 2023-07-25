import React, { useState, useEffect, useCallback } from 'react';
import { ListaPaginada } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_TABLE_ENCAMINHAMENTO_NAAPA } from '~/constantes/ids/table';
import { RotasDto } from '~/dtos';
import { store } from '@/core/redux';
import { setTabAtivaEncaminhamentoNAAPA } from '~/redux/modulos/encaminhamentoNAAPA/actions';
import { verificarDataFimMaiorInicio } from '~/utils';
import { useNavigate } from 'react-router-dom';
import { NomeEstudanteLista } from '@/@legacy/componentes-sgp';

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
    onSelecionarItems,
    exibirEncaminhamentosEncerrados,
  } = props;

  const navigate = useNavigate();

  const [filtros, setFiltros] = useState();

  const filtroEhValido = !!(anoLetivo && dre?.id && ue?.id);

  const colunas = [
    {
      title: 'Criança/Estudante',
      dataIndex: 'nomeAluno ',
      render: (_, linha) => (
        <NomeEstudanteLista
          nome={`${linha?.nomeAluno} (${linha?.codigoAluno})`}
          ehMatriculadoTurmaPAP={linha?.ehMatriculadoTurmaPAP}
        />
      ),
    },
    {
      title: 'Data de entrada da queixa',
      dataIndex: 'dataAberturaQueixaInicio',
      render: dataInicio =>
        dataInicio ? window.moment(dataInicio).format('DD/MM/YYYY') : '',
    },
    {
      title: 'Prioridade',
      dataIndex: 'prioridade',
    },
    {
      title: 'Situação',
      dataIndex: 'situacao',
    },
  ];

  if (ue?.codigo === OPCAO_TODOS) {
    colunas.unshift({
      title: 'Unidade Escolar (UE)',
      dataIndex: 'ue',
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
      exibirEncerrados: exibirEncaminhamentosEncerrados,
    };

    const dataFimMaiorInicio = verificarDataFimMaiorInicio(
      dataAberturaQueixaInicio,
      dataAberturaQueixaFim
    );

    if (dataFimMaiorInicio) {
      setFiltros({ ...params });
    }
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
    exibirEncaminhamentosEncerrados,
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
        store.dispatch(setTabAtivaEncaminhamentoNAAPA(0));
        navigate(`${RotasDto.ENCAMINHAMENTO_NAAPA}/${linha?.id}`);
      }}
      filtroEhValido={filtroEhValido}
      multiSelecao
      selecionarItems={valores => onSelecionarItems(valores)}
    />
  ) : (
    <></>
  );
};

export default ListaEncaminhamentoNAAPAPaginada;
