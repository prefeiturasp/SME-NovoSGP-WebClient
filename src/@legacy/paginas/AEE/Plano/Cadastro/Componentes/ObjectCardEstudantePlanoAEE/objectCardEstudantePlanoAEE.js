import React from 'react';
import { useSelector } from 'react-redux';
import ObjectCardEstudante from '~/componentes-sgp/ObjectCardEstudante/objectCardEstudante';

const ObjectCardEstudantePlanoAEE = () => {
  const dadosCollapseLocalizarEstudante = useSelector(
    store => store.collapseLocalizarEstudante.dadosCollapseLocalizarEstudante
  );

  const desabilitarCamposPlanoAEE = useSelector(
    store => store.planoAEE.desabilitarCamposPlanoAEE
  );

  return dadosCollapseLocalizarEstudante?.codigoAluno ? (
    <ObjectCardEstudante
      codigoAluno={dadosCollapseLocalizarEstudante?.codigoAluno}
      anoLetivo={dadosCollapseLocalizarEstudante?.anoLetivo}
      codigoTurma={dadosCollapseLocalizarEstudante?.codigoTurma}
      exibirBotaoImprimir={false}
      consultarFrequenciaGlobal
      permiteAlterarImagem={!desabilitarCamposPlanoAEE}
    />
  ) : (
    ''
  );
};

export default ObjectCardEstudantePlanoAEE;
