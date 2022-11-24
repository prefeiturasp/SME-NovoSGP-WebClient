import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { CampoNumero } from '~/componentes';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';
import QuestionarioDinamicoFuncoes from '../Funcoes/QuestionarioDinamicoFuncoes';

const CampoDinamicoNumericoContainer = styled.div`
  .ant-input-number {
    width: 100% !important;
  }
`;

const CampoDinamicoNumerico = props => {
  const { questaoAtual, form, label, disabled, onChange, prefixId } = props;

  const id = QuestionarioDinamicoFuncoes.gerarId(prefixId, questaoAtual);

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      <CampoDinamicoNumericoContainer>
        {label}
        <CampoNumero
          id={id}
          form={form}
          esconderSetas
          onChange={onChange}
          desabilitado={disabled}
          name={String(questaoAtual?.id)}
          placeholder={questaoAtual?.placeHolder}
          maxlength={questaoAtual?.tamanho || 9999999}
        />
      </CampoDinamicoNumericoContainer>
    </ColunaDimensionavel>
  );
};

CampoDinamicoNumerico.propTypes = {
  label: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  prefixId: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
};

CampoDinamicoNumerico.defaultProps = {
  label: '',
  form: null,
  prefixId: '',
  disabled: false,
  onChange: () => {},
  questaoAtual: null,
};

export default CampoDinamicoNumerico;
