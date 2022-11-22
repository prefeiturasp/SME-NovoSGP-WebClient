import PropTypes from 'prop-types';
import React from 'react';
import { CampoNumero } from '~/componentes';

const CampoDinamicoNumerico = props => {
  const { questaoAtual, form, label, disabled, onChange, placeholder } = props;

  return (
    <div className="col-md-12 mb-3">
      {label}
      <CampoNumero
        form={form}
        onChange={onChange}
        desabilitado={disabled}
        placeholder={placeholder}
        id={String(questaoAtual?.id)}
        name={String(questaoAtual?.id)}
      />
    </div>
  );
};

CampoDinamicoNumerico.propTypes = {
  label: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
};

CampoDinamicoNumerico.defaultProps = {
  label: '',
  form: null,
  disabled: false,
  placeholder: '',
  onChange: () => {},
  questaoAtual: null,
};

export default CampoDinamicoNumerico;
