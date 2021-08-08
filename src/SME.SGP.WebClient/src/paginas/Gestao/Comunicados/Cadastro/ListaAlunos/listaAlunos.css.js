import styled from 'styled-components';
import { Table } from 'antd';

import { Base, Button } from '~/componentes';

export const TabelaEstilizada = styled(Table)`
  .ant-table table {
    border-collapse: collapse;
  }

  .ant-checkbox-indeterminate .ant-checkbox-inner::after {
    background-color: ${Base.Roxo} !important;
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${Base.Roxo};
    border-color: ${Base.Branco} !important;
  }

  .ant-table-thead tr th {
    background: ${Base.CinzaFundo} !important;
    border-right: solid 1px ${Base.CinzaDesabilitado};
    text-align: left;
  }

  .ant-table-selection-column {
    text-align: center !important;
    cursor: pointer;
  }

  .ant-table-tbody tr td {
    border-right: solid 1px ${Base.CinzaDesabilitado};
    cursor: pointer;
    white-space: nowrap;
  }

  .ant-table-column-title {
    color: #323c47;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 0.12px;
  }
  .ant-table-tbody tr:hover td {
    background: ${Base.Roxo} !important;
    color: ${Base.Branco} !important;
  }

  .ant-table-tbody tr:hover {
    background: ${Base.Roxo} !important;
    color: ${Base.Branco} !important;
  }

  .ant-table-tbody tr.ant-table-row-selected > td {
    background: ${Base.Roxo};
    color: ${Base.Branco} !important;
  }

  .ant-table-tbody > tr {
    -webkit-transition: none;
    transition: none;

    td {
      -webkit-transition: none;
      transition: none;

      a {
        -webkit-transition: none;
        transition: none;
      }
    }
  }

  .ant-pagination-options {
    padding-left: 20px;
  }
`;

export const BotaoEstilizado = styled(Button)`
  &.btn {
    background: transparent !important;
    padding: 0 !important;
    color: ${Base.CinzaMako};

    &:hover {
      background-color: transparent !important;
      color: inherit !important;
    }

    &-primary {
      &:focus {
        box-shadow: none;
      }
    }

    i {
      margin: 0 !important;
    }
  }
`;
