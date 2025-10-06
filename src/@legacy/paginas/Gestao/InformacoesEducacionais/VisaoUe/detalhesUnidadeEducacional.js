import PropTypes from 'prop-types';
import { CardEstilizado } from '../shared/styles';
import DetalhesUe from './componentes/DetalhesUe/detalhesUe';
import TabelaIdep from './componentes/TabelaIdep/tabelaIdep';

export default function DetalhesUnidadeEducacional({ anoLetivo, ueCodigo }) {
  return (
    <>
      <CardEstilizado>
        <DetalhesUe anoLetivo={anoLetivo} ueCodigo={ueCodigo} />
      </CardEstilizado>

      <CardEstilizado>
        <TabelaIdep anoLetivo={anoLetivo} ueCodigo={ueCodigo} />
      </CardEstilizado>
    </>
  );
}

DetalhesUnidadeEducacional.propTypes = {
  anoLetivo: PropTypes.string,
  ueCodigo: PropTypes.string,
};

DetalhesUnidadeEducacional.defaultProps = {
  anoLetivo: null,
  ueCodigo: null,
};
