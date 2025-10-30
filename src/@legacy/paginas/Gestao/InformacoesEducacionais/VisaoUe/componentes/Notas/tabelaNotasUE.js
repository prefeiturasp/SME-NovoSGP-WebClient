import CardCollapse from '~/componentes/cardCollapse';
import ServicoNotas from '~/servicos/InformacoesEducacionais/ServicoNotas';
import { useState, useEffect } from 'react';
import { Select } from 'antd';
import { Base } from '~/componentes';
import TabelaModalidadeNotas from './TabelaModalidadeNotas';
import './tabelaNotasUE.css';

const bimestres = [
  { value: 1, label: '1º bimestre' },
  { value: 2, label: '2º bimestre' },
  { value: 3, label: '3º bimestre' },
  { value: 4, label: '4º bimestre' },
];

function TabelaNotasUe({ dreCodigo, ueCodigo, anoLetivo }) {
  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [modalidades, setModalidades] = useState([]);
  const [bimestre, setBimestre] = useState(1);
  const [collapseAberto, setCollapseAberto] = useState(false);

  useEffect(() => {
    async function carregarModalidades() {
      const { data } = await ServicoNotas.ObterModalidadesUe(
        ueCodigo,
        anoLetivo,
        bimestre
      );
      setModalidades(data || []);
    }
    if (ueCodigo && anoLetivo && bimestre) {
      carregarModalidades();
    }
  }, [ueCodigo, anoLetivo, bimestre]);

  const keyBase = 'notas-ue-prof-coll';

  return (
    <CardCollapse
      titulo="Notas"
      configCabecalho={configCabecalho}
      show={collapseAberto}
      onClick={() => setCollapseAberto(!collapseAberto)}
      key={`${keyBase}-collapse-key`}
      indice={`${keyBase}-collapse-indice`}
    >
      <div className="line-title">
        <p className="tabela-notas-custom-desc">
          Mostra a classificação das notas acima e abaixo da média geral,
          considerando apenas os bimestres já fechados no ano atual, para os
          componentes de Língua Portuguesa, Matemática e Ciências, em todas as
          turmas do Ensino Fundamental e Médio.
        </p>
        <div style={{ marginBottom: 16 }}>
          <Select
            value={bimestre}
            onChange={setBimestre}
            style={{ width: 140 }}
          >
            {bimestres.map(b => (
              <Select.Option key={b.value} value={b.value}>
                {b.label}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      {modalidades.map(modalidade => (
        <TabelaModalidadeNotas
          key={modalidade.id}
          dreCodigo={dreCodigo}
          ueCodigo={ueCodigo}
          anoLetivo={anoLetivo}
          bimestre={bimestre}
          modalidade={modalidade}
        />
      ))}
    </CardCollapse>
  );
}

export default TabelaNotasUe;
