import React from 'react';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import EventosListaBotoesAcao from './eventosListaBotoesAcao';
import EventosListaContextProvider from './eventosListaContextProvider';
import EventosListaFiltros from './eventosListaFiltros';
import EventosListaPaginada from './eventosListaPaginada';

const EventosListaNovo = () => {
  return (
    <EventosListaContextProvider>
      <Cabecalho pagina="Eventos do calendário escolar" />
      <Card>
        <EventosListaBotoesAcao />
        <EventosListaFiltros />
        <EventosListaPaginada />
      </Card>
    </EventosListaContextProvider>
  );
};

export default EventosListaNovo;
