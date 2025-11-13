import CardCollapse from '~/componentes/cardCollapse';
import { useCallback, useEffect, useState } from 'react';
import TabelaAprovacaoModalidadeUe from './TabelaAprovacaoModalidadeUe';

const modalidades = [
  { modalidadeId: 3, label: 'Educação de Jovens e Adultos' },
  { modalidadeId: 5, label: 'Ensino Fundamental' },
  { modalidadeId: 6, label: 'Ensino Médio' },
];

function TabelasAprovacaoUe({ dreCodigo, ueCodigo, anoLetivo }) {
  const configCabecalho = {
    altura: '44px',
    corBorda: '#245ec6',
  };
  const [collapseAberto, setCollapseAberto] = useState(false);

  return (
    <CardCollapse
      titulo="Aprovação"
      configCabecalho={configCabecalho}
      show={collapseAberto}
      onClick={() => setCollapseAberto(!collapseAberto)}
      key={`aprovacao-ue-collapse-key`}
      indice={`aprovacao-ue-collapse-indice`}
    >
      <div className="line-title">
        <p className="tabela-aprovacao-custom-desc">
          É a quantidade de estudantes do ensino fundamental e médio,
          cadastrados no EOL, que foram aprovados no ano anterior.
        </p>
      </div>
      {modalidades.map(({ modalidadeId, label }) => (
        <div key={modalidadeId} style={{ marginBottom: 24 }}>
          <TabelaAprovacaoModalidadeUe
            dreCodigo={dreCodigo}
            ueCodigo={ueCodigo}
            anoLetivo={anoLetivo}
            modalidadeId={modalidadeId}
          />
        </div>
      ))}
    </CardCollapse>
  );
}

export default TabelasAprovacaoUe;
