import styled, { css } from 'styled-components';

export const BotaoImprimir = styled.div`
  i {
    margin-right: 0 !important;
  }
`;

export const IframeStyle = css`
  table {
    border-spacing: 0;
  }

  td {
    border: 1px solid #e8e8e8;
    font-size: 14px;

    padding: 11px 8px;
  }

  .cabecalho {
    background: #f5f6f8 !important;
    color: #323c47;
    font-weight: bold;
  }

  .cabecalho td:first-child {
    width: 150px;
  }

  .nao-exibir td {
    border: 0;
  }

  .sem-borda {
    border: 0;
    padding: 0;
  }
`;
