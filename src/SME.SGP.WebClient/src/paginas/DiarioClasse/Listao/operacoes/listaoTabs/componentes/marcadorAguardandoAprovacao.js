import { Tooltip } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Base } from '~/componentes/colors';

export const Container = styled.div`
  position: absolute;
  border-left: 35px solid transparent;
  border-bottom: 35px solid ${Base.CinzaBordaCalendario};
  bottom: 0;
  right: 0;

  i {
    position: absolute;
    color: ${Base.Branco};
    right: 5px;
    font-size: 12px;
    bottom: -30px;
  }
`;
const MarcadorAguardandoAprovacao = () => (
  <Tooltip title="Aguardando aprovação">
    <Container>
      <i className="fa fa-hourglass-half" />
    </Container>
  </Tooltip>
);

export default MarcadorAguardandoAprovacao;
