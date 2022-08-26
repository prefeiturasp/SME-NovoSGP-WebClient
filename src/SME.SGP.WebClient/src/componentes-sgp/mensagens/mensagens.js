import { Row } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import Alert from '~/componentes/alert';
import Grid from '~/componentes/grid';

const Mensagens = () => {
  const somenteConsulta = useSelector(store => store.navegacao.somenteConsulta);
  const alertas = useSelector(state => state.alertas);
  return alertas.alertas?.length || somenteConsulta ? (
    <div className="mt-2 mb-2">
      {alertas.alertas.map(alerta => (
        <Row key={shortid.generate()}>
          <Grid cols={12}>
            <Alert alerta={alerta} key={alerta.id} closable />
          </Grid>
        </Row>
      ))}
      {somenteConsulta ? (
        <Row key={shortid.generate()}>
          <Grid cols={12}>
            <Alert
              alerta={{
                tipo: 'warning',
                id: 'AlertaPrincipal',
                mensagem: 'Você tem apenas permissão de consulta nesta tela.',
                estiloTitulo: { fontSize: '18px' },
              }}
            />
          </Grid>
        </Row>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <></>
  );
};

export default Mensagens;
