import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
      padding: 8px !important;

      &:first-child {
        border: 0 !important;
        padding: 0 4px !important;
      }
      &:nth-child(2) {
        width: 70.5% !important;
      }
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
