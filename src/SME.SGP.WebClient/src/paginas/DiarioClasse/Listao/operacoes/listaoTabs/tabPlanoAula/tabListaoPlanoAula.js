import { Col, Row } from 'antd';
import _ from 'lodash';
import React, { useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLimparModoEdicaoGeral } from '~/redux/modulos/geral/actions';
import { erros, ServicoComponentesCurriculares } from '~/servicos';
import ServicoPlanoAula from '~/servicos/Paginas/DiarioClasse/ServicoPlanoAula';
import ServicoPlanoAnual from '~/servicos/Paginas/ServicoPlanoAnual';
import ListaoContext from '../../../listaoContext';
import PeriodoEscolarListao from '../componentes/periodoEscolarListao';
import ListaoPlanoAulaMontarDados from './listaoPlanoAulaMontarDados';
import { mockPlanoAulaListao } from './mockPlanoAulaListao';

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
    setListaComponentesModalObjetivosAprendizagem,
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

  const obterListaComponentesRegencia = async () => {
    let lista = [];
    const resposta = await ServicoComponentesCurriculares.obterComponetensCuricularesRegencia(
      turmaSelecionada?.id
    ).catch(e => {
      erros(e);
      setExibirLoaderGeral(false);
    });

    if (resposta?.data?.length) {
      lista = resposta.data;
    }

    return lista;
  };

  const obterObjetivosPorAnoEComponenteCurricular = async () => {
    const resposta = await ServicoPlanoAnual.obterListaObjetivosPorAnoEComponenteCurricular(
      turmaSelecionada?.ano,
      turmaSelecionada?.ensinoEspecial,
      componenteCurricular?.codigoComponenteCurricular
    ).catch(e => {
      erros(e);
      setExibirLoaderGeral(false);
    });

    if (resposta?.data?.length) {
      // TODO
    }
  };

  const obterPlanoAulaPorPeriodo = useCallback(async () => {
    setExibirLoaderGeral(true);
    const resposta = await ServicoPlanoAula.obterPlanoAulaPorPeriodo(
      periodo?.dataInicio,
      periodo?.dataFim,
      turmaSelecionada?.turma,
      componenteCurricular?.codigoComponenteCurricular,
      componenteCurricular?.id
    ).catch(e => erros(e));

    if (resposta?.data?.length) {
      if (componenteCurricular?.regencia) {
        const listaCompRegencia = await obterListaComponentesRegencia();
        setListaComponentesModalObjetivosAprendizagem(listaCompRegencia);
      } else {
        setListaComponentesModalObjetivosAprendizagem([componenteCurricular]);
      }
      obterObjetivosPorAnoEComponenteCurricular();

      // const lista = resposta.data;
      // TODO - Remover mock!
      const lista = mockPlanoAulaListao;
      const dadosCarregar = _.cloneDeep(lista);
      const dadosIniciais = _.cloneDeep(lista);
      setDadosIniciaisPlanoAula(dadosIniciais);
      setDadosPlanoAula(dadosCarregar);

      setExibirLoaderGeral(false);
    } else {
      // limparDadosPlanoAula();
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
