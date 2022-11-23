import PropTypes from 'prop-types';
import React from 'react';
import { CampoTexto } from '~/componentes';

const CampoDinamicoFrase = props => {
  const { questaoAtual, form, label, disabled, onChange, maxLength } = props;

  return (
    <div className="col-md-12 mb-3">
      {label}
      <CampoTexto
        form={form}
        onChange={onChange}
        maxLength={maxLength}
        id={String(questaoAtual?.id)}
        name={String(questaoAtual?.id)}
        desabilitado={disabled || questaoAtual.somenteLeitura}
      />
    </div>
  );
};

CampoDinamicoFrase.propTypes = {
  label: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  onChange: PropTypes.func,
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
};

CampoDinamicoFrase.defaultProps = {
  label: '',
  form: null,
  disabled: false,
  maxLength: 999999,
  onChange: () => {},
  questaoAtual: null,
};

export default CampoDinamicoFrase;
