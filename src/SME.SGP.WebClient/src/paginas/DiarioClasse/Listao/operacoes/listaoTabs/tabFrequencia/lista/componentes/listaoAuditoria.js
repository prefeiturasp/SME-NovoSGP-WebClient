import { Col, Row } from 'antd';
import React, { useContext } from 'react';
import { Auditoria } from '~/componentes';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';

const ListaoAuditoria = () => {
  // TODO  - Trocar dadosFrequencia e utilizar
  const { dadosFrequencia } = useContext(ListaoContext);

  return (
    <Col span={24}>
      <Row>
        <Auditoria
          className="mt-2"
          criadoEm={dadosFrequencia?.auditoria?.criadoEm}
          criadoPor={dadosFrequencia?.auditoria?.criadoPor}
          alteradoPor={dadosFrequencia?.auditoria?.alteradoPor}
          alteradoEm={dadosFrequencia?.auditoria?.alteradoEm}
          alteradoRf={dadosFrequencia?.auditoria?.alteradoRF}
          criadoRf={dadosFrequencia?.auditoria?.criadoRF}
        />
      </Row>
    </Col>
  );
};

export default ListaoAuditoria;
