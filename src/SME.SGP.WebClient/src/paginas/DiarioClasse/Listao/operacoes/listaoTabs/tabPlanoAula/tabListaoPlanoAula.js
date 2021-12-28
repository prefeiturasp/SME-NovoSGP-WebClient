import { Col, Row } from 'antd';
import _ from 'lodash';
import React, { useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLimparModoEdicaoGeral } from '~/redux/modulos/geral/actions';
import { erros } from '~/servicos';
import ServicoPlanoAula from '~/servicos/Paginas/DiarioClasse/ServicoPlanoAula';
import ListaoContext from '../../../listaoContext';
import PeriodoEscolarListao from '../componentes/periodoEscolarListao';
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

  const montarIdsObjetivosSelecionados = planos => {
    planos.forEach(plano => {
      if (plano?.objetivosAprendizagemComponente?.length) {
        let ids = [];
        plano.objetivosAprendizagemComponente.forEach(objetivo => {
          const idsObjetivo = objetivo.objetivosAprendizagem.map(ob => ob.id);
          ids = ids.concat(idsObjetivo);
        });
        plano.idsObjetivosAprendizagemSelecionados = ids;
      }
    });
  };

  const obterPlanoAulaPorPeriodo = useCallback(async () => {
    setExibirLoaderGeral(true);
    const resposta = await ServicoPlanoAula.obterPlanoAulaPorPeriodoListao(
      turmaSelecionada?.turma,
      componenteCurricular?.codigoComponenteCurricular,
      periodo?.dataInicio,
      periodo?.dataFim
    ).catch(e => erros(e));
    if (resposta?.data?.length) {
      if (componenteCurricular?.possuiObjetivos) {
        const listaObjetivos = await obterListaObjetivosPorTurmaAnoEComponenteCurricular();
        setListaObjetivosAprendizagem(listaObjetivos);
      }

      const lista = resposta.data;

      montarIdsObjetivosSelecionados(lista);

      const dadosCarregar = _.cloneDeep(lista);
      const dadosIniciais = _.cloneDeep(lista);
      setDadosIniciaisPlanoAula(dadosIniciais);
      setDadosPlanoAula(dadosCarregar);

      setExibirLoaderGeral(false);
    } else {
      limparDadosPlanoAula();
      setExibirLoaderGeral(false);
    }
  }, [
    dispatch,
    periodoAbertoListao,
    componenteCurricular,
    turmaSelecionada,
    periodo,
  ]);

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
    </>
  );
};

export default TabListaoPlanoAula;
