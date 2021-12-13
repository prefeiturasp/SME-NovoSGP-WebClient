import React from 'react';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import ListaoAlertaTurma from './listaoAlertaTurma';
import ListaoOperacoesBotoesAcao from './listaoOperacoesBotoesAcao';
import ListaoOperacoesFiltros from './listaoOperacoesFiltros';
import ListaoTabs from './listaoTabs/listaoTabs';

const ListaoOperacoes = () => {
  return (
    <>
      <ListaoAlertaTurma />
      <Cabecalho pagina="Operações" />
      <Card>
        <ListaoOperacoesBotoesAcao />
        <ListaoOperacoesFiltros />
        <ListaoTabs />
      </Card>
    </>
  );
};

export default ListaoOperacoes;
