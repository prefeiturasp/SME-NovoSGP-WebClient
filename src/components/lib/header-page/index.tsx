import { BoxShadow, Colors } from '@/core/styles/colors';
import { Affix } from 'antd';
import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

const AffixContainer = styled.div`
  .ant-affix {
    box-shadow: ${BoxShadow.DEFAULT};
  }
`;

const HeaderContainer = styled.div`
  height: 53px;
  display: flex;
  align-items: end;
  margin-left: -32px;
  margin-right: -32px;
  padding-bottom: 8px;
  background-color: ${Colors.BACKGROUND_CONTENT};
`;

const HeaderContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  margin-left: 32px;
  margin-right: 32px;
  justify-content: space-between;
  align-items: end;
  line-height: normal;
`;

const Title = styled.div`
  font-size: 23px;
  font-weight: 700;
  color: ${Colors.TEXT};
`;

const ChildrenContainer = styled.div``;

type HeaderPageProps = {
  title: string;
} & PropsWithChildren;

const HeaderPage: React.FC<HeaderPageProps> = ({ title, children }) => {
  return (
    <AffixContainer>
      <Affix offsetTop={72}>
        <HeaderContainer>
          <HeaderContentContainer>
            <Title>{title}</Title>
            <ChildrenContainer>{children}</ChildrenContainer>
          </HeaderContentContainer>
        </HeaderContainer>
      </Affix>
    </AffixContainer>
  );
};

export default HeaderPage;
