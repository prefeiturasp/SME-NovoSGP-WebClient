import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Base } from '~/componentes/colors';

const Container = styled.div`
  height: 45px;

  .tamanho-campo-select {
    position: relative;
  }

  .ant-select {
    width: 100%;
  }

  .ant-select-arrow {
    color: ${Base.CinzaMako};
    position: absolute;
    right: 11px;
    top: 10px;
  }

  .ant-select-selection--single {
    align-items: center;
    display: flex;
    ${'height: 38px;'}
  }

  .ant-select-selection__rendered {
    width: 98%;
  }

  .ant-select-selection-selected-value {
    font-weight: bold;
    padding-right: 17px;
  }
`;

const CampoTipoFreqSomenteLeitura = props => {
  const { id, valor, className, style, desabilitar } = props;

  return (
    <Container>
      <div id={id} className={`overflow-hidden ant-select ${className} p-0`}>
        <div
          className="ant-select-selection ant-select-selection--single"
          style={{ ...style, cursor: desabilitar ? 'default' : 'pointer' }}
        >
          <div className="ant-select-selection__rendered">
            <div className="ant-select-selection-selected-value">{valor}</div>
          </div>
          <span className="ant-select-arrow">
            <i className="fas fa-angle-down" style={{ fontSize: 18 }} />
          </span>
        </div>
      </div>
    </Container>
  );
};

CampoTipoFreqSomenteLeitura.propTypes = {
  id: PropTypes.string,
  valor: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object]),
  desabilitar: PropTypes.bool,
};

CampoTipoFreqSomenteLeitura.defaultProps = {
  id: 'campo-tipo-freq-somente-leitura',
  valor: '',
  className: '',
  style: {},
  desabilitar: false,
};

export default CampoTipoFreqSomenteLeitura;
