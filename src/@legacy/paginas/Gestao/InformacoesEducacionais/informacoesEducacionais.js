import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import InformacoesEducacionaisFiltros from './componentes/informacoesEducacionaisFiltros';
import GraficoFrequenciaPorModalidade from './componentes/GraficoFrequenciaPorModalidade';
import { OPCAO_TODOS } from '~/constantes/constantes';

const InformacoesEducacionais = () => {
  const navigate = useNavigate();

  // Estados para armazenar valores dos filtros
  const [anoLetivo, setAnoLetivo] = useState(null);
  const [dre, setDre] = useState({ codigo: OPCAO_TODOS });
  const [ue, setUe] = useState({ codigo: OPCAO_TODOS });
  const [modalidade, setModalidade] = useState(null);
  const [semestre, setSemestre] = useState(null);
  const [tipoVisualizacao, setTipoVisualizacao] = useState('global');

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
          <InformacoesEducacionaisFiltros
            // setAnoLetivoSelecionado={setAnoLetivo}
            setDreSelecionada={setDre}
            // setUeSelecionada={setUe}
            // setModalidadeSelecionada={setModalidade}
            // setSemestreSelecionado={setSemestre}
            // setTipoVisualizacaoSelecionado={setTipoVisualizacao}
          />
          
          {exibirGrafico ? (
            <GraficoFrequenciaPorModalidade 
              anoLetivo={anoLetivo}
              dreId={dre?.codigo}
              ueId={ue?.codigo}
              modalidade={modalidade}
              semestre={semestre}
              tipoVisualizacao={tipoVisualizacao}
            />
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
