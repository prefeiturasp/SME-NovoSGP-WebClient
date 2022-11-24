import PropTypes from 'prop-types';
import React from 'react';
import SelectComponent from '~/componentes/select';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';

const CampoDinamicoCombo = props => {
  const { questaoAtual, form, label, desabilitado, onChange, prefixId } = props;

  const id = prefixId
    ? `${prefixId}_ORDEM_${questaoAtual?.ordem}`
    : questaoAtual?.id;

  const lista = questaoAtual?.opcaoResposta.map(item => {
    return { label: item.nome, value: item.id };
  });

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      {label}
      <SelectComponent
        id={id}
        form={form}
        lista={lista}
        valueText="label"
        valueOption="value"
        name={String(questaoAtual.id)}
        placeholder={questaoAtual?.placeHolder}
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
  prefixId: PropTypes.string,
  desabilitado: PropTypes.bool,
  onChange: PropTypes.oneOfType([PropTypes.any]),
};

CampoDinamicoCombo.defaultProps = {
  questaoAtual: null,
  form: null,
  label: '',
  prefixId: '',
  desabilitado: false,
  onChange: () => {},
};

export default CampoDinamicoCombo;
