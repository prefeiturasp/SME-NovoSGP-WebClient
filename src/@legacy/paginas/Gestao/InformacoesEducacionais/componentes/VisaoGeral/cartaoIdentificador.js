import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Loader } from '~/componentes';

const CardContainer = styled.div`
  background-color: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 24px;
  height: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-height: 118px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  h3 {
    margin: 0;
    font-size: 14px;
    color: #42474a;
    font-weight: bold;
  }
  .info-icon {
    margin-left: 8px;
    color: #8c8c8c;
    cursor: pointer;
  }
`;

const CardBody = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 24px;
`;

const ValorContainer = styled.div`
  display: flex;
  flex-direction: column;
  .valor {
    font-size: 20px;
    font-weight: bold;
    color: #42474a;
    line-height: 1.2;
  }
  .label {
    font-size: 12px;
    color: #42474a;
    line-height: 1.2;
  }
`;

const CartaoIndicador = ({ titulo, tooltip, dados, loading }) => {
  return (
    <Loader loading={loading} tip={`Carregando ${titulo}...`}>
      <CardContainer>
        <CardHeader>
          <h3>{titulo}</h3>
          <Tooltip title={tooltip}>
            <InfoCircleOutlined className="info-icon" />
          </Tooltip>
        </CardHeader>
        <CardBody>
          {dados && dados.length > 0 ? (
            dados.map(item => (
              <ValorContainer key={item.label}>
                <span className="valor">{item.valor}</span>
                <span className="label">{item.label}</span>
              </ValorContainer>
            ))
          ) : (
            <span>Sem dados</span>
          )}
        </CardBody>
      </CardContainer>
    </Loader>
  );
};

CartaoIndicador.propTypes = {
  titulo: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  dados: PropTypes.arrayOf(
    PropTypes.shape({
      valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
};

CartaoIndicador.defaultProps = {
  dados: [],
  loading: false,
};

export default CartaoIndicador;
