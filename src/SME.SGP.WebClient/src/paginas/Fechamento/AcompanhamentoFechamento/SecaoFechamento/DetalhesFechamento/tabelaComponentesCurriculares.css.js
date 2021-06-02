import styled from 'styled-components';

import { Base } from '~/componentes/colors';

export const LinhaTabela = styled.div`
  table:first-child {
    border: 0 !important;
  }

  tr {
    border: 1px solid #e8e8e8;
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
        border: 0 !important;
        padding: 0 4px !important;
      }
    }
  }
`;
