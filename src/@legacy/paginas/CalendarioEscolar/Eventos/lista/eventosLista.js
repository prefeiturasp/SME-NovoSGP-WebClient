import React from 'react';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import AlertaCalendarioObrigatorio from './alertaCalendarioObrigatorio';
import EventosListaBotoesAcao from './eventosListaBotoesAcao';
import EventosListaContextProvider from './eventosListaContextProvider';
import EventosListaFiltros from './eventosListaFiltros';
import EventosListaLoader from './eventosListaLoader';
import EventosListaPaginada from './eventosListaPaginada';

const EventosLista = () => {
  return (
    <EventosListaContextProvider>
      <AlertaCalendarioObrigatorio />
      <EventosListaLoader>
        <Cabecalho pagina="Eventos do calendário escolar">
          <EventosListaBotoesAcao />
        </Cabecalho>
        <Card padding="24px 24px">
          <EventosListaFiltros />
          <EventosListaPaginada />
        </Card>
      </EventosListaLoader>
    </EventosListaContextProvider>
  );
};

export default EventosLista;
