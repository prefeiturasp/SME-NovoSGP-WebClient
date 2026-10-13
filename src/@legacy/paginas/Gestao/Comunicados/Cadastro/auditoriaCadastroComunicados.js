import PropTypes from 'prop-types';
import React from 'react';
import { Auditoria } from '~/componentes';

import comDefaultProps from '~/utils/comDefaultProps';
const AuditoriaCadastroComunicados = ({ form }) => {
  const { criadoEm, criadoPor, criadoRF, alteradoPor, alteradoEm, alteradoRF } =
    form?.values;

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

export default comDefaultProps(AuditoriaCadastroComunicados, AuditoriaCadastroComunicados.defaultProps);