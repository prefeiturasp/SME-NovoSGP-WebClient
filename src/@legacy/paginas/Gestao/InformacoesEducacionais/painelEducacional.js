import { Col, Row } from 'antd';
import { Cabecalho } from '~/componentes-sgp';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import InformacoesEducacionaisFiltros from './VisaoSmeDre/componentes/Filtro/informacoesEducacionaisFiltros';
import { useNavigate } from 'react-router-dom';
import { Card } from '~/componentes';
import styled from 'styled-components';
import { useState } from 'react';
import { OPCAO_TODOS } from '~/constantes/constantes';

const CardEstilizado = styled(Card)`
  margin-top: 16px;
`;
const TituloCard = styled.h2`
  font-weight: bold;
  color: #333;
  margin-bottom: 0;
  font-size: 20px;
`;

export default function PainelEducacional() {
  const [anoLetivo, setAnoLetivo] = useState(null);
  const [dreCodigo, setDreCodigo] = useState(OPCAO_TODOS);
  const [ueCodigo, setUeCodigo] = useState(OPCAO_TODOS);
  const [modalidade, setModalidade] = useState(null);
  const [semestre, setSemestre] = useState(null);
  const [tipoVisualizacao, setTipoVisualizacao] = useState('global');
  const [periodicidade, setPeriodicidade] = useState('mensal');
  const aoClicarBotaoVoltar = () => {
    navigate('/');
  };

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
    </>
  );
}
