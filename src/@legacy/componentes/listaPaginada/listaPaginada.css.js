import styled from 'styled-components';
import { Base } from '../colors';

export const Container = styled.div`
  .ocultar-coluna-multi-selecao {
    .ant-table-selection-column {
      display: none !important;
    }
    .ant-table-selection-col {
      display: none !important;
    }
  }

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

  .ant-table-tbody tr td span.cor-vermelho {
    color: ${Base.Vermelho};
  }

  .ant-table-tbody tr:not(.ant-table-expanded-row):hover td {
    background: ${Base.Roxo} !important;
    color: ${Base.Branco} !important;

    span.cor-vermelho {
      color: ${Base.Branco} !important;
    }

    span.cor-novo-registro-lista {
      color: ${Base.Branco} !important;
    }

    a.texto-vermelho-negrito {
      color: ${Base.Branco} !important;
    }

    a.cor-novo-registro-lista {
      color: ${Base.Branco} !important;
    }

    .cor-branco-hover {
      color: ${Base.Branco} !important;
    }
  }

  .ant-table-tbody tr:not(.ant-table-expanded-row):hover {
    background: ${Base.Roxo} !important;
    color: ${Base.Branco} !important;
  }

  .ant-table-tbody tr.ant-table-expanded-row {
    background: none !important;
  }

  .ant-table-tbody tr.ant-table-expanded-row td {
    cursor: default !important;
  }

  .ant-table-tbody tr.ant-table-row-selected > td {
    background: ${Base.Roxo};
    color: ${Base.Branco} !important;

    span.cor-vermelho {
      color: ${Base.Branco} !important;
    }

    span.cor-novo-registro-lista {
      color: ${Base.Branco} !important;
    }

    a.texto-vermelho-negrito {
      color: ${Base.Branco} !important;
    }

    a.cor-novo-registro-lista {
      color: ${Base.Branco} !important;
    }
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
`;
