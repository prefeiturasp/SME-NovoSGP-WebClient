import styled from 'styled-components';

type ContainerProps = {
  color: string;
  height?: string;
};

export const ContainerCardTotalizador = styled.div<ContainerProps>`
  height: ${(props) => props?.height || '129px'};
  border-radius: 4px;
  border: 2px solid ${(props) => props?.color};
  border-left: 8px solid ${(props) => props?.color};
  font-size: 48px;
  font-weight: 700;
  color: ${(props) => props?.color};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px;
`;

export const TitleCard = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: #42474a;
`;

export const LabelCard = styled.div<ContainerProps>`
  font-weight: 700;
  font-size: 14px;
  color: ${(props) => props?.color};
`;
