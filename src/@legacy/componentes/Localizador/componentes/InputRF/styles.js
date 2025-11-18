import styled from 'styled-components';

// Componentes
import { Base } from '~/componentes';

export const InputRFEstilo = styled.div`
  span {
    color: ${Base.Vermelho};
  }

  span.mensagemErro {
    padding: 3px 0 !important;
    display: block;
    font-size: 0.8rem;
  }

  span[class*='is-invalid'] {
    .ant-input {
      border-color: #dc3545 !important;
    }
  }

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
