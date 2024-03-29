import styled, { css } from 'styled-components';

// Componentes
import { Base } from '~/componentes/colors';

export const TabelaEstilo = styled.div`
  display: flex;
  width: 100%;

  .tabelaCollapse {
    transition: width 1s linear;
    width: auto !important;
  }

  .icone-ausencia {
    background: none !important;
    color: ${Base.LaranjaAlerta} !important;
  }
`;

export const Tabela = styled.table`
  &.retraido {
    thead tr th:not(:first-child),
    tbody tr td:not(:first-child) {
      display: none;
    }
  }

  thead {
    background: ${Base.CinzaFundo};

    tr {
      th {
        padding: 0.7rem;
        border: 1px solid ${Base.CinzaDesabilitado};

        &:first-child {
          border-top-left-radius: 4px;
        }
      }
    }
  }

  tbody {
    tr {
      td {
        padding: 0.7rem;
        border: 1px solid ${Base.CinzaDesabilitado};

        &:first-child {
          text-align: center;
        }

        .iconeSituacao {
          background: ${Base.Roxo};
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
          margin-left: 0.2rem;
        }

        .iconeAusenciaPercurso {
          background: ${Base.VermelhoAlerta};
          width: 9px;
          height: 9px;
          border-radius: 50%;
          display: inline-block;
          margin-left: 0.2rem;
        }
      }
    }
  }
`;

export const LinhaTabela = styled.tr`
  ${props =>
    !props.ativo &&
    `
		background: ${Base.CinzaDesabilitado};
		color: ${Base.CinzaMako} !important;
		cursor: not-allowed !important;

		&:hover {
			background: ${
        props.processoConcluido ? Base.Verde : Base.CinzaBarras
      }!important;
		}
	`}

  &:hover {
    background: ${Base.Roxo};
    color: white;
    cursor: pointer;

    .iconeSituacao {
      background: white !important;
    }

    .icone-inconsistencia {
      color: white !important;
    }

    .icone-concluido {
      color: ${props =>
        props.processoConcluido ? Base.Verde : Base.CinzaBarras} !important;
      font-size: 16px;
      margin-right: 2px;
    }
  }

  &.selecionado {
    background: ${Base.Roxo};
    color: white !important;

    .iconeSituacao {
      background: white !important;
    }

    .icone-inconsistencia {
      color: white !important;
    }

    .icone-concluido {
      color: ${props =>
        props.processoConcluido ? Base.Verde : Base.CinzaBarras} !important;
      font-size: 16px;
      margin-right: 2px;
    }
  }

  .icone-concluido {
    color: ${props =>
      props.processoConcluido ? Base.Verde : Base.CinzaBarras} !important;
    font-size: 16px;
    margin-right: 2px;
    border-radius: 10px;
  }
`;

export const DetalhesAluno = styled.div`
  flex: 1;
  ${({ larguraAluno }) => css`
    width: ${larguraAluno};
  `}
`;

export const CabecalhoDetalhes = styled.div`
  display: flex;
  justify-content: space-between;

  .titulo {
    background: ${Base.CinzaFundo};
    border: 1px solid ${Base.CinzaDesabilitado};
    border-left: 0;
    border-right: 0;
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0.7rem;
    padding-left: 2rem;
    position: relative;

    span {
      font-weight: bold !important;
      display: block;
    }

    .botaoCollapse {
      position: absolute;
      background: white;
      left: -26px;
      cursor: pointer;
      height: 38px;
      width: 25px;
      border-left: 1px solid ${Base.CinzaDesabilitado};
      color: ${Base.Roxo};
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.1s linear;

      i {
        transition: all 0.1s linear;
      }

      &.retraido {
        left: 0;
        border-left: 0;
        border-right: 1px solid ${Base.CinzaDesabilitado};

        i {
          transform: rotate(180deg);
        }
      }
    }
  }

  .botoes {
    background: ${Base.CinzaFundo};
    max-width: 50% !important;
    display: flex;

    .btn {
      border-radius: 0;
      height: 40px !important;
    }
  }
`;
