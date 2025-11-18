import React, { useContext } from 'react';
import QuantidadeEncaminhamentosNAAPA from './QuantidadeEncaminhamentosNAAPA/quantidadeEncaminhamentosNAAPA';
import QuantidadeEncaminhamentosNAAPASituacao from './QuantidadeEncaminhamentosNAAPASituacao/quantidadeEncaminhamentosNAAPASituacao';
import QtdAtendimentosEncaminhamentosProfissional from './QtdAtendimentosEncaminhamentosProfissional/qtdAtendimentosEncaminhamentosProfissional';
import NAAPAContext from '../naapaContext';
import { OPCAO_TODOS } from '@/@legacy/constantes';

const GraficosEncaminhamento = () => {
  const { dre } = useContext(NAAPAContext);

  const ehTodosDre = OPCAO_TODOS === dre?.codigo;

  if (ehTodosDre) return <QuantidadeEncaminhamentosNAAPA />;

  return (
    <>
      <QuantidadeEncaminhamentosNAAPASituacao />
      <QtdAtendimentosEncaminhamentosProfissional />
    </>
  );
};

export default GraficosEncaminhamento;
