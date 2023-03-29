import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Base } from '../colors';

export const Campo = styled.div`
  [class*='is-invalid'] {
    border-color: ${Base.Vermelho} !important;
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
