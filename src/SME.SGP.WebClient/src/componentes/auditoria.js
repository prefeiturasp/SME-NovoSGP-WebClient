/* eslint-disable react/prop-types */
import { Col } from 'antd';
import React, { useState, useEffect } from 'react';
import { Container } from './auditoria.css';

const Auditoria = ({
  criadoPor,
  criadoEm,
  alteradoPor,
  alteradoEm,
  criadoRf,
  alteradoRf,
  criadoRF,
  alteradoRF,
  ignorarMarginTop,
  className,
  novaEstrutura,
}) => {
  const [criado, setCriado] = useState(window.moment());

  const [alterado, setAlterado] = useState(window.moment());

  const rfCriado = criadoRf || criadoRF;
  const rfAlterado = alteradoRf || alteradoRF;

  useEffect(() => {
    if (criadoEm) setCriado(window.moment.utc(criadoEm));
  }, [criadoEm]);

  useEffect(() => {
    if (alteradoEm) setAlterado(window.moment.utc(alteradoEm));
  }, [alteradoEm]);

  return (
    <Container ignorarMarginTop={ignorarMarginTop}>
      {!novaEstrutura && criadoPor ? (
        <div
          className={`${className ||
            'col-md-12 d-flex justify-content-start'} ${
            ignorarMarginTop ? '' : 'mt-2'
          }`}
        >
          INSERIDO por {criadoPor}{' '}
          {rfCriado && rfCriado !== '0' && `(${rfCriado})`} em{' '}
          {`${criado.format('DD/MM/YYYY')} às ${criado.format('HH:mm')}`}
        </div>
      ) : novaEstrutura && criadoPor ? (
        <Col span={24}>
          INSERIDO por {criadoPor}{' '}
          {rfCriado && rfCriado !== '0' && `(${rfCriado})`} em{' '}
          {`${criado.format('DD/MM/YYYY')} às ${criado.format('HH:mm')}`}
        </Col>
      ) : (
        ''
      )}
      {!novaEstrutura && alteradoPor ? (
        <div
          className={`${className ||
            'col-xs-12 col-md-12 col-lg-12 d-flex justify-content-start'} mt-2`}
        >
          ALTERADO por {alteradoPor}{' '}
          {rfAlterado && rfAlterado !== '0' && `(${rfAlterado})`} em{' '}
          {`${alterado.format('DD/MM/YYYY')}  às ${alterado.format('HH:mm')}`}
        </div>
      ) : novaEstrutura && alteradoPor ? (
        <Col span={24}>
          ALTERADO por {alteradoPor}{' '}
          {rfAlterado && rfAlterado !== '0' && `(${rfAlterado})`} em{' '}
          {`${alterado.format('DD/MM/YYYY')}  às ${alterado.format('HH:mm')}`}
        </Col>
      ) : (
        ''
      )}
    </Container>
  );
};

export default Auditoria;
