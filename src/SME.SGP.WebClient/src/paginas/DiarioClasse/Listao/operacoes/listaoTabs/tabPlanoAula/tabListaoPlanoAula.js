import { Col, Row } from 'antd';
import _ from 'lodash';
import React, { useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLimparModoEdicaoGeral } from '~/redux/modulos/geral/actions';
import { erros } from '~/servicos';
import ServicoPlanoAula from '~/servicos/Paginas/DiarioClasse/ServicoPlanoAula';
import ListaoContext from '../../../listaoContext';
import { montarIdsObjetivosSelecionadosListao } from '../../../listaoFuncoes';
import PeriodoEscolarListao from '../componentes/periodoEscolarListao';
import ModalErrosPlanoAulaListao from './componentes/modalErrosPlanoAulaListao';
import ListaoPlanoAulaMontarDados from './listaoPlanoAulaMontarDados';

const TabListaoPlanoAula = () => {
  const dispatch = useDispatch();

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const {
    componenteCurricular,
    bimestreOperacoes,
    setExibirLoaderGeral,
    periodo,
    setDadosPlanoAula,
    setDadosIniciaisPlanoAula,
    periodoAbertoListao,
    setListaObjetivosAprendizagem,
    executarObterPlanoAulaPorPeriodo,
    setExecutarObterPlanoAulaPorPeriodo,
  } = useContext(ListaoContext);

  const limparDadosPlanoAula = () => {
    setDadosIniciaisPlanoAula();
    setDadosPlanoAula();
  };

  useEffect(() => {
    return () => {
      limparDadosPlanoAula();
      dispatch(setLimparModoEdicaoGeral(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const montarListaObjetivos = dados => {
    let listaObjetivos = [];

    dados.forEach(item => {
      const novoMap = item.objetivosAprendizagem.map(ob => {
        return { ...ob, componenteCurricularId: item.componenteCurricularId };
      });
      listaObjetivos = listaObjetivos.concat(novoMap);
    });
    return listaObjetivos;
  };

  const obterListaObjetivosPorTurmaAnoEComponenteCurricular = async () => {
    const resposta = await ServicoPlanoAula.obterListaObjetivosPorTurmaAnoEComponenteCurricular(
      turmaSelecionada?.id,
      componenteCurricular?.codigoComponenteCurricular,
      periodo?.dataInicio
    ).catch(e => {
      erros(e);
      setExibirLoaderGeral(false);
    });

    if (resposta?.data?.length) {
      const lista = montarListaObjetivos(resposta.data);
      return lista;
    }

    return [];
  };

  const obterPlanoAulaPorPeriodo = useCallback(async () => {
    setExibirLoaderGeral(true);
    const resposta = await ServicoPlanoAula.obterPlanoAulaPorPeriodoListao(
      turmaSelecionada?.turma,
      componenteCurricular?.codigoComponenteCurricular,
      componenteCurricular?.id,
      periodo?.dataInicio,
      periodo?.dataFim
    ).catch(e => erros(e));
    if (resposta?.data?.length) {
      if (componenteCurricular?.possuiObjetivos) {
        const listaObjetivos = await obterListaObjetivosPorTurmaAnoEComponenteCurricular();
        setListaObjetivosAprendizagem(listaObjetivos);
      }

      const lista = resposta.data;

      montarIdsObjetivosSelecionadosListao(lista);

      const dadosCarregar = _.cloneDeep(lista);
      const dadosIniciais = _.cloneDeep(lista);
      setDadosIniciaisPlanoAula([...dadosIniciais]);
      setDadosPlanoAula([...dadosCarregar]);

      setExibirLoaderGeral(false);
      return true;
    }

    limparDadosPlanoAula();
    setExibirLoaderGeral(false);
    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    periodoAbertoListao,
    componenteCurricular,
    turmaSelecionada,
    periodo,
  ]);

  const validaSeExecutaConsulta = useCallback(async () => {
    if (executarObterPlanoAulaPorPeriodo) {
      await obterPlanoAulaPorPeriodo();
      setExecutarObterPlanoAulaPorPeriodo(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [executarObterPlanoAulaPorPeriodo, obterPlanoAulaPorPeriodo]);

  useEffect(() => {
    validaSeExecutaConsulta();
  }, [executarObterPlanoAulaPorPeriodo, validaSeExecutaConsulta]);

  useEffect(() => {
    limparDadosPlanoAula();
    if (
      periodo?.dataInicio &&
      periodo?.dataFim &&
      componenteCurricular?.codigoComponenteCurricular &&
      turmaSelecionada?.turma &&
      bimestreOperacoes
    ) {
      obterPlanoAulaPorPeriodo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodo]);

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col sm={24} md={12} lg={8}>
          <PeriodoEscolarListao
            limparDadosTabSelecionada={limparDadosPlanoAula}
            exibirDataFutura
          />
        </Col>
      </Row>

      {periodo && bimestreOperacoes ? (
        <Row gutter={[24, 24]}>
          <ListaoPlanoAulaMontarDados />
        </Row>
      ) : (
        <></>
      )}
      <ModalErrosPlanoAulaListao />
    </>
  );
};

export default TabListaoPlanoAula;
