import PropTypes from 'prop-types';
import React from 'react';
import { CampoData } from '~/componentes';

const CampoDinamicoData = props => {
  const { questaoAtual, form, label, disabled, onChange } = props;

  return (
    <div className="col-md-12 mb-3">
      {label}
      <CampoData
        form={form}
        onChange={onChange}
        desabilitado={disabled}
        placeholder="DD/MM/AAAA"
        formatoData="DD/MM/YYYY"
        id={String(questaoAtual?.id)}
        name={String(questaoAtual?.id)}
      />
    </div>
  );
};

CampoDinamicoData.propTypes = {
  label: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
};

CampoDinamicoData.defaultProps = {
  label: '',
  form: null,
  disabled: false,
  onChange: () => {},
  questaoAtual: null,
};

export default CampoDinamicoData;
