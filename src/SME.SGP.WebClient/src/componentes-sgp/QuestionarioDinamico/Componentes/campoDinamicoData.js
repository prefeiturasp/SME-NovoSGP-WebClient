import PropTypes from 'prop-types';
import React from 'react';
import { CampoData } from '~/componentes';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';

const CampoDinamicoData = props => {
  const { questaoAtual, form, label, disabled, onChange, prefixId } = props;

  const id = prefixId
    ? `${prefixId}_ORDEM_${questaoAtual?.ordem}`
    : questaoAtual?.id;

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      {label}
      <CampoData
        id={id}
        form={form}
        onChange={onChange}
        desabilitado={disabled}
        formatoData="DD/MM/YYYY"
        name={String(questaoAtual?.id)}
        placeholder={questaoAtual?.placeHolder || 'DD/MM/AAAA'}
      />
    </ColunaDimensionavel>
  );
};

CampoDinamicoData.propTypes = {
  label: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  prefixId: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
};

CampoDinamicoData.defaultProps = {
  label: '',
  form: null,
  prefixId: '',
  disabled: false,
  onChange: () => {},
  questaoAtual: null,
};

export default CampoDinamicoData;
