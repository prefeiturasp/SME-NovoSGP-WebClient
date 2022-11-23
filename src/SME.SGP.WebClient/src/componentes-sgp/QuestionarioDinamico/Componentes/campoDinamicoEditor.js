import PropTypes from 'prop-types';
import React from 'react';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';

const CampoDinamicoEditor = props => {
  const { questaoAtual, form, label, desabilitado, onChange } = props;

  return (
    <div className="col-md-12 mb-3">
      {label}
      <JoditEditor
        form={form}
        value={form?.values?.[String(questaoAtual?.id)]}
        id={String(questaoAtual?.id)}
        name={String(questaoAtual?.id)}
        onChange={v => {
          if (form?.initialValues?.[String(questaoAtual?.id)] !== v) {
            onChange();
          }
        }}
        readonly={desabilitado}
      />
    </div>
  );
};

CampoDinamicoEditor.propTypes = {
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  label: PropTypes.oneOfType([PropTypes.any]),
  desabilitado: PropTypes.bool,
  onChange: PropTypes.func,
};

CampoDinamicoEditor.defaultProps = {
  questaoAtual: null,
  form: null,
  label: '',
  desabilitado: false,
  onChange: () => {},
};

export default CampoDinamicoEditor;
