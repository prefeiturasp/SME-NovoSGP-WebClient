import styled from 'styled-components';
import { Base } from '~/componentes/colors';

export const Div = styled.div``;

export const TipoEventosLista = styled(Div)`
  bottom: 5px;
  right: 10px;
`;

export const TipoEvento = styled(Div).attrs(props => ({
  className: 'd-block text-white',
  cor: props.cor ? props.cor : Base.AzulCalendario,
}))`
  align-self: flex-end;
  background: ${props => props.cor};
  border-radius: 999px;
  display: inline-flex;
  font-size: 12px;
  justify-content: center;
  margin-left: auto;
  margin-right: 0;
  margin-bottom: 2px;
  min-width: 60px;
  padding: 0.1rem 0.5rem;
  &:last-child {
    margin-bottom: 0;
  }
`;
