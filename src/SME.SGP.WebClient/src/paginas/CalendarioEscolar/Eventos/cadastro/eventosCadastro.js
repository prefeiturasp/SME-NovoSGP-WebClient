import React from 'react';
import { Card } from '~/componentes';
import EventoCadastroCabecalho from './eventoCadastroCabecalho';
import EventosCadastroBotoesAcao from './eventosCadastroBotoesAcao';
import EventosCadastroContextProvider from './eventosCadastroContextProvider';
import EventosCadastroForm from './eventosCadastroForm';
import EventosCadastroLoader from './eventosCadastroLoader';

const EventosCadastro = () => {
  return (
    <EventosCadastroContextProvider>
      <EventoCadastroCabecalho />
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
