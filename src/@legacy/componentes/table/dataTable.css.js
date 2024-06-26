import styled, { css } from 'styled-components';
import { Base } from '../colors';

export const Container = styled.div`
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

  .ant-table-thead
    > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(
      .ant-table-row-selected
    )
    > td,
  .ant-table-tbody
    > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(
      .ant-table-row-selected
    )
    > td,
  .ant-table-thead
    > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td,
  .ant-table-tbody
    > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td {
    ${({ semHover }) =>
      semHover
        ? css`
                background: transparent !important;
              }
            `
        : css`
            background: ${Base.Roxo} !important;
            color: ${Base.Branco} !important;

            .button-reiniciar-hover {
              color: ${Base.Branco} !important;
              border-color: ${Base.Branco} !important;
            }
          `}
  }

  .ant-table-tbody tr:hover.ant-table-expanded-row > td {
    cursor: default !important;
  }

  .ant-table-tbody tr td {
    border-right: solid 1px ${Base.CinzaDesabilitado};
    cursor: ${props => (props.temEventoOnClickRow ? 'pointer' : 'default')};
    white-space: ${props => (props.tableResponsive ? 'nowrap' : 'unset')};
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

  ${({ semHover }) =>
    semHover
      ? css`
          .ant-table-tbody tr:hover td {
            background: transparent !important;
            cursor: default !important;
          }
        `
      : css`
          .ant-pagination-item-active:focus,
          .ant-pagination-item-active:hover {
            border-color: ${Base.Roxo} !important;
          }

          .ant-pagination-item-active:focus a,
          .ant-pagination-item-active:hover a {
            color: ${Base.Branco} !important;
          }

          .ant-table-tbody tr:hover td:not(.ant-table-expanded-row) > td {
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

            div button {
              color: ${Base.Roxo} !important;
              background: ${Base.Branco} !important;
            }

            i {
              color: ${Base.Branco} !important;
            }
          }

          .ant-table-tbody tr:hover {
            .manual-style-font-awesome-icon {
              color: ${Base.Branco} !important;
            }
          }

          .ant-table-tbody tr:hover:not(.ant-table-expanded-row) > td {
            background: ${Base.Roxo} !important;
            color: ${Base.Branco} !important;
          }
        `}

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

    div button {
      color: ${Base.Roxo} !important;
      background: ${Base.Branco} !important;
    }

    i {
      color: ${Base.Branco} !important;
    }

    .manual-style-font-awesome-icon {
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

      div button {
        -webkit-transition: none;
        transition: none;
      }
    }
  }

  .botao-reiniciar-tabela-acao {
    margin: -10px -7px -10px -14px;
  }

  .botao-reiniciar-tabela-acao-escola-aqui {
    padding: 2px;
    margin: -8px;
  }

  ::-webkit-scrollbar-track {
    background-color: #f4f4f4 !important;
  }

  ::-webkit-scrollbar {
    width: 9px !important;
    background-color: rgba(229, 237, 244, 0.71) !important;
    border-radius: 2.5px !important;
  }

  ::-webkit-scrollbar-thumb {
    background: #a8a8a8 !important;
    border-radius: 3px !important;
  }
`;
