import { useCallback, useEffect, useState } from 'react';
import { ListaPaginada, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_TABLE_ESTUDANTES_DASHBOARD_NAAPA } from '~/constantes/ids/table';

export const ListaEstudantesFrequenciaRiscoAbandono = ({
  anoLetivo,
  dre,
  ue,
  modalidade,
  semestre,
  meseReferencia,
  dadosGrafico,
  url,
}) => {
  const [filtros, setFiltros] = useState();

  const [dreSelecionada, setDreSelecionada] = useState();
  const [listaDres, setListaDres] = useState();

  const [ueSelecionada, setUeSelecionada] = useState();
  const [listaUes, setListaUes] = useState();

  const [turmaSelecionada, setTurmaSelecionada] = useState();
  const [listaTurmas, setListaTurmas] = useState();

  const exibirSelectDRE = dre?.codigo === OPCAO_TODOS;

  const exibirSelectUE =
    !exibirSelectDRE &&
    dre?.codigo &&
    dre?.codigo !== OPCAO_TODOS &&
    ue?.codigo &&
    ue?.codigo === OPCAO_TODOS;

  const exibirSelectTurma =
    !exibirSelectDRE &&
    !exibirSelectUE &&
    dre?.codigo &&
    ue?.codigo &&
    dre?.codigo !== OPCAO_TODOS &&
    ue?.codigo !== OPCAO_TODOS;

  let filtroEhValido = !!(filtros?.anoLetivo && filtros?.dreCodigo);

  if (filtroEhValido) {
    if (exibirSelectDRE) {
      filtroEhValido = !!dreSelecionada;
    }
    if (exibirSelectUE) {
      filtroEhValido = !!ueSelecionada;
    }
    if (exibirSelectTurma) {
      filtroEhValido = !!turmaSelecionada;
    }
  }

  const colunas = [];

  if (exibirSelectDRE) {
    colunas.push({
      title: 'UE',
      dataIndex: 'ue',
    });
  }

  if (exibirSelectUE) {
    colunas.push({
      title: 'Turma',
      dataIndex: 'turma',
    });
  }

  colunas.push(
    {
      title: 'Estudante',
      dataIndex: 'aluno',
    },
    {
      title: '% de frequência',
      dataIndex: 'percentualFrequencia',
      render: percentualFrequencia => `${percentualFrequencia}%`,
    }
  );

  useEffect(() => {
    setFiltros(undefined);
    setDreSelecionada();
    setUeSelecionada();
    setTurmaSelecionada();
  }, [modalidade, meseReferencia]);

  useEffect(() => {
    if (exibirSelectDRE) {
      setListaDres(
        dadosGrafico.map(item => ({
          descricao: item?.descricao,
          valor: item?.dreCodigo,
        }))
      );
    }

    if (!exibirSelectDRE && exibirSelectUE) {
      setListaUes(
        dadosGrafico.map(item => ({
          descricao: item?.descricao,
          valor: item?.ueCodigo,
        }))
      );
    }

    if (!exibirSelectDRE && !exibirSelectUE && exibirSelectTurma) {
      setListaTurmas(
        dadosGrafico.map(item => ({
          descricao: item?.descricao,
          valor: item?.turmaCodigo,
        }))
      );
    }
  }, [exibirSelectDRE, exibirSelectUE, exibirSelectTurma, dadosGrafico]);

  const filtrar = useCallback(() => {
    if (!dre?.codigo || !ue?.codigo || !modalidade) return;

    let dreCodigo = dre?.codigo === OPCAO_TODOS ? '' : dre?.codigo;
    let ueCodigo = ue?.codigo === OPCAO_TODOS ? '' : ue?.codigo;
    let turmaCodigo = '';

    if (exibirSelectDRE) {
      dreCodigo = dreSelecionada;
    }

    if (!exibirSelectDRE && exibirSelectUE) {
      ueCodigo = ueSelecionada;
    }

    if (!exibirSelectDRE && !exibirSelectUE && exibirSelectTurma) {
      turmaCodigo = turmaSelecionada;
    }

    const params = {
      anoLetivo,
      dreCodigo,
      ueCodigo,
      turmaCodigo,
      modalidade,
      semestre,
      mes: meseReferencia === OPCAO_TODOS ? '' : meseReferencia,
    };

    setFiltros({ ...params });
  }, [
    exibirSelectDRE,
    exibirSelectUE,
    exibirSelectTurma,
    dreSelecionada,
    ueSelecionada,
    turmaSelecionada,
  ]);

  useEffect(() => {
    filtrar();
  }, [filtrar]);

  const montarCampoSelect = () => {
    if (exibirSelectDRE)
      return (
        <SelectComponent
          allowClear={false}
          lista={listaDres}
          valueOption="valor"
          valueText="descricao"
          label="DRE"
          valueSelect={dreSelecionada}
          onChange={value => {
            setDreSelecionada(value);
          }}
          placeholder="Selecione uma DRE para exibir a lista de estudantes"
        />
      );

    if (exibirSelectUE)
      return (
        <SelectComponent
          allowClear={false}
          lista={listaUes}
          valueOption="valor"
          valueText="descricao"
          label="UE"
          valueSelect={ueSelecionada}
          onChange={value => {
            setUeSelecionada(value);
          }}
          placeholder="Selecione uma UE para exibir a lista de estudantes"
        />
      );

    if (exibirSelectTurma)
      return (
        <SelectComponent
          allowClear={false}
          lista={listaTurmas}
          valueOption="valor"
          valueText="descricao"
          label="Turma"
          valueSelect={turmaSelecionada}
          onChange={value => {
            setTurmaSelecionada(value);
          }}
          placeholder="Selecione uma turma para exibir a lista de estudantes"
        />
      );

    return <></>;
  };

  return (
    <>
      <div className="col-sm-12 col-md-6 mb-2">{montarCampoSelect()}</div>
      <div className="col-sm-12">
        <ListaPaginada
          url={url}
          id={SGP_TABLE_ESTUDANTES_DASHBOARD_NAAPA}
          colunas={colunas}
          filtro={filtros}
          filtroEhValido={filtroEhValido}
          limparDados={!filtros}
        />
      </div>
    </>
  );
};
