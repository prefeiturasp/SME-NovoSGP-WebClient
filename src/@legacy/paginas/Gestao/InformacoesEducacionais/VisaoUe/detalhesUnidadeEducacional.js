import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import { CardEstilizado } from '../shared/styles';
import DetalhesUe from './componentes/DetalhesUe/detalhesUe';
import TabelaIdep from './componentes/TabelaIdep/tabelaIdep';
import TabelaAbandonoUe from './componentes/Abandono/tabelaAbandonoUe';
import TabelaSondagemUe from './componentes/Sondagem/tabelaSondagemUe';
import Reclassificados from './componentes/Reclassificados/reclassificados';
export default function DetalhesUnidadeEducacional({
  anoLetivo,
  ueCodigo,
  dreNome,
  ueNome,
  dreCodigo,
}) {
  return (
    <>
      <CardEstilizado>
        <div className="col-md-12 mb-32">
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

        <div className="col-md-12 mb-32">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <TabelaIdep anoLetivo={anoLetivo} ueCodigo={ueCodigo} />
            </Col>
          </Row>
        </div>

        <div className="col-md-12 mb-32">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <TabelaSondagemUe
                anoLetivo={anoLetivo}
                ueCodigo={ueCodigo}
                dreCodigo={dreCodigo}
              />
            </Col>
          </Row>
        </div>

        <div className="col-md-12 mb-32">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <TabelaAbandonoUe
                anoLetivo={anoLetivo}
                ueCodigo={ueCodigo}
                dreCodigo={dreCodigo}
              />
            </Col>
          </Row>
        </div>

        <div className="col-md-12 mb-32">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Reclassificados
                anoLetivo={anoLetivo}
                ueCodigo={ueCodigo}
                dreCodigo={dreCodigo}
              />
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
