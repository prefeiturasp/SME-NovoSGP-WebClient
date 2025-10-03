import { Col, Row } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cabecalho } from '~/componentes-sgp';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { OPCAO_TODOS } from '~/constantes/constantes';
import InformacoesEducacionaisFiltros from './VisaoSmeDre/componentes/Filtro/informacoesEducacionaisFiltros';
import InformacoesEducacionais from './VisaoSmeDre/informacoesEducacionais';
import { CardEstilizado } from './styles';

export default function PainelEducacional() {
  const navigate = useNavigate();
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

      <InformacoesEducacionais
        anoLetivo={anoLetivo}
        dreCodigo={dreCodigo}
        ueCodigo={ueCodigo}
        modalidade={modalidade}
        semestre={semestre}
        tipoVisualizacao={tipoVisualizacao}
        periodicidade={periodicidade}
      />
    </>
  );
}
