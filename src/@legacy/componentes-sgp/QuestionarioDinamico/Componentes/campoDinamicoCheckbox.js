import PropTypes from 'prop-types';
import React from 'react';
import CheckboxGroup from '~/componentes/checkboxGroup';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';
import QuestionarioDinamicoFuncoes from '../Funcoes/QuestionarioDinamicoFuncoes';

const CampoDinamicoCheckbox = props => {
  const { questaoAtual, form, label, desabilitado, onChange, prefixId } = props;

  const id = QuestionarioDinamicoFuncoes.gerarId(prefixId, questaoAtual);

  const options = questaoAtual?.opcaoResposta.map(item => {
    return { label: item.nome, value: item.id };
  });

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      {label}
      <CheckboxGroup
        id={id}
        form={form}
        options={options}
        onChange={onChange}
        name={String(questaoAtual?.id)}
        disabled={desabilitado || questaoAtual?.somenteLeitura}
      />
    </ColunaDimensionavel>
  );
};

CampoDinamicoCheckbox.propTypes = {
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  label: PropTypes.oneOfType([PropTypes.any]),
  prefixId: PropTypes.string,
  desabilitado: PropTypes.bool,
  onChange: PropTypes.func,
};

CampoDinamicoCheckbox.defaultProps = {
  questaoAtual: null,
  form: null,
  label: '',
  prefixId: '',
  desabilitado: false,
  onChange: () => {},
};

export default CampoDinamicoCheckbox;
