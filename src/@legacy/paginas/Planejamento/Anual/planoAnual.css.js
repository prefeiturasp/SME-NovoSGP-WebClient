import { Row } from 'antd';
import styled from 'styled-components';

export const ContainerPlanoAnual = styled.div``;

export const DescItensAutoraisProfessor = styled.div`
  color: #a4a4a4;
  font-size: 12px;
  font-style: italic;
  margin-left: 5px;
`;

export const ContainerColumnReverse = styled.div`
  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

export const ContainerColumnReverseRowAntd = styled(Row)`
  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;
