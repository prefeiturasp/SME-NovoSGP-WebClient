import styled from 'styled-components';

import { Button, Base, RadioGroupButton } from '~/componentes';

export const BotaoEstilizado = styled(Button)`
  &.btn {
    background: transparent !important;
    padding: 0 !important;
    color: ${Base.CinzaBotao};

    &:hover {
      background-color: transparent !important;
      color: inherit !important;
    }

    &-primary {
      &:focus {
        box-shadow: none;
      }
    }

    i {
      margin: 0 !important;
    }
  }
`;

export const BotoesRodape = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-left: 24px;
  border-top: solid 1.5px rgba(0, 0, 0, 0.12);
  padding-top: 16px;
`;

export const RadioGroupButtonCustomizado = styled(RadioGroupButton)`
  .ant-radio-group {
    display: flex;
    flex-direction: column;
  }
  label {
    padding: 4px 0;
  }
`;
