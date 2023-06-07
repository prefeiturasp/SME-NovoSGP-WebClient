import { Base } from '@/@legacy/componentes/colors';
import styled from 'styled-components';

export const ContainerTipoFrequencia = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  .tamanho-campo-select {
    width: 62px !important;
  }

  .ant-select-arrow {
    color: ${Base.CinzaMako};
  }
`;
