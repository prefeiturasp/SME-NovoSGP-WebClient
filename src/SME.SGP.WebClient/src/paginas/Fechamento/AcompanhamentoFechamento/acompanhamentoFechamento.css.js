import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const MarcadorTriangulo = styled.div`
  position: relative;
  margin-top: ${props => props.marginTop || '-11.8px'};
  height: 0;
  border-bottom: 15px solid transparent;
  border-right: 15px solid ${props => props.cor};
  float: right;
  margin-right: ${props => props.marginRight || '-12.3px'};
`;

export const TextoEstilizado = styled.div`
  color: ${({ cor }) => cor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IconeEstilizado = styled(FontAwesomeIcon)`
  font-size: 18px;
  margin-left: 5px;
  margin-right: 5px;
  cursor: pointer;
`;
