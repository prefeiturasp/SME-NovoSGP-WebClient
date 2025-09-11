import { Col, Row } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, SelectComponent } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { OPCAO_TODOS } from '~/constantes/constantes';
import InformacoesEducacionaisFiltros from './componentes/Filtro/informacoesEducacionaisFiltros';
import GraficoAnaliseDeFrequencia from './componentes/GraficoAnaliseDeFrequencia';
import GraficoFrequenciaPorModalidade from './componentes/GraficoFrequenciaPorModalidade';
import TabelaIndicadoresNivelCriticoAlfabetizacao from './componentes/TabelaIndicadoresNivelCriticoAlfabetizacao/tabelaIndicadoresNivelCriticoAlfabetizacao';
import GraficoAnaliseDeAlfabetizacao from './componentes/GraficoAnaliseDeAlfabetizacao/graficoAnaliseDeAlfabetizacao';
import GraficoIdep from './componentes/GraficoIdep/graficoIdep';
import VisaoGeral from './componentes/VisaoGeral';

const InformacoesEducacionais = () => {
  const navigate = useNavigate();
  const [anoLetivo, setAnoLetivo] = useState(2025);
  const [dreCodigo, setDreCodigo] = useState(OPCAO_TODOS);
  const [ue, setUe] = useState({ codigo: OPCAO_TODOS });
  const [modalidade, setModalidade] = useState(null);
  const [semestre, setSemestre] = useState(null);
  const [tipoVisualizacao, setTipoVisualizacao] = useState('global');
  const [periodicidade, setPeriodicidade] = useState('mensal');
  const listaPeriodicidade = [
    { valor: 'mensal', desc: 'Mensal (ano atual)' },
    { valor: 'anual', desc: 'Anual' },
  ];

  const obterDreSelecionada = valor => {
    const codigo = valor && typeof valor === 'object' ? valor.codigo : valor;
    if (codigo !== dreCodigo) {
      setDreCodigo(codigo);
    }
  };

  const aoClicarBotaoVoltar = () => {
    navigate('/');
  };

  const exibirGrafico = !!dreCodigo;
  const exibirVisaoGeral = !!anoLetivo;

  return (
    <>
      <Cabecalho pagina="Informações Educacionais">
        <BotaoVoltarPadrao onClick={aoClicarBotaoVoltar} />
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={24}>
              <InformacoesEducacionaisFiltros
                obterDreSelecionado={obterDreSelecionada}
              />
            </Col>
          </Row>

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

          <Row gutter={[32, 32]}>
            <Col span={24}>
              <GraficoIdep anoLetivo={anoLetivo} dreId={dreCodigo} />
            </Col>
          </Row>

          <Row gutter={[32, 32]}>
            <Col span={24}>
              {exibirGrafico ? (
                <>
                  <GraficoFrequenciaPorModalidade
                    dreId={dreCodigo}
                    periodicidade={periodicidade}
                  />
                  <GraficoAnaliseDeFrequencia
                    dreId={dreCodigo}
                    periodicidade={periodicidade}
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
                codigoDre={dreCodigo}
              />
            </Col>
          </Row>
        </div>
      </Card>
    </>
  );
};

export default InformacoesEducacionais;
