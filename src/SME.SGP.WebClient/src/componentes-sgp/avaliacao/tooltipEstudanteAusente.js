import { Tooltip } from 'antd';
import React from 'react';

const TooltipEstudanteAusente = () => (
  <Tooltip title="Estudante ausente na data da avaliação">
    <i className="fas fa-user-times icon-aluno-ausente" />
  </Tooltip>
);

export default TooltipEstudanteAusente;
