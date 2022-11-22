import PropTypes from 'prop-types';
import React from 'react';
import { CampoTexto } from '~/componentes';

const CampoDinamicoFrase = props => {
  const {
    questaoAtual,
    form,
    label,
    disabled,
    onChange,
    maxLength,
    type,
  } = props;

  return (
    <div className="col-md-12 mb-3">
      {label}
      <CampoTexto
        form={form}
        onChange={onChange}
        type={type || 'text'}
        id={String(questaoAtual?.id)}
        name={String(questaoAtual?.id)}
        maxLength={maxLength || 999999}
        desabilitado={disabled || questaoAtual.somenteLeitura}
      />
    </div>
  );
};

CampoDinamicoFrase.propTypes = {
  label: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  type: PropTypes.string,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  onChange: PropTypes.func,
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
};

CampoDinamicoFrase.defaultProps = {
  label: '',
  form: null,
  type: 'text',
  disabled: false,
  maxLength: 999999,
  onChange: () => {},
  questaoAtual: null,
};

export default CampoDinamicoFrase;
