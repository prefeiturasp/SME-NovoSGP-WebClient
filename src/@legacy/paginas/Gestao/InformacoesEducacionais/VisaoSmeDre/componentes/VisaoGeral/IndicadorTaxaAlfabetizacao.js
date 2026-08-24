import PropTypes from 'prop-types';
import CartaoIndicador from './cartaoIdentificador';

import comDefaultProps from '~/utils/comDefaultProps';
const IndicadorTaxaAlfabetizacao = ({ dados, loading }) => {
  return (
    <CartaoIndicador
      titulo="Taxa de alfabetização"
      tooltip="Percentual de alunos que alcançaram as habilidades básicas de leitura e escrita."
      dados={dados}
      loading={loading}
    />
  );
};

IndicadorTaxaAlfabetizacao.propTypes = {
  dados: PropTypes.array,
  loading: PropTypes.bool,
};

IndicadorTaxaAlfabetizacao.defaultProps = {
  dados: [],
  loading: false,
};

export default comDefaultProps(IndicadorTaxaAlfabetizacao, IndicadorTaxaAlfabetizacao.defaultProps);