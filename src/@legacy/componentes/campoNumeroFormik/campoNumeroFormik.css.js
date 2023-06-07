import styled from 'styled-components';
import { Base } from '../colors';

export const Campo = styled.div`
  span {
    color: ${Base.Vermelho};
  }

  .campo {
    margin-bottom: 5px;
  }

  .ant-input-number {
    height: '38px';
  }

  .ant-input-number-input {
    height: 26px !important;
  }

  height: ${props => props.height ?? '45px'};
`;
