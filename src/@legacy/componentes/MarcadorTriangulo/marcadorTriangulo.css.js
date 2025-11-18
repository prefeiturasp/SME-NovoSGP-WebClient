import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  height: 0;
  border-bottom: 15px solid transparent;
  border-right: 15px solid ${({ cor }) => cor};
  top: ${({ top }) => top || 0};
  right: ${({ right }) => right || 0};
`;
