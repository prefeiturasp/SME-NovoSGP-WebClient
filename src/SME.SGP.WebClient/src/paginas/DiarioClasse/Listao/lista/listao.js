import React from 'react';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import ListaoBotoesAcao from './listaoBotoesAcao';
import ListaoFiltros from './listaoFiltros';
import ListaoPaginado from './listaoPaginado';

const Listao = () => {
  return (
    <>
      <Cabecalho pagina="Listão">
        <ListaoBotoesAcao />
      </Cabecalho>
      <Card>
        <ListaoFiltros />
        <ListaoPaginado />
      </Card>
    </>
  );
};

export default Listao;
