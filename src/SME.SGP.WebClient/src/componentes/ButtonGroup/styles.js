import styled from 'styled-components';

export const ButtonGroupEstilo = styled.div`
  padding-bottom: ${({ paddingBottom }) => `${paddingBottom} !important`};
  .btnGroupItem:not(:last-child) {
    margin-right: 16px;
  }
`;
