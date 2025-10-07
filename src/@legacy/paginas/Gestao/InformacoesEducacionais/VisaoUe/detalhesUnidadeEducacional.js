import PropTypes from 'prop-types';
import { CardEstilizado } from '../shared/styles';
import DetalhesUe from './componentes/DetalhesUe/detalhesUe';
import TabelaIdep from './componentes/TabelaIdep/tabelaIdep';
import { Col, Row } from 'antd';

export default function DetalhesUnidadeEducacional({
  anoLetivo,
  ueCodigo,
  dreNome,
  ueNome,
}) {
  return (
    <>
      <CardEstilizado>
        <div className="col-md-12">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <DetalhesUe
                codigoUe={ueCodigo}
                nomeUe={ueNome}
                nomeDre={dreNome}
              />
            </Col>
          </Row>
        </div>
      </CardEstilizado>

      <CardEstilizado>
        <div className="col-md-12">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <TabelaIdep anoLetivo={anoLetivo} ueCodigo={ueCodigo} />
            </Col>
          </Row>
        </div>
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
