import { Col, Row } from 'antd';
import _ from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_PERIODO_POR_COMPONENTE_CURRICULAR } from '~/componentes-sgp/filtro/idsCampos';
import {
  setLimparModoEdicaoGeral,
  setTelaEmEdicao,
} from '~/redux/modulos/geral/actions';
import { erros } from '~/servicos';
import ServicoPeriodoEscolar from '~/servicos/Paginas/Calendario/ServicoPeriodoEscolar';
import ServicoFrequencia from '~/servicos/Paginas/DiarioClasse/ServicoFrequencia';
import ListaoContext from '../../../listaoContext';
import ListaoAuditoria from './lista/componentes/listaoAuditoria';
import ListaoListaFrequencia from './lista/listaoListaFrequencia';

const TabListaoFrequencia = () => {
  const dispatch = useDispatch();

  const usuario = useSelector(store => store.usuario);
  const telaEmEdicao = useSelector(store => store.geral.telaEmEdicao);
  const { turmaSelecionada } = usuario;
  const { turma } = turmaSelecionada;
  const acaoTelaEmEdicao = useSelector(store => store.geral.acaoTelaEmEdicao);

  const {
    componenteCurricular,
    bimestreOperacoes,
    setExibirLoaderGeral,
    listaPeriodos,
    setListaPeriodos,
    periodo,
    setPeriodo,
    dadosFrequencia,
    setDadosFrequencia,
    setListaTiposFrequencia,
    setDadosIniciaisFrequencia,
    periodoAbertoListao,
  } = useContext(ListaoContext);

  const [exibirLoaderPeriodo, setExibirLoaderPeriodo] = useState(false);

  const desabilitarPeriodo =
    !turma ||
    !bimestreOperacoes ||
    !componenteCurricular?.codigoComponenteCurricular ||
    listaPeriodos?.length === 1 ||
    !listaPeriodos?.length;

  const limparFrequencia = () => {
    setDadosIniciaisFrequencia({});
    setDadosFrequencia({});
  };

  useEffect(() => {
    return () => {
      limparFrequencia();
      setPeriodo();
      setListaPeriodos([]);
    };
  }, []);

  const obterPeriodoPorComponente = useCallback(async () => {
    limparFrequencia();
    setExibirLoaderPeriodo(true);
    const resposta = await ServicoPeriodoEscolar.obterPeriodoPorComponente(
      turma,
      componenteCurricular?.codigoComponenteCurricular,
      componenteCurricular?.regencia,
      bimestreOperacoes
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoaderPeriodo(false));

    if (resposta?.data?.length) {
      const lista = resposta.data.map(item => {
        return { ...item, id: String(item.id) };
      });
      setListaPeriodos(lista);
      if (lista.length === 1) {
        setPeriodo(lista[0]);
      }
    } else {
      setListaPeriodos([]);
    }
  }, [componenteCurricular, turma, bimestreOperacoes]);

  useEffect(() => {
    setPeriodo();
    setListaPeriodos([]);
    if (componenteCurricular?.codigoComponenteCurricular && bimestreOperacoes) {
      obterPeriodoPorComponente();
    } else {
      limparFrequencia();
    }
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
    } else {
      setPeriodo();
    }
  };

  const onChangePeriodo = async valor => {
    if (telaEmEdicao) {
      const salvou = await acaoTelaEmEdicao();
      if (salvou) {
        limparFrequencia();
        setarPeriodo(valor);
      }
    } else {
      setarPeriodo(valor);
    }
  };

  const obterFrequenciasPorPeriodo = useCallback(async () => {
    setExibirLoaderGeral(true);
    const resposta = await ServicoFrequencia.obterFrequenciasPorPeriodo(
      periodo?.dataInicio,
      periodo?.dataFim,
      turma,
      componenteCurricular?.codigoComponenteCurricular
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoaderGeral(false));

    if (resposta?.data) {
      const retorno = await ServicoFrequencia.obterTipoFrequencia(
        turmaSelecionada?.modalidade,
        turmaSelecionada?.anoLetivo
      ).catch(e => erros(e));

      const tiposFrequencia = retorno?.data?.length ? retorno.data : [];
      setListaTiposFrequencia(tiposFrequencia);

      const dadosCarregar = _.cloneDeep(resposta.data);
      const dadosIniciais = _.cloneDeep(resposta.data);
      setDadosFrequencia(dadosCarregar);
      setDadosIniciaisFrequencia(dadosIniciais);

      const aulaSemFrequenciaId = dadosCarregar?.aulas?.find(
        item => !item?.frequenciaId
      );

      if (
        periodoAbertoListao &&
        dadosCarregar?.aulas?.length &&
        aulaSemFrequenciaId
      ) {
        dispatch(setTelaEmEdicao(true));
      }
    } else {
      limparFrequencia();
    }
  }, [
    dispatch,
    periodoAbertoListao,
    componenteCurricular,
    turma,
    turmaSelecionada,
    periodo,
    setExibirLoaderGeral,
  ]);

  useEffect(() => {
    limparFrequencia();
    if (
      periodo?.dataInicio &&
      periodo?.dataFim &&
      componenteCurricular?.codigoComponenteCurricular &&
      turma &&
      bimestreOperacoes
    ) {
      obterFrequenciasPorPeriodo();
    }
  }, [periodo]);

  useEffect(() => {
    return () => {
      setListaPeriodos([]);
      setPeriodo();
      setListaTiposFrequencia([]);
      setDadosFrequencia();
      setDadosIniciaisFrequencia();
      dispatch(setLimparModoEdicaoGeral(false));
    };
  }, []);

  return (
    <>
      {componenteCurricular?.codigoComponenteCurricular &&
      !componenteCurricular?.registraFrequencia ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'alerta-listao-frequencia',
            mensagem: 'Componente selecionado não lança frequência',
            estiloTitulo: { fontSize: '18px' },
          }}
          className="mb-2"
        />
      ) : (
        <></>
      )}
      <Row gutter={[24, 24]}>
        <Col sm={24} md={12} lg={8}>
          <Loader loading={exibirLoaderPeriodo} ignorarTip>
            <SelectComponent
              label="Período"
              id={SGP_SELECT_PERIODO_POR_COMPONENTE_CURRICULAR}
              lista={listaPeriodos}
              valueOption="id"
              valueText="periodoEscolar"
              valueSelect={periodo?.id}
              onChange={onChangePeriodo}
              placeholder="Selecione um Período"
              showSearch
              disabled={desabilitarPeriodo}
            />
          </Loader>
        </Col>
      </Row>

      {dadosFrequencia?.aulas?.length && periodo && bimestreOperacoes ? (
        <>
          <ListaoListaFrequencia />
          <ListaoAuditoria />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default TabListaoFrequencia;
