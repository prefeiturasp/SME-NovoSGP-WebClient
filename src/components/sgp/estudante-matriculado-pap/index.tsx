import React from 'react';

import { Tooltip } from 'antd';

import IconePAP from '@/assets/icone_pap.svg';

type EstudanteMatriculadoPAPProps = {
  show: boolean;
  titleTooltip: string;
};
const EstudanteMatriculadoPAP: React.FC<EstudanteMatriculadoPAPProps> = ({
  show,
  titleTooltip = 'Matriculado PAP',
}) => {
  if (show)
    return (
      <Tooltip title={titleTooltip}>
        <img style={{ height: '18px', margin: '0px 6px' }} src={IconePAP} alt="Matriculado PAP" />
      </Tooltip>
    );

  return <></>;
};

export default EstudanteMatriculadoPAP;
