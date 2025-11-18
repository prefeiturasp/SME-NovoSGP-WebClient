import { AuditoriaDto } from '@/core/dto/AuditoriaDto';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { Base } from '~/componentes';

export const Container = styled.div`
  .ant-col {
    font-size: 9px !important;
    font-weight: bold;
    color: ${Base.CinzaMako};
  }
`;

export const Auditoria: React.FC<AuditoriaDto> = ({
  criadoPor,
  criadoEm,
  alteradoPor,
  alteradoEm,
  criadoRF,
  alteradoRF,
}) => {
  const [criado, setCriado] = useState(window.moment());
  const [alterado, setAlterado] = useState(window.moment());

  useEffect(() => {
    if (criadoEm) setCriado(window.moment.utc(criadoEm));
  }, [criadoEm]);

  useEffect(() => {
    if (alteradoEm) setAlterado(window.moment.utc(alteradoEm));
  }, [alteradoEm]);

  if (!criadoPor && !alteradoPor) return <></>;

  return (
    <Container>
      {criadoPor ? (
        <Row>
          <Col xs={24}>
            INSERIDO por {criadoPor} {criadoRF && criadoRF !== '0' && `(${criadoRF})`} em{' '}
            {`${criado.format('DD/MM/YYYY')} às ${criado.format('HH:mm')}`}
          </Col>
        </Row>
      ) : (
        <></>
      )}
      {alteradoPor ? (
        <Row>
          <Col xs={24}>
            ALTERADO por {alteradoPor} {alteradoRF && alteradoRF !== '0' && `(${alteradoRF})`} em{' '}
            {`${alterado.format('DD/MM/YYYY')}  às ${alterado.format('HH:mm')}`}
          </Col>
        </Row>
      ) : (
        <></>
      )}
    </Container>
  );
};
