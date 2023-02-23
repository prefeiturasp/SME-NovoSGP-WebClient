import PropTypes from 'prop-types';
import React from 'react';
import { CampoTexto } from '~/componentes';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';
import QuestionarioDinamicoFuncoes from '../Funcoes/QuestionarioDinamicoFuncoes';

const CampoDinamicoFrase = props => {
  const { questaoAtual, form, label, disabled, onChange, prefixId } = props;

  const id = QuestionarioDinamicoFuncoes.gerarId(prefixId, questaoAtual);

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      {label}
      <CampoTexto
        id={id}
        form={form}
        onChange={onChange}
        name={String(questaoAtual?.id)}
        maxLength={questaoAtual?.tamanho}
        placeholder={questaoAtual?.placeHolder}
        desabilitado={disabled || questaoAtual.somenteLeitura}
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
