import { Tooltip } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Base } from '~/componentes/colors';

export const Container = styled.div`
  position: absolute;
  border-bottom: 15px solid transparent;
  border-right: 15px solid ${Base.LaranjaCalendario};
  top: 0;
  margin-left: 82px;
`;
const MarcadorAguardandoAprovacao = () => (
  <Tooltip title="Aguardando aprovação">
    <Container />
  </Tooltip>
);

export default MarcadorAguardandoAprovacao;
