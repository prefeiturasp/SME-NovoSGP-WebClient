import { Button as ButtonAntd, ButtonProps } from 'antd';
import React from 'react';
import styled from 'styled-components';

const ButtonContainer = styled(ButtonAntd)`
  &.ant-btn {
    font-weight: 700;
  }

  &.ant-btn-default:not(:disabled) {
    border-color: ${(props) => props.theme?.token?.colorPrimary};
    color: ${(props) => props.theme?.token?.colorPrimary};

    :not(.ant-btn-disabled):hover {
      color: ${(props) => props.theme?.token?.colorPrimary};
      border-color: ${(props) => props?.theme?.token?.colorPrimary};
    }
  }
`;

const ButtonSecundary: React.FC<ButtonProps> = ({ ...rest }) => (
  <ButtonContainer type="default" block style={{ fontWeight: 700 }} {...rest} />
);

export default ButtonSecundary;
