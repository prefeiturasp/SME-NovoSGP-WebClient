import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Col, Row } from 'antd';

import { useSelector } from 'react-redux';
import { Loader, SelectComponent } from '~/componentes';
import * as idsCampos from '~/componentes-sgp/filtro/idsCampos';

import { erros, ServicoDisciplina } from '~/servicos';
import ServicoPeriodoEscolar from '~/servicos/Paginas/Calendario/ServicoPeriodoEscolar';

import ListaoContext from '../../../listaoContext';

const TabListaoDiarioBordoFiltros = () => {
  const [exibirLoaderPeriodo, setExibirLoaderPeriodo] = useState(false);
  const [
    listaComponenteCurriculares,
    setListaComponenteCurriculares,
  ] = useState();

  const usuario = useSelector(store => store.usuario);
  const telaEmEdicao = useSelector(store => store.geral.telaEmEdicao);
  const { turmaSelecionada } = usuario;
  const { turma } = turmaSelecionada;
  const acaoTelaEmEdicao = useSelector(store => store.geral.acaoTelaEmEdicao);

  const {
    componenteCurricular,
    bimestreOperacoes,
    // setExibirLoaderGeral,
    listaPeriodos,
    setListaPeriodos,
    periodo,
    setPeriodo,
    // periodoAbertoListao,
    compCurricularTabDiarioBordo,
    setCompCurricularTabDiarioBordo,
  } = useContext(ListaoContext);

  const desabilitarCampos =
    !turma ||
    !bimestreOperacoes ||
    !componenteCurricular?.codigoComponenteCurricular;

  const obterPeriodoPorComponente = useCallback(async () => {
    setExibirLoaderPeriodo(true);
    const resposta = await ServicoPeriodoEscolar.obterPeriodoPorComponente(
      turma,
      componenteCurricular?.codigoComponenteCurricular,
      componenteCurricular?.regencia,
      bimestreOperacoes
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoaderPeriodo(false));

    const retornouDados = resposta?.data?.length;
    const lista = retornouDados
      ? resposta.data.map(item => ({
          ...item,
          id: String(item.id),
        }))
      : [];

    setListaPeriodos(lista);
    if (lista.length === 1) {
      setPeriodo(lista[0]);
    }
  }, [
    componenteCurricular,
    turma,
    bimestreOperacoes,
    setListaPeriodos,
    setPeriodo,
  ]);

  useEffect(() => {
    return () => {
      setPeriodo();
      setListaPeriodos([]);
    };
  }, [setListaPeriodos, setPeriodo]);

  useEffect(() => {
    setPeriodo();
    setListaPeriodos([]);
    if (componenteCurricular?.codigoComponenteCurricular && bimestreOperacoes) {
      obterPeriodoPorComponente();
    }
  }, [
    bimestreOperacoes,
    componenteCurricular,
    obterPeriodoPorComponente,
    setListaPeriodos,
    setPeriodo,
  ]);

  const obterPeriodoSelecionado = id => {
    if (id && listaPeriodos?.length) {
      let periodoSelecionado = null;

      periodoSelecionado = listaPeriodos?.find(
        item => Number(item?.id) === Number(id)
      );
      return periodoSelecionado;
    }
    return null;
  };

  const setarPeriodo = valor => {
    const periodoSelecionado = obterPeriodoSelecionado(valor);
    if (periodoSelecionado) {
      setPeriodo({ ...periodoSelecionado });
      return;
    }
    setPeriodo();
  };

  const onChangePeriodo = async valor => {
    // if (telaEmEdicao) {
    //   const salvou = await acaoTelaEmEdicao();
    //   if (salvou) {
    //     setarPeriodo(valor);
    //   }
    //   return;
    // }
    setarPeriodo(valor);
  };

  const onChangeComponenteCurricular = async valor => {
    if (telaEmEdicao) {
      const salvou = await acaoTelaEmEdicao();
      if (salvou) {
        setCompCurricularTabDiarioBordo(valor);
      }
    }
    setCompCurricularTabDiarioBordo(valor);
  };

  const obterComponentesCurriculares = useCallback(async () => {
    // setCarregandoGeral(true);
    const componentes = await ServicoDisciplina.obterDisciplinasPorTurma(
      turma,
      false
    ).catch(e => erros(e));
    // .finally(() => setCarregandoGeral(false))

    if (componentes?.data?.length) {
      setListaComponenteCurriculares(componentes.data);

      if (componentes.data.length === 1) {
        const componente = componentes.data[0];
        setCompCurricularTabDiarioBordo(
          String(componente.codigoComponenteCurricular)
        );
      }
    }
  }, [turma]);

  useEffect(() => {
    if (turma) {
      obterComponentesCurriculares();
      return;
    }
    setListaComponenteCurriculares([]);
    setCompCurricularTabDiarioBordo();
  }, [turma, obterComponentesCurriculares, setCompCurricularTabDiarioBordo]);

  return (
    <Row gutter={[24, 24]}>
      <Col sm={24} md={12} lg={8}>
        <Loader loading={exibirLoaderPeriodo} ignorarTip>
          <SelectComponent
            label="Componente curricular"
            id={idsCampos.SGP_SELECT_COMPONENTE_CURRICULAR}
            lista={listaComponenteCurriculares}
            valueOption="codigoComponenteCurricular"
            valueText="nomeComponenteInfantil"
            valueSelect={compCurricularTabDiarioBordo}
            onChange={onChangeComponenteCurricular}
            placeholder="Selecione um componente curricular"
            showSearch
            disabled={
              desabilitarCampos || listaComponenteCurriculares?.length === 1
            }
          />
        </Loader>
      </Col>
      <Col sm={24} md={12} lg={8}>
        <Loader loading={exibirLoaderPeriodo} ignorarTip>
          <SelectComponent
            label="Período"
            id={idsCampos.SGP_SELECT_PERIODO_POR_COMPONENTE_CURRICULAR}
            lista={listaPeriodos}
            valueOption="id"
            valueText="periodoEscolar"
            valueSelect={periodo?.id}
            onChange={onChangePeriodo}
            placeholder="Selecione um Período"
            showSearch
            disabled={
              desabilitarCampos ||
              listaPeriodos?.length === 1 ||
              !listaPeriodos?.length
            }
          />
        </Loader>
      </Col>
    </Row>
  );
};

export default TabListaoDiarioBordoFiltros;
