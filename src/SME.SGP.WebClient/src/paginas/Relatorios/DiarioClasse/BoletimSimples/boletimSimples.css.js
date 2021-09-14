import { createGlobalStyle } from 'styled-components';
import { Base } from '~/componentes';

export const EstiloModal = createGlobalStyle`
  .ant-modal{
    &-content {
      margin-top: calc(50% - 91px);
    }

    &-close {
      display: none;
    }

    &-title {
      font-weight: bold;
      font-size: 18px !important;
      line-height: 24px;
      color: ${Base.CinzaMako};
    }

    &-header{
      border: 0;
      padding: 16px 16px 8px 16px;
    }

    &-body {
      padding: 0 16px;
      font-size: 16px !important;
      line-height: 24px;
      color: ${Base.CinzaMako};
    }

    &-footer {
      padding: 16px;
      .btn-primary{
        background: ${Base.Branco} !important;
        color: ${Base.Azul};
        border: 1px solid ${Base.Azul} !important;

      }

      .botao-confirmacao{
        color: ${Base.CinzaMako} !important;
        border: 1px solid ${Base.Branco} !important;

        &:hover{
          background: ${Base.CinzaBadge} !important;
          color: ${Base.CinzaMako} !important;
        }
      }
    }
  }
`;
