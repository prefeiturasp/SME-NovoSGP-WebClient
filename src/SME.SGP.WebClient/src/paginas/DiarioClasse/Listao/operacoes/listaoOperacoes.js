import React, { useContext } from 'react';
import { Col } from 'antd';

import { Card, Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import ListaoContext from '../listaoContext';
import ListaoAlertaTurma from './listaoAlertaTurma';
import ListaoOperacoesBotoesAcao from './listaoOperacoesBotoesAcao';
import ListaoOperacoesFiltros from './listaoOperacoesFiltros';
import ListaoTabs from './listaoTabs/listaoTabs';

const ListaoOperacoes = () => {
  const { exibirLoaderGeral } = useContext(ListaoContext);
  return (
    <>
      <ListaoAlertaTurma />
      <Cabecalho pagina="Operações" />
      <Card>
        <Col span={24}>
          <Loader loading={exibirLoaderGeral} ignorarTip>
            <ListaoOperacoesBotoesAcao />
            <ListaoOperacoesFiltros />
            <ListaoTabs />
          </Loader>
        </Col>
      </Card>
    </>
  );
};

export default ListaoOperacoes;
