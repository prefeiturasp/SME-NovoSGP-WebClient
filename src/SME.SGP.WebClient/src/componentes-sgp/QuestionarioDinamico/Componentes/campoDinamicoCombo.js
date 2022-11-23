import PropTypes from 'prop-types';
import React from 'react';
import SelectComponent from '~/componentes/select';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';

const CampoDinamicoCombo = props => {
  const { questaoAtual, form, label, desabilitado, onChange } = props;

  const lista = questaoAtual?.opcaoResposta.map(item => {
    return { label: item.nome, value: item.id };
  });

  return (
    <ColunaDimensionavel dimensao={6}>
      {label}
      <SelectComponent
        id={String(questaoAtual.id)}
        name={String(questaoAtual.id)}
        form={form}
        lista={lista}
        valueOption="value"
        valueText="label"
        disabled={desabilitado || questaoAtual.somenteLeitura}
        onChange={valorAtualSelecionado => {
          onChange(valorAtualSelecionado);
        }}
      />
    </ColunaDimensionavel>
  );
};

CampoDinamicoCombo.propTypes = {
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  label: PropTypes.oneOfType([PropTypes.any]),
  desabilitado: PropTypes.bool,
  onChange: PropTypes.oneOfType([PropTypes.any]),
};

CampoDinamicoCombo.defaultProps = {
  questaoAtual: null,
  form: null,
  label: '',
  desabilitado: false,
  onChange: () => {},
};

export default CampoDinamicoCombo;
