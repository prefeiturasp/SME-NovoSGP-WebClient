import styled from 'styled-components';
import { Base } from '~/componentes';

export const Div = styled.div``;

export const Titulo = styled(Div)`
  color: ${Base.CinzaMako};
  font-size: 24px;
`;

export const Badge = styled.button`
  &:focus {
    outline: none;
  }

  &:last-child {
    margin-right: 10 !important;
  }

  &[aria-pressed='true'] {
    background: ${Base.Roxo} !important;
    border-color: ${Base.CinzaBadge} !important;
    color: ${Base.Branco} !important;
  }
`;

export const InseridoAlterado = styled(Div)`
  color: ${Base.CinzaMako};
  font-size: 10px;
  font-weight: bold;
  p {
    margin: 0;
  }
`;
