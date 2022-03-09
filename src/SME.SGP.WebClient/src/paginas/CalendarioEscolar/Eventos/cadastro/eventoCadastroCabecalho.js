import React, { useContext } from 'react';
import { Cabecalho } from '~/componentes-sgp';
import {
  ContainerCabecalhoCadastroEvento,
  LabelAguardandoAprovacao,
} from '../eventos.css';
import EventosCadastroContext from './eventosCadastroContext';

const EventoCadastroCabecalho = () => {
  const { aguardandoAprovacao } = useContext(EventosCadastroContext);

  return (
    <ContainerCabecalhoCadastroEvento>
      <Cabecalho pagina="Cadastro de eventos do calendário escolar" />
      {aguardandoAprovacao ? (
        <LabelAguardandoAprovacao>
          Aguardando aprovação
        </LabelAguardandoAprovacao>
      ) : (
        ''
      )}
    </ContainerCabecalhoCadastroEvento>
  );
};

export default EventoCadastroCabecalho;
