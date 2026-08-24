import PropTypes from 'prop-types';
import CartaoIndicador from './cartaoIdentificador';

import comDefaultProps from '~/utils/comDefaultProps';
const IndicadorIdeb = ({ dados, loading }) => {
  return (
    <CartaoIndicador
      titulo="IDEB"
      tooltip="Índice de Desenvolvimento da Educação Básica"
      dados={dados}
      loading={loading}
    />
  );
};

IndicadorIdeb.propTypes = {
  dados: PropTypes.array,
  loading: PropTypes.bool,
};

IndicadorIdeb.defaultProps = {
  dados: [],
  loading: false,
};

export default comDefaultProps(IndicadorIdeb, IndicadorIdeb.defaultProps);