import styled from 'styled-components';

import { Base } from '~/componentes/colors';

export const CaixaMarcadores = styled.span`
  border: 1.6px solid ${Base.Roxo};
  border-radius: 9px;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 8px;
  font-weight: bold;
  color: ${Base.Roxo};
`;

export const IconePlusMarcadores = styled.i`
  color: ${Base.Roxo};
  font-size: 16px;
  margin-left: 5px;
  cursor: pointer;
`;

export const Lista = styled.div`
  .presenca {
    .ant-switch::after {
      content: 'C' !important;
      background-color: #297805;
      color: white;
    }
  }

  .falta {
    .ant-switch::after {
      content: 'F' !important;
      background-color: #b40c02;
      color: white;
    }
  }

  .ant-switch-checked {
    background-color: white;
  }

  .ant-switch {
    border: solid 1px ${Base.CinzaDesabilitado};
    background-color: white;
  }

  .ant-switch-inner {
    color: grey;
  }

  width: 100%;

  .tabela-frequencia-thead {
    background: ${Base.CinzaFundo} !important;
    text-align: center;
    border-left: solid 1px ${Base.CinzaDesabilitado};

    th {
      border-right: solid 1px ${Base.CinzaDesabilitado};
      border-bottom: 1px solid ${Base.CinzaDesabilitado};
    }

    .border-right-none {
      border-right: none !important;
    }
  }

  .tabela-frequencia-tbody {
    text-align: center;
    border-left: solid 1px ${Base.CinzaDesabilitado};

    tr td {
      border-right: solid 1px ${Base.CinzaDesabilitado};
      border-bottom: 1px solid ${Base.CinzaDesabilitado};
    }

    .border-right-none {
      border-right: none !important;
    }

    .btn-falta-presenca {
      color: white;
      background-color: ${Base.CinzaDesabilitado};
    }

    .btn-falta {
      color: white;
      background-color: #b40c02;
    }

    .btn-compareceu {
      color: white;
      background-color: #297805;
    }

    .ant-btn-sm {
      width: 20px;
      height: 20px;
      font-size: 12px;
    }

    .ant-btn:hover,
    .ant-btn:focus {
      border-color: transparent;
    }
  }

  .width-70 {
    width: 70px;
  }

  .width-50 {
    width: 50px;
  }

  .width-60 {
    width: 60px;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .desabilitar-aluno {
    opacity: 0.4 !important;
    cursor: unset !important;
  }

  .scroll-tabela-frequencia-thead {
    overflow-y: scroll;
    ::-webkit-scrollbar {
      width: 9px !important;
      background-color: rgba(229, 237, 244, 0.71) !important;
    }
  }

  .scroll-tabela-frequencia-tbody {
    max-height: 500px;
    overflow-y: scroll;
    border-bottom: solid 1px ${Base.CinzaDesabilitado};

    ::-webkit-scrollbar-track {
      background-color: #f4f4f4 !important;
    }

    ::-webkit-scrollbar {
      width: 9px !important;
      background-color: rgba(229, 237, 244, 0.71) !important;
      border-radius: 2.5px !important;
    }

    ::-webkit-scrollbar-thumb {
      background: #a8a8a8 !important;
      border-radius: 3px !important;
    }
  }

  .marcar-todas-frequencia {
    cursor: unset !important;
    position: absolute;
    margin-left: -13px;
    margin-top: -17px;
    font-size: 10px;
    width: 100px;
    height: 15px;
    background-color: ${Base.CinzaDesabilitado};
  }

  .margin-marcar-todos {
    margin-bottom: -6px;
  }

  .linha-expandida {
    color: ${Base.Roxo};
    background: ${Base.CinzaFundo};
    text-align: left;
    i {
      transform: rotate(-90deg);
    }
  }

  .fa-minus-linha-expandida {
    border: 1.6px solid #6933ff !important;
    border-radius: 20px !important;
    display: inline;
    font-size: 13px;
  }

  .indicativo-alerta {
    background-color: #ffff30;
    color: black;
    border-radius: 8px;
    border-right: solid 5px #ffff30;
    border-left: solid 5px #ffff30;
  }

  .indicativo-critico {
    background-color: #b40c02;
    color: white;
    border-radius: 8px;
    border-right: solid 5px #b40c02;
    border-left: solid 5px #b40c02;
  }

  .btn-com-anotacao {
    color: #ffffff !important;
    border: solid 1px #297805 !important;
    background-color: #297805 !important;
  }
`;

export const ContainerBtbAnotacao = styled.div`
  border-radius: 4px;
  color: ${props => props.cor};
  border: ${props =>
    !props?.possuiAnotacao ? 'none' : `solid 1px ${props.cor}`};
  cursor: ${props => (props.podeAbrirModal ? 'pointer' : 'not-allowed')};
  height: 32px;
  width: 32px;
`;

export const MarcadorSituacao = styled.i`
  font-size: 10px;
  margin-left: 2px;
  padding-top: 5px;
`;

export const ContainerListaFrequencia = styled.div`
  td {
    padding: 5px 0px 0px 0px !important;
  }

  .desabilitar {
    opacity: 0.4 !important;
    cursor: unset !important;
  }
`;

export const MarcarTodasAulasTipoFrequencia = styled.div`
  font-size: 16px;
  cursor: pointer;
`;

export const IndicativoAlerta = styled.div`
  display: inline-block;
  background-color: #ffff30;
  color: black;
  border-radius: 4px;
  border-right: solid 5px #ffff30;
  border-left: solid 5px #ffff30;
`;

export const IndicativoCritico = styled.div`
  display: inline-block;
  background-color: ${Base.Vermelho};
  color: white;
  border-radius: 4px;
  border-right: solid 5px ${Base.Vermelho};
  border-left: solid 5px ${Base.Vermelho};
`;

export const TextoEstilizado = styled.div`
  color: ${({ cor }) => cor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LinhaTabela = styled.div`
  .posicao-marcar-todos-header {
    .ant-table-header-column {
      display: block !important;
    }
  }
  .desabilitar {
    opacity: 0.3 !important;
    cursor: unset !important;
  }

  table:first-child {
    border: 0 !important;
  }

  @supports (-moz-appearance: none) {
    .ant-table {
      table {
        border-collapse: inherit;
      }
    }
  }

  tr {
    position: relative;
    height: 48px;

    th,
    td {
      border: 1px solid #bfbfbf !important;
    }

    & > td {
      padding: 8px 12px !important;
      white-space: break-spaces !important;

      @supports (-moz-appearance: none) {
        padding: 3px 12px !important;
      }
    }
  }

  .linha-ativa {
    background: ${Base.Roxo};
    color: ${Base.Branco} !important;
  }

  .ant-table-expanded-row {
    border: 0 !important;
    background: ${Base.Branco} !important;

    td {
      &:first-child {
        position: relative;
        border: 0 !important;
        padding: 0 !important;
      }

      .table-responsive {
        padding-left: 24px;
        overflow: hidden;
        white-space: break-spaces;
      }

      table {
        margin-bottom: 16px;

        .linha-ativa {
          td {
            border-top: 0 !important;

            &:last-child {
              border-right: 0 !important;
            }
          }
        }

        .ant-table-row {
          td {
            &:last-child {
              width: 329px;
            }
          }
        }
      }
      .sem-nota {
        display: flex;
        justify-content: center;
      }
    }

    /* div {
      width: 100%;
    } */

    thead {
      th {
        background: ${Base.RoxoBorda} !important;
      }

      &::after {
        content: ' ';
        position: absolute;
        font-family: 'Font Awesome 5 Free';
        font-weight: 900;
        border: 1px solid ${Base.Roxo};
        height: 27px;
        left: -24px;
        top: -2px;
        white-space: nowrap;
      }

      &::before {
        content: '\f30b';
        font-family: 'Font Awesome 5 Free';
        font-weight: 900;
        font-size: 16px;
        color: ${Base.Roxo};
        position: absolute;
        left: -23px;
        top: 12px;
      }
    }
  }
`;
