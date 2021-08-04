import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

export const Conteudo = styled.div`
  background: #f3f3f3;
  border: 1px solid #6f777c;
  box-sizing: border-box;
  border-radius: 4px;
  min-width: 106px;
  min-height: 16px;

  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;

  padding: 4px;
  margin: 4px;
`;

export const IconeEstilizado = styled(FontAwesomeIcon)`
  font-size: 12px;
  font-weight: 900;
  line-height: 16px;
  margin-left: 4px;
  cursor: pointer;
`;
