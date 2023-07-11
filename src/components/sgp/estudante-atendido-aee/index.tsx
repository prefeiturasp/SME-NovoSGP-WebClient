import React from 'react';

import { Tooltip } from 'antd';

import IconeAEE from '@/assets/icone_aee.svg';

type EstudanteAtendidoAEEProps = {
  show: boolean;
  titleTooltip: string;
};
const EstudanteAtendidoAEE: React.FC<EstudanteAtendidoAEEProps> = ({
  show,
  titleTooltip = 'Criança/Estudante atendida pelo AEE',
}) => {
  if (show)
    return (
      <Tooltip title={titleTooltip}>
        <img style={{ height: '18px', margin: '0px 6px' }} src={IconeAEE} alt={titleTooltip} />
      </Tooltip>
    );

  return <></>;
};

export default EstudanteAtendidoAEE;
