import React from 'react';
import { useSelector } from 'react-redux';
import { Auditoria } from '~/componentes';

const AuditoriaPlanoAula = () => {
  const auditoria = useSelector(
    state => state.frequenciaPlanoAula.dadosPlanoAula?.auditoria
  );

  return <Auditoria className="mt-2" {...auditoria} />;
};

export default AuditoriaPlanoAula;
