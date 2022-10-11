import { Col, Row } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loader, SelectComponent } from '~/componentes';
import * as idsCampos from '~/componentes-sgp/filtro/idsCampos';
import { erros, ServicoDisciplina, ServicoPeriodoEscolar } from '~/servicos';
import ListaoContext from '../../../listaoContext';

const TabListaoDiarioBordoFiltros = () => {
  const telaEmEdicao = useSelector(store => store.geral.telaEmEdicao);
  const acaoTelaEmEdicao = useSelector(store => store.geral.acaoTelaEmEdicao);

  const [
    exibirLoaderComponenteCurricular,
    setExibirLoaderComponenteCurricular,
  ] = useState(false);

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const { turma } = turmaSelecionada;

  const {
    componenteCurricular,
    bimestreOperacoes,
    listaPeriodos,
    setListaPeriodos,
    periodo,
    setPeriodo,
    componenteCurricularDiarioBordo,
    setComponenteCurricularDiarioBordo,
    listaComponentesCurricularesDiario,
    setListaComponentesCurricularesDiario,
    setDadosIniciaisDiarioBordo,
    setDadosDiarioBordo,
    exibirLoaderPeriodo,
    setExibirLoaderPeriodo,
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
      bimestreOperacoes,
      true
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    componenteCurricular,
    turma,
    bimestreOperacoes,
    setListaPeriodos,
    setPeriodo,
  ]);

  const limparDadosDiarioBordo = () => {
    setDadosIniciaisDiarioBordo([]);
    setDadosDiarioBordo([]);
  };

  const limparDadosPeriodo = (limparLista = true) => {
    if (listaPeriodos?.length !== 1) {
      setPeriodo();
    }
    if (limparLista) {
      setListaPeriodos([]);
    }
  };

  const limparDadosComponenteCurricularDiarioBordo = () => {
    setComponenteCurricularDiarioBordo();
    setListaComponentesCurricularesDiario([]);
  };

  useEffect(() => {
    return () => {
      limparDadosPeriodo();
      limparDadosComponenteCurricularDiarioBordo();
      limparDadosDiarioBordo();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    limparDadosPeriodo();
    if (componenteCurricular?.codigoComponenteCurricular && bimestreOperacoes) {
      obterPeriodoPorComponente();
    } else {
      limparDadosDiarioBordo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bimestreOperacoes]);

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
    if (telaEmEdicao) {
      const salvou = await acaoTelaEmEdicao();
      if (salvou) {
        setarPeriodo(valor);
        limparDadosDiarioBordo();
      }
    } else {
      setarPeriodo(valor);
    }
  };

  const onChangeComponenteCurricular = async valor => {
    if (telaEmEdicao) {
      const salvou = await acaoTelaEmEdicao();
      if (salvou) {
        limparDadosDiarioBordo();
        limparDadosPeriodo(false);
        setComponenteCurricularDiarioBordo(valor);
      }
    } else {
      setComponenteCurricularDiarioBordo(valor);
    }
  };

  const obterComponentesCurriculares = useCallback(async () => {
    setExibirLoaderComponenteCurricular(true);
    const componentes = await ServicoDisciplina.obterDisciplinasPorTurma(
      turma,
      false
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoaderComponenteCurricular(false));

    if (componentes?.data?.length) {
      setListaComponentesCurricularesDiario(componentes.data);

      if (componentes.data.length === 1) {
        const componente = componentes.data[0];
        setComponenteCurricularDiarioBordo(
          String(componente.codigoComponenteCurricular)
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turma, setComponenteCurricularDiarioBordo]);

  useEffect(() => {
    if (turma && bimestreOperacoes) {
      obterComponentesCurriculares();
      return;
    }
    setListaComponentesCurricularesDiario([]);
    setComponenteCurricularDiarioBordo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    turma,
    obterComponentesCurriculares,
    setComponenteCurricularDiarioBordo,
    bimestreOperacoes,
  ]);

  return (
    <Row gutter={[24, 24]}>
      <Col sm={24} md={12} lg={8}>
        <Loader loading={exibirLoaderComponenteCurricular} ignorarTip>
          <SelectComponent
            label="Componente curricular"
            id={idsCampos.SGP_SELECT_COMPONENTE_CURRICULAR}
            lista={listaComponentesCurricularesDiario}
            valueOption="codigoComponenteCurricular"
            valueText="nomeComponenteInfantil"
            valueSelect={componenteCurricularDiarioBordo}
            onChange={onChangeComponenteCurricular}
            placeholder="Selecione um componente curricular"
            showSearch
            disabled={
              desabilitarCampos ||
              listaComponentesCurricularesDiario?.length === 1 ||
              !listaComponentesCurricularesDiario?.length
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
