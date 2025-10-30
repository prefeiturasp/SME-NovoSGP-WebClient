import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import { CardEstilizado } from '../shared/styles';
import DetalhesUe from './componentes/DetalhesUe/detalhesUe';
import TabelaIdep from './componentes/TabelaIdep/tabelaIdep';
import TabelaAbandonoUe from './componentes/Abandono/tabelaAbandonoUe';
import TabelaSondagemUe from './componentes/Sondagem/tabelaSondagemUe';
import DistorcaoIdadeSerieUe from './componentes/DistorcaoIdadeSerieUe/DistorcaoIdadeSerieUe';
import GraficoAlfabetizacao from '../VisaoSmeDre/componentes/GraficoAnaliseDeAlfabetizacao/graficoAnaliseDeAlfabetizacao';
import GraficoFrequenciaSemanalCollapse from './componentes/GraficoFrequenciaSemanal/GraficoFrequenciaSemanalCollapse';
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
              <DistorcaoIdadeSerieUe
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
              <GraficoFrequenciaSemanalCollapse
                anoLetivo={anoLetivo}
                ueCodigo={ueCodigo}
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
