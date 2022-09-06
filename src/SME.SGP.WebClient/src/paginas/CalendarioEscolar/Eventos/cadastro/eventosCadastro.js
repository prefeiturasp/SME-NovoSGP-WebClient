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
      <EventosCadastroLoader>
        <Cabecalho pagina="Cadastro de eventos do calendário escolar">
          <EventosCadastroBotoesAcao />
        </Cabecalho>
        <Card>
          <EventosCadastroForm />
        </Card>
      </EventosCadastroLoader>
    </EventosCadastroContextProvider>
  );
};

export default EventosCadastro;
