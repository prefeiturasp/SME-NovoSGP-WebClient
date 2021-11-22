import React from 'react';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import ListaoBotoesAcao from './listaoBotoesAcao';
import ListaoContextProvider from './listaoContextProvider';
import ListaoFiltros from './listaoFiltros';
import ListaoPaginado from './listaoPaginado';

const Listao = () => {
  return (
    <ListaoContextProvider>
      <Cabecalho pagina="Listão" />
      <Card>
        <ListaoBotoesAcao />
        <ListaoFiltros />
        <ListaoPaginado />
      </Card>
    </ListaoContextProvider>
  );
};

export default Listao;
