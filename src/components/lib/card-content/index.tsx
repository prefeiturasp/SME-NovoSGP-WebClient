import { BoxShadow } from '@/core/styles/colors';
import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 100%;
  border-radius: 4px;
  background-color: white;
  box-shadow: ${BoxShadow.CARD_CONTENT};
  padding: 24px;
`;

const CardContent: React.FC<PropsWithChildren> = ({ children }) => (
  <Container>{children}</Container>
);

export default CardContent;
