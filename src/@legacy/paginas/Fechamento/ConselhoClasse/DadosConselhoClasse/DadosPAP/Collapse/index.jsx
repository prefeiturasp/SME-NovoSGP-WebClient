import { useState } from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import { MontarQuestionarioPAPConselhoClasse } from '../Secoes';

export const CollapseDadosSecaoRelatorioPAPConselhoClasse = ({ bimestre, codigoAluno }) => {
  const [exibir, setExibir] = useState(false);

  return (
    <div className="col-sm-12 mb-2">
      <CardCollapse
        titulo="Relatório de PAP"
        configCabecalho={{
          altura: '50px',
          corBorda: Base.AzulBordaCard,
        }}
        onClick={() => setExibir(!exibir)}
        show={exibir}
      >
        {exibir ? (
          <MontarQuestionarioPAPConselhoClasse bimestre={bimestre} codigoAluno={codigoAluno} />
        ) : (
          <></>
        )}
      </CardCollapse>
    </div>
  );
};
