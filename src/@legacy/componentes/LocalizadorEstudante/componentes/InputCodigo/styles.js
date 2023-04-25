import styled from 'styled-components';
import { Base } from '~/componentes/colors';

export const InputRFEstilo = styled.div`
  .ant-input-affix-wrapper {
    height: 38px;
  }

  .ant-input-suffix {
    i {
      color: ${Base.Roxo};
    }

    button:disabled i {
      color: ${Base.CinzaMenu};
    }

    button {
      padding: 0px;
    }
  }
`;
