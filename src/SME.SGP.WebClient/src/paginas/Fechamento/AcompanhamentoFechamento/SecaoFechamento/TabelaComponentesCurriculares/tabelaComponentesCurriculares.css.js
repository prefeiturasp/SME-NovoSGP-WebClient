import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Base } from '~/componentes/colors';

export const LinhaTabela = styled.div`
  table:first-child {
    border: 0 !important;
  }

  tr {
    border: 1px solid #e8e8e8;
    height: 48px;
  }

  .linha-ativa {
    background: ${Base.Roxo};
    color: ${Base.Branco} !important;
  }

  .ant-table-expanded-row {
    border: 0 !important;
    background: ${Base.Branco} !important;

    td {
      padding: 8px !important;

      &:first-child {
        border: 0 !important;
        padding: 0 2px !important;

        .tabela-pendencias-html {
          tr {
            & > td {
              padding: 11px 8px !important;
            }
          }
        }
      }
    }
  }

  .tabela-pendencias-html {
    padding: 8px 1px;

    table {
      font-size: 14px;
      width: 100%;

      tr,
      td {
        border: 1px solid #e8e8e8;
      }

      tr {
        & > td {
          padding: 11px 8px !important;
        }
      }
    }

    .cabecalho {
      background: #f5f6f8 !important;
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
  color: ${Base.CinzaMako};
  font-weight: 900;
  transform: rotate(90deg);
  margin-left: 8px;
  margin-right: 16px;
`;
