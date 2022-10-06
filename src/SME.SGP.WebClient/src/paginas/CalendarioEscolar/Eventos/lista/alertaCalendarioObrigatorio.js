import React, { useContext } from 'react';
import { Alert } from '~/componentes';
import EventosListaContext from './eventosListaContext';

const AlertaCalendarioObrigatorio = () => {
  const { calendarioSelecionado } = useContext(EventosListaContext);

  return !calendarioSelecionado?.id ? (
    <Alert
      alerta={{
        tipo: 'warning',
        mensagem:
          'Para cadastrar ou listar eventos você precisa selecionar um tipo de calendário',
      }}
    />
  ) : (
    <></>
  );
};

export default AlertaCalendarioObrigatorio;
