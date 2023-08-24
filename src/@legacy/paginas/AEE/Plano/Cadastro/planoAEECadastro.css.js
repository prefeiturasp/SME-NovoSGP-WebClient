import styled from 'styled-components';
import { Base } from '~/componentes/colors';

export const Container = styled.div`
  .icon-legenda-aluno-ausente {
    float: right !important;
    background-color: #d06d12 !important;
    color: white !important;
    font-size: 9px !important;
    border: solid 7px #d06d12 !important;
    border-radius: 5px !important;
  }
`


export const BtnExcluirDiasHorario = styled.span`
  .btn-excluir-dias-horario {
    background-color: ${Base.Azul} !important;
    color: ${Base.Branco} !important;
    i {
      margin-right: 0px !important;
      font-size: 11px;
    }
  }
`;
