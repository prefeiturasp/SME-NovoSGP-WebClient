import PropTypes from 'prop-types';
import React from 'react';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';
import QuestionarioDinamicoFuncoes from '../Funcoes/QuestionarioDinamicoFuncoes';

const CampoDinamicoEditor = props => {
  const { questaoAtual, form, label, desabilitado, onChange, prefixId } = props;

  const id = QuestionarioDinamicoFuncoes.gerarId(prefixId, questaoAtual);

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      <div id={id}>
        {label}
        <JoditEditor
          id={id}
          form={form}
          readonly={desabilitado}
          name={String(questaoAtual?.id)}
          placeholder={questaoAtual?.placeHolder}
          value={form?.values?.[String(questaoAtual?.id)]}
          onChange={v => {
            if (form?.initialValues?.[String(questaoAtual?.id)] !== v) {
              onChange();
            }
          }}
        />
      </div>
    </ColunaDimensionavel>
  );
};

CampoDinamicoEditor.propTypes = {
  label: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
  prefixId: PropTypes.string,
  desabilitado: PropTypes.bool,
  onChange: PropTypes.func,
};

CampoDinamicoEditor.defaultProps = {
  label: '',
  form: null,
  prefixId: '',
  questaoAtual: null,
  desabilitado: false,
  onChange: () => {},
};

export default CampoDinamicoEditor;
