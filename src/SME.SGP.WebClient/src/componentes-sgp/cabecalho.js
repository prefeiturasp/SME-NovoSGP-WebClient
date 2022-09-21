import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Affix } from 'antd';
import { Base } from '~/componentes/colors';

const Container = styled.div`
  span {
    object-fit: contain;
    font-family: Roboto;
    font-size: 12px;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    font-weight: bold;
    letter-spacing: normal;
    color: #a4a4a4;
  }

  .titulo {
    height: 29px;
    object-fit: contain;
    font-family: Roboto;
    font-size: 24px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: ${Base.CinzaMako};
    margin-bottom: 0.3rem;
  }

  .background-row {
    background: #f5f6f8;
  }

  .ant-affix .background-row {
    box-shadow: 0 1.5rem 1rem -18px rgb(0 0 0 / 15%);
    padding-bottom: 0.5rem !important;
  }

  padding-bottom: 8px;
  margin-right: -32px;
  margin-left: -32px;
`;

const Cabecalho = ({
  titulo,
  pagina,
  children,
  classes,
  removeAffix,
  style,
}) => {
  const componentePadrao = (
    <div
      className="d-flex background-row pt-2"
      style={{
        justifyContent: 'space-between',
        flexWrap: 'wrap-reverse',
        alignItems: 'end',
        paddingLeft: '32px',
        paddingRight: '32px',
        ...style,
      }}
    >
      <div className="pt-3">
        <span>{titulo}</span>
        <span className="titulo">{pagina}</span>
      </div>
      <div className="d-flex">{children}</div>
    </div>
  );

  return (
    <Container className={classes}>
      {removeAffix ? (
        componentePadrao
      ) : (
        <Affix offsetTop={70}>{componentePadrao}</Affix>
      )}
    </Container>
  );
};

Cabecalho.defaultProps = {
  titulo: '',
  pagina: '',
  children: '',
  classes: '',
  removeAffix: false,
  style: {},
};

Cabecalho.propTypes = {
  titulo: PropTypes.string,
  pagina: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  classes: PropTypes.string,
  removeAffix: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.any]),
};
export default Cabecalho;
