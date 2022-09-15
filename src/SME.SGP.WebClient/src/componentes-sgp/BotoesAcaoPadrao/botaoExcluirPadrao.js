import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import Button from '~/componentes/button';
import { SGP_BUTTON_EXCLUIR } from '../filtro/idsCampos';
import { Colors } from '~/componentes/colors';

const BotaoExcluirPadrao = props => {
  const { onClick, disabled } = props;

  return (
    <Tooltip
      title="Excluir"
      placement="bottom"
      mouseEnterDelay={0}
      getTooltipContainer={trigger => trigger.parentNode}
    >
      <span>
        <Button
          semMargemDireita
          id={SGP_BUTTON_EXCLUIR}
          icon="trash-alt"
          color={Colors.Vermelho}
          border
          onClick={onClick}
          disabled={disabled}
        />
      </span>
    </Tooltip>
  );
};

BotaoExcluirPadrao.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

BotaoExcluirPadrao.defaultProps = {
  onClick: () => {},
  disabled: false,
};

export default BotaoExcluirPadrao;
