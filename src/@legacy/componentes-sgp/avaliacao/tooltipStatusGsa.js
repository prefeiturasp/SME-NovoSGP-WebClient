import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'antd';
import React from 'react';

const TooltipStatusGsa = () => (
  <Tooltip
    title="Atividade entregue no Google Sala de Aula"
    overlayClassName="ant-tooltip-inner-286"
  >
    <FontAwesomeIcon
      style={{
        fontSize: '16px',
        color: '#297805',
        margin: '7.5px',
      }}
      icon={faCheck}
    />
  </Tooltip>
);

export default TooltipStatusGsa;
