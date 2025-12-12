import styled from 'styled-components';
import { Base } from '~/componentes/colors';

export const Container = styled.div`
  height: calc(100vh - 64px);
  width: 100%;
  padding: 0;
  margin: 0;
  overflow: auto;
  background-color: ${Base.Branco};
`;
