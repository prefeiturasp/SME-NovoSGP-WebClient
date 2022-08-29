import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Affix } from 'antd';

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
    color: #353535;
    margin-bottom: 0.3rem;
  }

  .background-row {
    background: #f5f6f8 !important;
  }

  .ant-affix .background-row {
    box-shadow: 0 1.5rem 1rem -18px rgb(0 0 0 / 15%);
    padding-bottom: 0.5rem !important;
  }
  padding-bottom: 8px;
`;

const Cabecalho = ({ titulo, pagina, children, classes }) => {
  return (
    <Container className={classes}>
      <Affix offsetTop={70}>
        <div
          className="col-md-12 d-flex background-row pt-2"
          style={{
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
          }}
        >
          <div>
            <span>{titulo}</span>
            <span className="titulo">{pagina}</span>
          </div>
          <div>{children}</div>
        </div>
      </Affix>
    </Container>
  );
};

Cabecalho.defaultProps = {
  titulo: '',
  pagina: '',
  children: '',
  classes: '',
};

Cabecalho.propTypes = {
  titulo: PropTypes.string,
  pagina: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  classes: PropTypes.string,
};
export default Cabecalho;
