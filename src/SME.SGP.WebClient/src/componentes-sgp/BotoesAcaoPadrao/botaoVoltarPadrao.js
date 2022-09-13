import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import Button from '~/componentes/button';
import { SGP_BUTTON_VOLTAR } from '../filtro/idsCampos';
import { Colors } from '~/componentes/colors';

const BotaoVoltarPadrao = props => {
  const { onClick, className } = props;

  return (
    <Tooltip
      title="Voltar"
      placement="left"
      mouseEnterDelay={0}
      className={className}
    >
      <span>
        <Button
          semMargemDireita
          id={SGP_BUTTON_VOLTAR}
          icon="arrow-left"
          color={Colors.Azul}
          border
          onClick={onClick}
        />
      </span>
    </Tooltip>
  );
};

BotaoVoltarPadrao.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
};

BotaoVoltarPadrao.defaultProps = {
  onClick: () => {},
  className: '',
};

export default BotaoVoltarPadrao;
