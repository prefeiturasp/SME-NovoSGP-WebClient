import { Col, Row } from 'antd';
import { CardEstilizado, TituloCard } from '../shared/styles';
import GraficoAnaliseDeAlfabetizacao from './componentes/GraficoAnaliseDeAlfabetizacao/graficoAnaliseDeAlfabetizacao';
import GraficoAnaliseDeFrequencia from './componentes/GraficoAnaliseDeFrequencia';
import GraficoFluenciaLeitora from './componentes/GraficoFluenciaLeitora/graficoFluenciaLeitora';
import GraficoFrequenciaPorModalidade from './componentes/GraficoFrequenciaPorModalidade';
import GraficoIdeb from './componentes/GraficoIdeb/graficoIdeb';
import GraficoIdep from './componentes/GraficoIdep/graficoIdep';
import TabelaIndicadoresNivelCriticoAlfabetizacao from './componentes/TabelaIndicadoresNivelCriticoAlfabetizacao/tabelaIndicadoresNivelCriticoAlfabetizacao';
import TabelaIndicadoresPap from './componentes/TabelaIndicadoresPap/tabelaIndicadoresPap';
import TabelaAbandonoSmeDre from './componentes/Abandono/tabelaAbandonoSmeDre';
import VisaoGeral from './componentes/VisaoGeral';
import PropTypes from 'prop-types';
import TabelaNotasSmeDre from './componentes/Notas/tabelaNotasSmeDre';
import TabelaEstudantesReclassificados from '../shared/estudantesReclassificados/tabelaEstudantesReclassificados';
import DistorcaoIdadeSerie from '../shared/DistorcaoIdadeSerie/DistorcaoIdadeSerie';
import PainelFrequenciaDre from './componentes/PainelFrequenciaDre/painelFrequenciaDre';
import PlanoAEE from '../shared/PlanoAEE/PlanoAEE';

export default function InformacoesEducacionais({
  anoLetivo,
  dreCodigo,
  ueCodigo,
  modalidade,
  semestre,
  tipoVisualizacao,
  periodicidade,
}) {
  const exibirGrafico = !!dreCodigo;
  const exibirPainelFrequenciaDre = !!dreCodigo && String(dreCodigo) !== '-99';
  const exibirVisaoGeral = !!anoLetivo;
  const anoAtual = String(new Date().getFullYear());

  return (
    <>
      <CardEstilizado>
        <div className="col-md-12">
          {exibirVisaoGeral ? (
            <Row gutter={[32, 32]}>
              <Col span={24}>
                <VisaoGeral anoLetivo={anoLetivo} dreCodigo={dreCodigo} />
              </Col>
            </Row>
          ) : (
            <Row gutter={[32, 32]}>
              <Col span={24}>
                <p>Selecione um ano letivo para visualizar os dados.</p>
              </Col>
            </Row>
          )}
        </div>
      </CardEstilizado>
      {exibirPainelFrequenciaDre && anoLetivo === anoAtual && (
        <CardEstilizado>
          <div className="col-md-12">
            <Row gutter={[32, 32]}>
              <Col span={24}>
                <PainelFrequenciaDre
                  anoLetivo={anoLetivo}
                  dreCodigo={dreCodigo}
                />
              </Col>
            </Row>
          </div>
        </CardEstilizado>
      )}

      <CardEstilizado>
        <div className="col-md-12">
          <Row gutter={[32, 32]}>
            <Col span={24}>
              <TituloCard>Análise detalhada</TituloCard>
            </Col>
          </Row>

          <Row gutter={[32, 32]}>
            <Col span={24}>
              <GraficoIdep
                key={`idep-${String(anoLetivo)}-${String(dreCodigo)}`}
                anoLetivo={anoLetivo}
                dreId={dreCodigo}
              />
            </Col>
          </Row>
          <Row gutter={[32, 32]}>
            <Col span={24}>
              <GraficoIdeb
                key={`ideb-${String(anoLetivo)}-${String(dreCodigo)}`}
                anoLetivo={anoLetivo}
                dreId={dreCodigo}
              />
            </Col>
          </Row>

          <Row gutter={[32, 32]}>
            <Col span={24}>
              {exibirGrafico ? (
                <>
                  <GraficoFrequenciaPorModalidade
                    dreId={dreCodigo}
                    periodicidade={periodicidade}
                    ueId={ueCodigo}
                    anoLetivo={anoLetivo}
                  />
                  <GraficoAnaliseDeFrequencia
                    dreId={dreCodigo}
                    periodicidade={periodicidade}
                    anoLetivo={anoLetivo}
                    ueId={ueCodigo}
                  />
                </>
              ) : (
                <div className="text-center mt-5">
                  <p>Selecione os filtros acima para visualizar os dados</p>
                </div>
              )}
            </Col>
          </Row>

          <Row gutter={[32, 32]}>
            <Col span={24}>
              <GraficoAnaliseDeAlfabetizacao dreId={dreCodigo} />
            </Col>
          </Row>

          <Row gutter={[32, 32]}>
            <Col span={24}>
              <TabelaIndicadoresNivelCriticoAlfabetizacao
                key={dreCodigo}
                codigoDre={dreCodigo}
                codigoUe={ueCodigo}
                anoLetivo={anoLetivo}
              />
            </Col>
          </Row>

          <Row gutter={[32, 32]}>
            <Col span={24}>
              <TabelaIndicadoresPap
                key={dreCodigo}
                anoLetivo={anoLetivo}
                codigoDre={dreCodigo}
                codigoUe={ueCodigo}
              />
            </Col>
          </Row>

          <Row gutter={[32, 32]}>
            <Col span={24}>
              <GraficoFluenciaLeitora
                dreId={dreCodigo}
                ueId={ueCodigo}
                anoLetivo={anoLetivo}
              />
            </Col>
          </Row>

          <Row gutter={[32, 32]}>
            <Col span={24}>
              <TabelaAbandonoSmeDre
                codigoDre={dreCodigo}
                codigoUe={ueCodigo}
                anoLetivo={anoLetivo}
              />
            </Col>
          </Row>

          <Row gutter={[32, 32]}>
            <Col span={24}>
              <TabelaNotasSmeDre
                codigoDre={dreCodigo}
                codigoUe={ueCodigo}
                anoLetivo={anoLetivo}
              />
            </Col>
          </Row>

          <Row gutter={[32, 32]}>
            <Col span={24}>
              <TabelaEstudantesReclassificados
                codigoDre={dreCodigo}
                codigoUe={ueCodigo}
                anoLetivo={anoLetivo}
              />
            </Col>
          </Row>

          <Row gutter={[32, 32]}>
            <Col span={24}>
              <DistorcaoIdadeSerie
                codigoDre={dreCodigo}
                codigoUe={ueCodigo}
                anoLetivo={anoLetivo}
              />
            </Col>
          </Row>

          <Row gutter={[32, 32]}>
            <Col span={24}>
              {String(anoLetivo) === String(new Date().getFullYear()) ? (
                <PlanoAEE
                  codigoDre={dreCodigo}
                  codigoUe={ueCodigo}
                  anoLetivo={anoLetivo}
                />
              ) : null}
            </Col>
          </Row>
        </div>
      </CardEstilizado>
    </>
  );
}

InformacoesEducacionais.propTypes = {
  anoLetivo: PropTypes.string,
  dreCodigo: PropTypes.string,
  ueCodigo: PropTypes.string,
  modalidade: PropTypes.string,
  semestre: PropTypes.string,
  tipoVisualizacao: PropTypes.string,
  periodicidade: PropTypes.string,
};

InformacoesEducacionais.defaultProps = {
  anoLetivo: null,
  dreCodigo: null,
  ueCodigo: null,
  modalidade: null,
  semestre: null,
  tipoVisualizacao: null,
  periodicidade: null,
};
