import { Col } from 'antd';
import React, { useContext } from 'react';
import { Alert } from '~/componentes';
import EventosListaContext from './eventosListaContext';

const AlertaCalendarioObrigatorio = () => {
  const { calendarioSelecionado } = useContext(EventosListaContext);

  return !calendarioSelecionado?.id ? (
    <Col span={24} style={{ padding: '0px 16px 16px 16px' }}>
      <Alert
        alerta={{
          tipo: 'warning',
          mensagem:
            'Para cadastrar ou listar eventos você precisa selecionar um tipo de calendário',
        }}
        className="mb-0"
      />
    </Col>
  ) : (
    ''
  );
};

export default AlertaCalendarioObrigatorio;
