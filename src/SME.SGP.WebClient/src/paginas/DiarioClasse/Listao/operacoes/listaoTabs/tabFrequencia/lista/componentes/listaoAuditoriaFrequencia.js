import { Col, Row } from 'antd';
import React, { useContext } from 'react';
import { Auditoria } from '~/componentes';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';

const ListaoAuditoriaFrequencia = () => {
  const { auditoria } = useContext(ListaoContext)?.dadosFrequencia;

  return auditoria ? (
    <Col span={24}>
      <Row>
        <Auditoria
          criadoEm={auditoria?.criadoEm}
          criadoPor={auditoria?.criadoPor}
          alteradoPor={auditoria?.alteradoPor}
          alteradoEm={auditoria?.alteradoEm}
          alteradoRf={auditoria?.alteradoRF}
          criadoRf={auditoria?.criadoRF}
        />
      </Row>
    </Col>
  ) : (
    <></>
  );
};

export default ListaoAuditoriaFrequencia;
