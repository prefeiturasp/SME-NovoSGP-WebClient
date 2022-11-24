import PropTypes from 'prop-types';
import React from 'react';
import { CampoTexto } from '~/componentes';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';

const CampoDinamicoFrase = props => {
  const { questaoAtual, form, label, disabled, onChange, prefixId } = props;

  const id = prefixId
    ? `${prefixId}_ORDEM_${questaoAtual?.ordem}`
    : questaoAtual?.id;

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      {label}
      <CampoTexto
        id={id}
        form={form}
        onChange={onChange}
        name={String(questaoAtual?.id)}
        desabilitado={disabled || questaoAtual.somenteLeitura}
        placeholder={questaoAtual?.placeHolder}
      />
    </ColunaDimensionavel>
  );
};

CampoDinamicoFrase.propTypes = {
  label: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  prefixId: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
};

CampoDinamicoFrase.defaultProps = {
  label: '',
  form: null,
  prefixId: '',
  disabled: false,
  onChange: () => {},
  questaoAtual: null,
};

export default CampoDinamicoFrase;
