import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, SelectComponent } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import InformacoesEducacionaisFiltros from './componentes/Filtro/informacoesEducacionaisFiltros';
import GraficoFrequenciaPorModalidade from './componentes/GraficoFrequenciaPorModalidade';
import GraficoAnaliseDeFrequencia from './componentes/GraficoAnaliseDeFrequencia';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { Col, Row } from 'antd';

const InformacoesEducacionais = () => {
  const navigate = useNavigate();

  // Estados para armazenar valores dos filtros
  const [anoLetivo, setAnoLetivo] = useState(null);
  const [dre, setDre] = useState({ codigo: OPCAO_TODOS });
  const [ue, setUe] = useState({ codigo: OPCAO_TODOS });
  const [modalidade, setModalidade] = useState(null);
  const [semestre, setSemestre] = useState(null);
  const [tipoVisualizacao, setTipoVisualizacao] = useState('global');
  
  // Estado para periodicidade (Mensal ou Anual)
  const [periodicidade, setPeriodicidade] = useState('mensal');
  const listaPeriodicidade = [
    { valor: 'mensal', desc: 'Mensal (ano atual)' },
    { valor: 'anual', desc: 'Anual' }
  ];

  const aoClicarBotaoVoltar = () => {
    navigate('/');
  };

  // Lógica para verificar se deve exibir o gráfico
  const exibirGrafico = !!dre?.codigo;

  return (
    <>
      <Cabecalho pagina="Informações Educacionais">
        <BotaoVoltarPadrao onClick={aoClicarBotaoVoltar} />
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={18}>
              <InformacoesEducacionaisFiltros
                setDreSelecionada={setDre}
                // setTipoVisualizacaoSelecionado={setTipoVisualizacao}
              />
            </Col>
            <Col xs={24} md={6}>
              <SelectComponent
                label=""
                lista={listaPeriodicidade}
                valueOption="valor"
                valueText="desc"
                onChange={valor => setPeriodicidade(valor)}
                valueSelect={periodicidade}
                placeholder="Selecione a periodicidade"
              />
            </Col>
          </Row>
          
          {exibirGrafico ? (
            <>
              <GraficoFrequenciaPorModalidade 
                anoLetivo={anoLetivo}
                dreId={dre?.codigo}
                ueId={ue?.codigo}
                modalidade={modalidade}
                semestre={semestre}
                tipoVisualizacao={tipoVisualizacao}
                periodicidade={periodicidade}
              />
              <GraficoAnaliseDeFrequencia
                dreId={dre?.codigo}
                periodicidade={periodicidade}
              />
            </>
          ) : (
            <div className="text-center mt-5">
              <p>Selecione os filtros acima para visualizar os dados</p>
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

export default InformacoesEducacionais;
