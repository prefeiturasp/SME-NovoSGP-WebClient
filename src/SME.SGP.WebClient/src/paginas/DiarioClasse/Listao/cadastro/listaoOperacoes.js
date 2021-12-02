import React from 'react';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import ListaoOperacoesBotoesAcao from './listaoOperacoesBotoesAcao';
import ListaoOperacoesFiltros from './listaoOperacoesFiltros';
import ListaoTabs from './listaoTabs/listaoTabs';

const ListaoOperacoes = () => {
  return (
    <>
      <Cabecalho pagina="Listão operações" />
      <Card>
        <ListaoOperacoesBotoesAcao />
        <ListaoOperacoesFiltros />
        <ListaoTabs />
      </Card>
    </>
  );
};

export default ListaoOperacoes;
