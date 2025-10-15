import { Col, Row, Spin } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cabecalho } from '~/componentes-sgp';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { OPCAO_TODOS } from '~/constantes/constantes';
import InformacoesEducacionaisFiltros from './VisaoSmeDre/componentes/Filtro/informacoesEducacionaisFiltros';
import InformacoesEducacionais from './VisaoSmeDre/informacoesEducacionais';
import { CardEstilizado } from './shared/styles';
import DetalhesUnidadeEducacional from './VisaoUe/detalhesUnidadeEducacional';

export default function PainelEducacional() {
  const navigate = useNavigate();
  const [anoLetivo, setAnoLetivo] = useState(null);
  const [dreCodigo, setDreCodigo] = useState(OPCAO_TODOS);
  const [dreNome, setDreNome] = useState('');
  const [ueCodigo, setUeCodigo] = useState(OPCAO_TODOS);
  const [ueNome, setUeNome] = useState('');
  const [modalidade, setModalidade] = useState(null);
  const [semestre, setSemestre] = useState(null);
  const [tipoVisualizacao, setTipoVisualizacao] = useState('global');
  const [periodicidade, setPeriodicidade] = useState('mensal');
  const [carregandoFiltro, setCarregandoFiltro] = useState(true);

  const aoClicarBotaoVoltar = () => {
    navigate('/');
  };

  const obterDreSelecionada = valor => {
    const codigo = valor && typeof valor === 'object' ? valor.codigo : valor;
    if (codigo !== dreCodigo) {
      setDreCodigo(codigo);
      setDreNome(valor.desc);
    }
  };

  const obterUeSelecionada = valor => {
    const codigo = valor && typeof valor === 'object' ? valor.codigo : valor;
    if (codigo !== ueCodigo) {
      setUeCodigo(codigo);
      setUeNome(valor.desc);
    }
  };

  const obterAnoLetivoSelecionado = valor => {
    const normalizado = valor ? String(valor) : null;
    if (normalizado !== anoLetivo) {
      setAnoLetivo(normalizado);
    }
  };

  const title =
    ueCodigo !== OPCAO_TODOS
      ? 'Detalhes da Unidade Educacional'
      : 'Painel de Informações Educacionais';

  return (
    <>
      <Cabecalho pagina={title} style={{ marginBottom: '16px' }}>
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
                onCarregamentoConcluido={() => setCarregandoFiltro(false)}
              />
            </Col>
          </Row>
        </div>
      </CardEstilizado>

      {carregandoFiltro ? (
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <Spin tip="Carregando filtros..." size="large" />
        </div>
      ) : ueCodigo === OPCAO_TODOS ? (
        <InformacoesEducacionais
          anoLetivo={anoLetivo}
          dreCodigo={dreCodigo}
          ueCodigo={ueCodigo}
          modalidade={modalidade}
          semestre={semestre}
          tipoVisualizacao={tipoVisualizacao}
          periodicidade={periodicidade}
        />
      ) : (
        <DetalhesUnidadeEducacional
          dreCodigo={dreCodigo}
          ueCodigo={ueCodigo}
          anoLetivo={anoLetivo}
          dreNome={dreNome}
          ueNome={ueNome}
        />
      )}
    </>
  );
}
