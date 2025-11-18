import PropTypes from 'prop-types';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import { SGP_BUTTON_CANCELAR } from '../../constantes/ids/button';

const BotaoCancelarPadrao = props => {
  const { onClick, disabled } = props;

  return (
    <Button
      id={SGP_BUTTON_CANCELAR}
      label="Cancelar"
      color={Colors.Roxo}
      onClick={onClick}
      disabled={disabled}
      border
    />
  );
};

BotaoCancelarPadrao.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

BotaoCancelarPadrao.defaultProps = {
  onClick: () => {},
  disabled: false,
};

export default BotaoCancelarPadrao;
