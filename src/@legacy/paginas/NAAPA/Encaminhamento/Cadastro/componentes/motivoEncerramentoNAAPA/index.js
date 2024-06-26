import React from 'react';
import { useSelector } from 'react-redux';
import situacaoNAAPA from '~/dtos/situacaoNAAPA';
import {
  BodyJustificativaEncerramentoNAAPA,
  HeaderJustificativaEncerramentoNAAPA,
  JustificativaEncerramentoNAAPA,
} from './styled';

const MotivoEncerramentoNAAPA = () => {
  const dadosEncaminhamentoNAAPA = useSelector(
    state => state.encaminhamentoNAAPA.dadosEncaminhamentoNAAPA
  );

  const dadosSituacao = useSelector(
    state => state.encaminhamentoNAAPA.dadosSituacaoEncaminhamentoNAAPA
  );

  const exibir =
    dadosSituacao?.situacao === situacaoNAAPA.Encerrado &&
    dadosEncaminhamentoNAAPA?.motivoEncerramento;

  return exibir ? (
    <JustificativaEncerramentoNAAPA>
      <HeaderJustificativaEncerramentoNAAPA>
        Justificativa do encerramento
      </HeaderJustificativaEncerramentoNAAPA>
      <BodyJustificativaEncerramentoNAAPA>
        {dadosEncaminhamentoNAAPA.motivoEncerramento}
      </BodyJustificativaEncerramentoNAAPA>
    </JustificativaEncerramentoNAAPA>
  ) : (
    <></>
  );
};

export default MotivoEncerramentoNAAPA;
