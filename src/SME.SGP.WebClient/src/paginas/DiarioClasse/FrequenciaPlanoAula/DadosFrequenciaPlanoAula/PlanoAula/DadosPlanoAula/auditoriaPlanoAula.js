import React from 'react';
import { useSelector } from 'react-redux';
import { Auditoria } from '~/componentes';

const AuditoriaPlanoAula = () => {
  const auditoria = useSelector(
    state => state.frequenciaPlanoAula.dadosPlanoAula?.auditoria
  );

  return (
    <div className="row">
      <Auditoria
        className="mt-2"
        criadoEm={auditoria?.criadoEm}
        criadoPor={auditoria?.criadoPor}
        alteradoPor={auditoria?.alteradoPor}
        alteradoEm={auditoria?.alteradoEm}
        alteradoRf={auditoria?.alteradoRF}
        criadoRf={auditoria?.criadoRF}
      />
    </div>
  );
};

export default AuditoriaPlanoAula;
