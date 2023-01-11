import PropTypes from 'prop-types';
import React from 'react';
import { CampoTexto } from '~/componentes';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';
import QuestionarioDinamicoFuncoes from '../Funcoes/QuestionarioDinamicoFuncoes';

const CampoDinamicoTexto = props => {
  const { questaoAtual, form, label, desabilitado, onChange, prefixId } = props;

  const id = QuestionarioDinamicoFuncoes.gerarId(prefixId, questaoAtual);

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      {label}
      <CampoTexto
        id={id}
        form={form}
        type="textarea"
        maxLength={999999}
        onChange={onChange}
        minRowsTextArea="4"
        name={String(questaoAtual?.id)}
        placeholder={questaoAtual?.placeHolder}
        desabilitado={desabilitado || questaoAtual?.somenteLeitura}
      />
    </ColunaDimensionavel>
  );
};

CampoDinamicoTexto.propTypes = {
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  label: PropTypes.oneOfType([PropTypes.any]),
  prefixId: PropTypes.string,
  desabilitado: PropTypes.bool,
  onChange: PropTypes.func,
};

CampoDinamicoTexto.defaultProps = {
  questaoAtual: null,
  form: null,
  label: '',
  prefixId: '',
  desabilitado: false,
  onChange: () => {},
};

export default CampoDinamicoTexto;
