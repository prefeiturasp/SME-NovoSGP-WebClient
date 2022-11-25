import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import Button from '~/componentes/button';
import { SGP_BUTTON_EXCLUIR } from '../../constantes/ids/button';
import { Colors } from '~/componentes/colors';

const BotaoExcluirPadrao = props => {
  const { onClick, disabled, className, id } = props;

  return (
    <Tooltip
      title="Excluir"
      placement="bottom"
      mouseEnterDelay={0}
      getTooltipContainer={trigger => trigger.parentNode}
      className={className}
    >
      <span>
        <Button
          disabled={disabled}
          semMargemDireita
          id={id || SGP_BUTTON_EXCLUIR}
          icon="trash-alt"
          color={Colors.Vermelho}
          border
          onClick={onClick}
        />
      </span>
    </Tooltip>
  );
};

BotaoExcluirPadrao.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
};

BotaoExcluirPadrao.defaultProps = {
  onClick: () => {},
  disabled: false,
  className: '',
  id: '',
};

export default BotaoExcluirPadrao;
