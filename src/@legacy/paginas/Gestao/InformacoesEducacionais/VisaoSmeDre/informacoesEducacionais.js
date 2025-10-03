import { Col, Row } from 'antd';
import { Cabecalho } from '~/componentes-sgp';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import InformacoesEducacionaisFiltros from './componentes/Filtro/informacoesEducacionaisFiltros';
import GraficoAnaliseDeAlfabetizacao from './componentes/GraficoAnaliseDeAlfabetizacao/graficoAnaliseDeAlfabetizacao';
import GraficoAnaliseDeFrequencia from './componentes/GraficoAnaliseDeFrequencia';
import GraficoFluenciaLeitora from './componentes/GraficoFluenciaLeitora/graficoFluenciaLeitora';
import GraficoFrequenciaPorModalidade from './componentes/GraficoFrequenciaPorModalidade';
import GraficoIdeb from './componentes/GraficoIdeb/graficoIdeb';
import GraficoIdep from './componentes/GraficoIdep/graficoIdep';
import TabelaIndicadoresNivelCriticoAlfabetizacao from './componentes/TabelaIndicadoresNivelCriticoAlfabetizacao/tabelaIndicadoresNivelCriticoAlfabetizacao';
import TabelaIndicadoresPap from './componentes/TabelaIndicadoresPap/tabelaIndicadoresPap';
import VisaoGeral from './componentes/VisaoGeral';

const InformacoesEducacionais = () => {
  const exibirGrafico = !!dreCodigo;
  const exibirVisaoGeral = !!anoLetivo;

  return (
    <>
      <Cabecalho
        pagina="Painel de Informações Educacionais"
        style={{ marginBottom: '16px' }}
      >
        <BotaoVoltarPadrao onClick={aoClicarBotaoVoltar} />
      </Cabecalho>
      <CardEstilizado>
        <div className="col-md-12">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <InformacoesEducacionaisFiltros
                obterDreSelecionado={obterDreSelecionada}
                setAnoLetivo={obterAnoLetivoSelecionado}
                obterUeSelecionado={obterUeSelecionada}
                anoLetivo={anoLetivo}
              />
            </Col>
          </Row>
        </div>
      </CardEstilizado>

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
        </div>
      </CardEstilizado>
    </>
  );
};

export default InformacoesEducacionais;
