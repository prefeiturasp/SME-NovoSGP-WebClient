import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Base } from '../colors';

export const Campo = styled.div`
  width: 100%;

  span {
    margin-bottom: 5px;
    color: ${Base.Vermelho};
  }

  span[class*='is-invalid'] {
    .ant-calendar-picker-input {
      border-color: #dc3545 !important;
    }

    .ant-time-picker-input {
      border-color: #dc3545 !important;
    }
  }

  .ant-calendar-picker-input {
    height: 38px;
  }

  .ant-time-picker-input {
    height: 38px;
  }

  .ant-time-picker {
    width: 100%;
  }

  .ant-calendar-picker {
    width: 100%;
  }

  .ant-calendar-disabled-cell.ant-calendar-today .ant-calendar-date {
    background-color: #f5f5f5;
    ::before {
      border: 0;
    }
  }

  .ant-calendar-today .ant-calendar-date {
    color: black;
    border: 0;
  }

  label {
    font-weight: bold;
  }

  .intervalo-datas {
    text-align: left;

    span {
      padding: 4px 11px;
    }

    input {
      font-size: 14px;
      line-height: 22px;
      text-align: left;
      color: rgba(0, 0, 0, 0.65);
    }
  }
`;

export const IconeEstilizado = styled(FontAwesomeIcon)`
  position: absolute;
  color: rgba(0, 0, 0, 0.25);
  font-weight: 900;
  font-size: 16px;
  line-height: 21px;
  top: 36px;
  left: 43.5%;
  z-index: 999;
`;
