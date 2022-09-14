import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import Button from '~/componentes/button';
import { SGP_BUTTON_EXCLUIR } from '../filtro/idsCampos';
import { Colors } from '~/componentes/colors';

const BotaoExcluirPadrao = props => {
  const { onClick, disabled, hidden } = props;

  return (
    <Tooltip title="Excluir" mouseEnterDelay={0}>
      <span>
        <Button
          semMargemDireita
          id={SGP_BUTTON_EXCLUIR}
          icon="trash"
          color={Colors.Vermelho}
          border
          onClick={onClick}
          disabled={disabled}
          hidden={hidden}
        />
      </span>
    </Tooltip>
  );
};

BotaoExcluirPadrao.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
};

BotaoExcluirPadrao.defaultProps = {
  onClick: () => {},
  disabled: false,
  hidden: false,
};

export default BotaoExcluirPadrao;
