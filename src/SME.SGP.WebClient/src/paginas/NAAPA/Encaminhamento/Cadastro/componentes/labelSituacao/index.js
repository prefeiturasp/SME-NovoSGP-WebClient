import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Base } from '~/componentes';
import { SGP_LABEL_SITUACAO_ENCAMINHAMENTO_NAAPA } from '~/constantes/ids/label';

export const LabelContainer = styled.div`
  padding: 4px;
  font-size: 12px;
  border-radius: 4px;
  color: ${Base.Branco};
  background-color: ${Base.Roxo};
`;

const LabelSituacao = () => {
  const dadosSituacao = useSelector(
    state => state.encaminhamentoNAAPA.dadosSituacaoEncaminhamentoNAAPA
  );

  return dadosSituacao?.descricaoSituacao ? (
    <LabelContainer id={SGP_LABEL_SITUACAO_ENCAMINHAMENTO_NAAPA}>
      {dadosSituacao?.descricaoSituacao}
    </LabelContainer>
  ) : (
    <></>
  );
};

export default LabelSituacao;
