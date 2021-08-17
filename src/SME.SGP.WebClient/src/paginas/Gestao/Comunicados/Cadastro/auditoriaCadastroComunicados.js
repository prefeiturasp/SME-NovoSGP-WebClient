import PropTypes from 'prop-types';
import React from 'react';
import { Auditoria } from '~/componentes';

const AuditoriaCadastroComunicados = ({ form }) => {
  const {
    criadoEm,
    criadoPor,
    criadoRF,
    alteradoPor,
    alteradoEm,
    alteradoRF,
  } = form?.values;

  return (
    <>
      {criadoEm && (
        <Auditoria
          ignorarMarginTop
          criadoEm={criadoEm}
          criadoPor={criadoPor}
          criadoRf={criadoRF}
          alteradoPor={alteradoPor}
          alteradoEm={alteradoEm}
          alteradoRf={alteradoRF}
        />
      )}
    </>
  );
};

AuditoriaCadastroComunicados.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
};

AuditoriaCadastroComunicados.defaultProps = {
  form: null,
};

export default AuditoriaCadastroComunicados;
