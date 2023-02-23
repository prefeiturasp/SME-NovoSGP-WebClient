import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import Button from '~/componentes/button';
import { SGP_BUTTON_GERAR_RELATORIO } from '../../constantes/ids/button';
import { Colors } from '~/componentes/colors';
import Loader from '~/componentes/loader';

const BotaoGerarRelatorio = props => {
  const {
    onClick,
    className,
    loading,
    showLoader,
    placement,
    title,
    disabled,
  } = props;

  return (
    <Tooltip
      title={title}
      placement={placement}
      mouseEnterDelay={0}
      className={className}
      getTooltipContainer={trigger => trigger.parentNode}
    >
      <span>
        {showLoader ? (
          <Loader loading={loading} tip="">
            <Button
              semMargemDireita
              icon="print"
              color={Colors.Azul}
              border
              onClick={onClick}
              id={SGP_BUTTON_GERAR_RELATORIO}
              disabled={disabled}
            />
          </Loader>
        ) : (
          <Button
            semMargemDireita
            icon="print"
            color={Colors.Azul}
            border
            onClick={onClick}
            id={SGP_BUTTON_GERAR_RELATORIO}
            disabled={disabled}
          />
        )}
      </span>
    </Tooltip>
  );
};

BotaoGerarRelatorio.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  showLoader: PropTypes.bool,
  loading: PropTypes.bool,
  placement: PropTypes.string,
  title: PropTypes.string,
  disabled: PropTypes.bool,
};

BotaoGerarRelatorio.defaultProps = {
  onClick: () => {},
  className: '',
  showLoader: false,
  loading: false,
  placement: 'bottom',
  title: 'Gerar',
  disabled: false,
};

export default BotaoGerarRelatorio;
