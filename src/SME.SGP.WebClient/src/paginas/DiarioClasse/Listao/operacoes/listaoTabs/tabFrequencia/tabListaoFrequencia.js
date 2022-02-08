import { Col, Row } from 'antd';
import _ from 'lodash';
import React, { useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from '~/componentes';
import {
  setLimparModoEdicaoGeral,
  setTelaEmEdicao,
} from '~/redux/modulos/geral/actions';
import { erros } from '~/servicos';
import ServicoFrequencia from '~/servicos/Paginas/DiarioClasse/ServicoFrequencia';
import ListaoContext from '../../../listaoContext';
import PeriodoEscolarListao from '../componentes/periodoEscolarListao';
import ListaoAuditoriaFrequencia from './lista/componentes/listaoAuditoriaFrequencia';
import ListaoListaFrequencia from './lista/listaoListaFrequencia';

const TabListaoFrequencia = () => {
  const dispatch = useDispatch();

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const {
    componenteCurricular,
    bimestreOperacoes,
    setExibirLoaderGeral,
    periodo,
    dadosFrequencia,
    setDadosFrequencia,
    setListaTiposFrequencia,
    setDadosIniciaisFrequencia,
    periodoAbertoListao,
  } = useContext(ListaoContext);

  const limparFrequencia = () => {
    setDadosIniciaisFrequencia();
    setDadosFrequencia();
  };

  useEffect(() => {
    return () => {
      limparFrequencia();
      setListaTiposFrequencia([]);
      dispatch(setLimparModoEdicaoGeral(false));
    };
  }, []);

  const obterFrequenciasPorPeriodo = useCallback(async () => {
    setExibirLoaderGeral(true);
    const resposta = await ServicoFrequencia.obterFrequenciasPorPeriodo(
      periodo?.dataInicio,
      periodo?.dataFim,
      turmaSelecionada?.turma,
      componenteCurricular?.codigoComponenteCurricular,
      componenteCurricular?.id
    ).catch(e => {
      erros(e);
      setExibirLoaderGeral(false);
    });

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
    limparFrequencia();
    if (
      periodo?.dataInicio &&
      periodo?.dataFim &&
      componenteCurricular?.codigoComponenteCurricular &&
      turmaSelecionada?.turma &&
      bimestreOperacoes
    ) {
      obterFrequenciasPorPeriodo();
    }
  }, [periodo]);

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
          <PeriodoEscolarListao limparDadosTabSelecionada={limparFrequencia} />
        </Col>
      </Row>

      {dadosFrequencia?.aulas?.length && periodo && bimestreOperacoes ? (
        <>
          <ListaoListaFrequencia />
          <ListaoAuditoriaFrequencia />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default TabListaoFrequencia;
