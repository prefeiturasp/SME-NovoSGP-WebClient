import { Col, Row } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { OPCAO_TODOS } from '~/constantes/constantes';
import InformacoesEducacionaisFiltros from './componentes/Filtro/informacoesEducacionaisFiltros';
import GraficoAnaliseDeFrequencia from './componentes/GraficoAnaliseDeFrequencia';
import GraficoFrequenciaPorModalidade from './componentes/GraficoFrequenciaPorModalidade';
import TabelaIndicadoresNivelCriticoAlfabetizacao from './componentes/TabelaIndicadoresNivelCriticoAlfabetizacao/tabelaIndicadoresNivelCriticoAlfabetizacao';
import GraficoAnaliseDeAlfabetizacao from './componentes/GraficoAnaliseDeAlfabetizacao/graficoAnaliseDeAlfabetizacao';
import GraficoIdep from './componentes/GraficoIdep/graficoIdep';
import GraficoIdeb from './componentes/GraficoIdeb/graficoIdeb';
import VisaoGeral from './componentes/VisaoGeral';
import TabelaIndicadoresPap from './componentes/TabelaIndicadoresPap/tabelaIndicadoresPap';
import styled from 'styled-components';
import GraficoFluenciaLeitora from './componentes/GraficoFluenciaLeitora/graficoFluenciaLeitora';

const CardEstilizado = styled(Card)`
  margin-top: 16px;
`;
const TituloCard = styled.h2`
  font-weight: bold;
  color: #333;
  margin-bottom: 0;
  font-size: 20px;
`;

const InformacoesEducacionais = () => {
  const navigate = useNavigate();
  const [anoLetivo, setAnoLetivo] = useState(null);
  const [dreCodigo, setDreCodigo] = useState(OPCAO_TODOS);
  const [ueCodigo, setUeCodigo] = useState(OPCAO_TODOS);
  const [modalidade, setModalidade] = useState(null);
  const [semestre, setSemestre] = useState(null);
  const [tipoVisualizacao, setTipoVisualizacao] = useState('global');
  const [periodicidade, setPeriodicidade] = useState('mensal');

  const obterDreSelecionada = valor => {
    const codigo = valor && typeof valor === 'object' ? valor.codigo : valor;
    if (codigo !== dreCodigo) {
      setDreCodigo(codigo);
    }
  };

  const obterUeSelecionada = valor => {
    const codigo = valor && typeof valor === 'object' ? valor.codigo : valor;
    if (codigo !== ueCodigo) {
      setUeCodigo(codigo);
    }
  };

  const obterAnoLetivoSelecionado = valor => {
    const normalizado = valor ? String(valor) : null;
    if (normalizado !== anoLetivo) {
      setAnoLetivo(normalizado);
    }
  };

  const aoClicarBotaoVoltar = () => {
    navigate('/');
  };

  const exibirVisaoGeral = anoLetivo !== null && anoLetivo !== '';
  const exibirGrafico = !!dreCodigo && anoLetivo !== null && anoLetivo !== '';

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
