import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Base } from '~/componentes/colors';

const LinhaVerticalCss = css`
  content: ' ';
  position: absolute;
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  border: 1px solid ${Base.Roxo};
  height: 100%;
  left: -24px;
  top: -29px;
`;

export const LinhaTabela = styled.div`
  .ant-table-wrapper
    .ant-table.ant-table-middle
    .ant-table-tbody
    .ant-table-wrapper:only-child
    .ant-table {
    margin-block: unset !important;
    margin-inline: unset !important;
  }

  .ant-table-wrapper .ant-table.ant-table-middle {
    .ant-table-container {
      border-left: none !important;
    }
  }

  .table-responsive {
    background: white !important;
  }

  .ant-table-expanded-row.ant-table-expanded-row-level-1 > td {
    border-left: none !important;
    padding: 0px !important;
  }

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
    }
  }

  .linha-ativa {
    background: ${Base.Roxo};
    color: ${Base.Branco} !important;
  }

  .tabela-expandida-pendencias {
    .borda-seta {
      &::after {
        ${LinhaVerticalCss};
        top: -2px;
      }

      &:nth-child(n-1) {
        &::after {
          ${LinhaVerticalCss};
        }
      }
    }
  }

  .ant-table-expanded-row {
    border: 0 !important;
    background: ${Base.Branco} !important;

    &:not(:last-child) {
      &::after {
        ${LinhaVerticalCss};
      }
    }

    td {
      &:first-child {
        position: relative;
      }

      .table-responsive {
        padding-left: 24px;
      }

      table {
        &:first-child {
          border-left: 1px !important;
        }

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
    }

    div {
      width: 100%;
    }
  }

  .tabela-pendencias-html {
    padding-left: 24px;

    table {
      table-layout: fixed;
      font-size: 14px;
      width: 100%;

      tr,
      td {
        border: 1px solid #bfbfbf !important;
      }

      td {
        &:first-child {
          padding: 8px 12px !important;
          white-space: break-spaces;
          border: 1px solid #bfbfbf !important;
        }
      }
    }

    .cabecalho {
      background: ${Base.RoxoBorda} !important;
      color: #323c47;
      font-weight: bold;
    }

    .nao-exibir {
      display: none;
    }
  }
`;

export const IconeSeta = styled(FontAwesomeIcon)`
  color: ${({ cor }) => cor} !important;
  font-size: 16px;
  color: ${Base.Roxo};
  font-weight: 900;
  transform: rotate(90deg);
  margin-left: 8px;
  margin-right: 16px;

  position: absolute;
  left: -32px;
  top: calc(50% - 12px);
`;

export const LinhaVertical = styled.div`
  border-left: 2px solid ${Base.Roxo};
  position: absolute;
  height: 26px;
  left: 0;
  top: 0;

  &::before {
    content: '\f30b';
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
    font-size: 16px;
    color: ${Base.Roxo};
    position: absolute;
    left: -1px;
    top: 13px;
  }
`;
