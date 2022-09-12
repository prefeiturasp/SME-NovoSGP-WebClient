import React from 'react';
import { useSelector } from 'react-redux';
import Alert from '~/componentes/alert';

const Mensagens = () => {
  const somenteConsulta = useSelector(store => store.navegacao.somenteConsulta);
  const alertas = useSelector(state => state.alertas);
  return alertas.alertas?.length || somenteConsulta ? (
    <>
      {alertas.alertas.map(alerta => (
        <Alert alerta={alerta} key={alerta.id} closable />
      ))}
      {somenteConsulta ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'AlertaPrincipal',
            mensagem: 'Você tem apenas permissão de consulta nesta tela.',
            estiloTitulo: { fontSize: '18px' },
          }}
        />
      ) : (
        <></>
      )}
    </>
  ) : (
    <></>
  );
};

export default Mensagens;
