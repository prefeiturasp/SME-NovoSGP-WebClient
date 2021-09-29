import React from 'react';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import EventosCadastroBotoesAcao from './eventosCadastroBotoesAcao';
import EventosCadastroContextProvider from './eventosCadastroContextProvider';
import EventosCadastroForm from './eventosCadastroForm';
import EventosCadastroLoader from './eventosCadastroLoader';

const EventosCadastro = () => {
  return (
    <EventosCadastroContextProvider>
      <Cabecalho pagina="Cadastro de eventos do calendário escolar" />
      <EventosCadastroLoader>
        <Card>
          <EventosCadastroBotoesAcao />
          <EventosCadastroForm />
        </Card>
      </EventosCadastroLoader>
    </EventosCadastroContextProvider>
  );
};

export default EventosCadastro;
