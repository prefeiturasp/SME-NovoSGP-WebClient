import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Base } from '~/componentes';

export const LabelContainer = styled.div`
  padding: 4px;
  font-size: 12px;
  border-radius: 4px;
  color: ${Base.Branco};
  background-color: ${Base.Roxo};
`;

const LabelSituacao = () => {
  const dadosEncaminhamentoNAAPA = useSelector(
    state => state.encaminhamentoNAAPA.dadosEncaminhamentoNAAPA
  );

  return dadosEncaminhamentoNAAPA?.descricaoSituacao ? (
    <LabelContainer>
      {dadosEncaminhamentoNAAPA?.descricaoSituacao}
    </LabelContainer>
  ) : (
    <></>
  );
};

export default LabelSituacao;
