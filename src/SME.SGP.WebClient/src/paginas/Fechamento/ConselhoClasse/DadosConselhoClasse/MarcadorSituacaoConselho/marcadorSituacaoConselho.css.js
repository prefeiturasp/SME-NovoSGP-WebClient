import styled from 'styled-components';
import { Base } from '~/componentes';

export const Situacao = styled.div`
  font-size: 12px;
  color: ${Base.Preto};
  display: 'flex';
  align-items: 'center';
  justify-content: 'center';
  text-align: center;
  margin-right: 13px;
  height: 23px;
  padding-top: 3px;

  span {
    font-weight: bold;
  }
`;
