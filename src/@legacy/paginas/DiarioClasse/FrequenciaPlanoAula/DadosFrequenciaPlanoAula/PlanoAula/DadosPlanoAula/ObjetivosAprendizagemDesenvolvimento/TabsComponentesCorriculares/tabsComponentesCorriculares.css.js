import styled from 'styled-components';
import { Base } from '~/componentes/colors';

export const DescricaoNomeTabComponenteCurricular = styled.span`
  .desc-nome {
    color: ${props =>
      props.tabSelecionada ? `${Base.Roxo}` : `${Base.Verde}`};
  }

  i {
    color: ${Base.Verde} !important;
  }
`;
