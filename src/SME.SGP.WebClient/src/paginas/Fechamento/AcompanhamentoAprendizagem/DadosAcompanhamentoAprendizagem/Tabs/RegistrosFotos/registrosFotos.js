import React from 'react';
import { useSelector } from 'react-redux';
import AuditoriaAcompanhamentoAprendizagem from '../../AuditoriaAcompanhamento/auditoriaAcompanhamento';
import ObservacoesAdicionais from './ObservacoesAdicionais/observacoesAdicionais';
import PercursoIndividual from './PercursoIndividual/percursoIndividual';

const RegistrosFotos = () => {
  const dadosAcompanhamentoAprendizagem = useSelector(
    store => store.acompanhamentoAprendizagem.dadosAcompanhamentoAprendizagem
  );

  return dadosAcompanhamentoAprendizagem ? (
    <>
      <PercursoIndividual />
      <ObservacoesAdicionais />
      <AuditoriaAcompanhamentoAprendizagem />
    </>
  ) : (
    ''
  );
};

export default RegistrosFotos;
