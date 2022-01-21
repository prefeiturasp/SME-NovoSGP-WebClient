import React from 'react';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import FechaReabListaBotoesAcao from './fechaReabListaBotoesAcao';
import FechaReabListaContextProvider from './fechaReabListaContextProvider';
import FechaReabListaFiltros from './fechaReabListaFiltros';
import FechaReabListaLoader from './fechaReabListaLoader';
import FechaReabListaPaginada from './fechaReabListaPaginada';

const FechaReabLista = () => {
  return (
    <FechaReabListaContextProvider>
      <Cabecalho pagina="Período de Fechamento (Reabertura)" />
      <FechaReabListaLoader>
        <Card>
          <FechaReabListaBotoesAcao />
          <FechaReabListaFiltros />
          <FechaReabListaPaginada />
        </Card>
      </FechaReabListaLoader>
    </FechaReabListaContextProvider>
  );
};

export default FechaReabLista;
