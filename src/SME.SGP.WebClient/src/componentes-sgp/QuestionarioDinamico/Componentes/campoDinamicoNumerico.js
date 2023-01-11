import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { CampoTexto } from '~/componentes';
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
        <CampoTexto
          id={id}
          form={form}
          onChange={onChange}
          desabilitado={disabled || questaoAtual?.somenteLeitura}
          name={String(questaoAtual?.id)}
          placeholder={questaoAtual?.placeHolder}
          maxLength={questaoAtual?.tamanho || 9999999}
          somenteNumero
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
