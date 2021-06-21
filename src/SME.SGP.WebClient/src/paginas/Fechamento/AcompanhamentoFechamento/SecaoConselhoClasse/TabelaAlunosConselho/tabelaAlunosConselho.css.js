import styled from 'styled-components';

import { Base } from '~/componentes/colors';

export const LinhaTabela = styled.div`
  table:first-child {
    border: 0 !important;
  }

  @supports (-moz-appearance: none) {
    .ant-table {
      table {
        border-collapse: inherit;
      }
    }
  }

  tr {
    position: relative;
    height: 48px;

    th,
    td {
      border: 1px solid #bfbfbf !important;
    }

    & > td {
      padding: 8px 12px !important;
      white-space: break-spaces !important;

      @supports (-moz-appearance: none) {
        padding: 3px 12px !important;
      }
    }
  }

  .linha-ativa {
    background: ${Base.Roxo};
    color: ${Base.Branco} !important;
  }

  .ant-table-expanded-row {
    border: 0 !important;
    background: ${Base.Branco} !important;

    td {
      &:first-child {
        position: relative;
        border: 0 !important;
        padding: 0 !important;
      }

      .table-responsive {
        padding-left: 24px;
        overflow: hidden;
        white-space: break-spaces;

        @supports (-moz-appearance: none) {
          margin-top: -22px;
          padding-left: 25px;
        }
      }

      table {
        margin-bottom: 16px;

        .linha-ativa {
          td {
            border-top: 0 !important;

            &:last-child {
              border-right: 0 !important;
            }
          }
        }

        .ant-table-row {
          td {
            &:last-child {
              width: 329px;
            }
          }
        }
      }
      .sem-nota {
        display: flex;
        justify-content: center;
      }
    }

    div {
      width: 100%;
    }

    thead {
      th {
        background: ${Base.RoxoBorda} !important;
      }

      &::after {
        content: ' ';
        position: absolute;
        font-family: 'Font Awesome 5 Free';
        font-weight: 900;
        border: 1px solid ${Base.Roxo};
        height: 27px;
        left: -24px;
        top: -2px;
        white-space: nowrap;
      }

      &::before {
        content: '\f30b';
        font-family: 'Font Awesome 5 Free';
        font-weight: 900;
        font-size: 16px;
        color: ${Base.Roxo};
        position: absolute;
        left: -23px;
        top: 12px;
      }
    }
  }
`;
