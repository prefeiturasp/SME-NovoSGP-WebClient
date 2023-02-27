import styled, { css, keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Base } from '~/componentes';

export const LabelParecer = styled.div`
  font-size: 12px;
  color: rgb(33, 37, 41);
  background-color: ${Base.Roxo};
  color: ${Base.Branco};
  display: 'flex';
  align-items: 'center';
  justify-content: 'center';
  text-align: center;
  border-radius: 4px;
  margin-right: 14px;
  height: 23px;
  padding-top: 3px;

  span {
    margin: 11px;
  }
`;

export const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const IconeEstilizado = styled(FontAwesomeIcon)`
  font-size: 18px;
  cursor: pointer;
  color: ${Base.Verde};
  ${({ sincronizando }) =>
    sincronizando &&
    css`
      animation: ${rotate} 2s linear infinite;
    `};
`;
