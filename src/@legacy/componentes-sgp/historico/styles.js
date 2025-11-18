import { Base } from '@/@legacy/componentes';
import styled from 'styled-components';

export const Container = styled.div`
  padding: 8px 0;
  line-height: 20px;

  + ul {
    margin-top: 20px;
  }

  :not(:last-child) {
    border-bottom: 1px solid ${Base.CinzaDesabilitado};
  }

  .bold {
    font-weight: 700;
  }
`;
