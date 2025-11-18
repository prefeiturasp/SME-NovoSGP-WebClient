import { Tooltip } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Base } from '~/componentes/colors';

const Container = styled.div`
  position: absolute;
  border-bottom: 35px solid transparent;
  border-left: 35px solid ${Base.LaranjaAlerta};
  top: 0;
  left: 0;

  i {
    position: absolute;
    color: ${Base.Branco};
    right: 17px;
    font-size: 11px;
    top: 4px;
  }
`;

const LabelAusenteCellTable = () => (
  <Tooltip title="Estudante ausente na data da avaliação">
    <Container>
      <i className="fas fa-user-times" />
    </Container>
  </Tooltip>
);

export default LabelAusenteCellTable;
