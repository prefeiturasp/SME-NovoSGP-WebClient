import { useSelector } from 'react-redux';
import DetalhesAluno from '~/componentes/Alunos/Detalhes';

const ObjectCardRelatorioPAP = () => {
  const estudanteSelecionadoRelatorioPAP = useSelector(
    store => store.relatorioPAP?.estudanteSelecionadoRelatorioPAP
  );

  // TODO
  const relatorioPAPAlunoId = 0;

  const desabilitarCamposRelatorioPAP = useSelector(
    store => store.relatorioPAP.desabilitarCamposRelatorioPAP
  );

  const gerar = () => {};

  return (
    <DetalhesAluno
      dados={estudanteSelecionadoRelatorioPAP}
      desabilitarImprimir={!relatorioPAPAlunoId}
      onClickImprimir={gerar}
      permiteAlterarImagem={!desabilitarCamposRelatorioPAP}
    />
  );
};

export default ObjectCardRelatorioPAP;
