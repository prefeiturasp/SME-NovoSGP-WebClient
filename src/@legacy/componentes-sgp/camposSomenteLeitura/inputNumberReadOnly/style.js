import styled from 'styled-components';

export const Container = styled.div`
  height: 38px;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
`;
