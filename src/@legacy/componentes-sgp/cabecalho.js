import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Affix } from 'antd';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Base } from '~/componentes/colors';
import { obterAjudaDoSistemaURL } from '~/servicos';

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
  const usuario = useSelector(state => state.usuario);

  const [urlAjuda, setUrlAjuda] = useState('');

  const onClickAjuda = () => window.open(urlAjuda, '_blank');

  useEffect(() => {
    const url = obterAjudaDoSistemaURL();
    setUrlAjuda(url);
  }, []);

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
      <div className="d-flex align-items-center pt-3">
        <span>{titulo}</span>
        <span className="titulo">{pagina}</span>
        {pagina && urlAjuda && (
          <FontAwesomeIcon
            cursor="pointer"
            onClick={onClickAjuda}
            style={{
              fontSize: '16px',
              color: Base.Azul,
              marginLeft: 5,
              marginRight: 5,
            }}
            icon={faQuestionCircle}
          />
        )}
      </div>
      <div className="d-flex">{children}</div>
    </div>
  );
  const offsetTop = usuario?.acessoAdmin ? 114.15 : 70;

  return (
    <Container className={classes}>
      {removeAffix ? (
        componentePadrao
      ) : (
        <Affix offsetTop={offsetTop}>{componentePadrao}</Affix>
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
