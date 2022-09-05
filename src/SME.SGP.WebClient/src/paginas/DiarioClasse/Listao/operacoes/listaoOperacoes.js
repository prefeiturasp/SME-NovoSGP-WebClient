import { Col } from 'antd';
import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import { setLimparModoEdicaoGeral } from '~/redux/modulos/geral/actions';
import ListaoContext from '../listaoContext';
import ListaoAlertaPeriodoAberto from './listaoAlertaPeriodoAberto';
import ListaoAlertaTurma from './listaoAlertaTurma';
import ListaoLoaderGeral from './listaoLoaderGeral';
import ListaoOperacoesBotoesAcao from './listaoOperacoesBotoesAcao';
import ListaoOperacoesFiltros from './listaoOperacoesFiltros';
import ListaoTabs from './listaoTabs/listaoTabs';

const ListaoOperacoes = () => {
  const dispatch = useDispatch();

  const { limparTelaListao } = useContext(ListaoContext);

  useEffect(() => {
    return () => {
      limparTelaListao();
      dispatch(setLimparModoEdicaoGeral());
    };
  }, []);

  return (
    <>
      <ListaoAlertaTurma />
      <ListaoAlertaPeriodoAberto />
      <ListaoLoaderGeral>
        <Cabecalho pagina="Operações">
          <ListaoOperacoesBotoesAcao />
        </Cabecalho>
        <Card>
          <Col span={24}>
            <ListaoOperacoesFiltros />
            <ListaoTabs />
          </Col>
        </Card>
      </ListaoLoaderGeral>
    </>
  );
};

export default ListaoOperacoes;
