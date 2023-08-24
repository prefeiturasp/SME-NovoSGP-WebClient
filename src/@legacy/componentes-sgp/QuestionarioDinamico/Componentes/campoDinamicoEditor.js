import { setResetarCampoDinamicoEditor } from '@/@legacy/redux/modulos/questionarioDinamico/actions';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import QuestionarioDinamicoFuncoes from '../Funcoes/QuestionarioDinamicoFuncoes';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';

const CampoDinamicoEditor = props => {
  const dispatch = useDispatch();
  const textArea = useRef(null);

  const { questaoAtual, form, label, desabilitado, onChange, prefixId } = props;

  const id = QuestionarioDinamicoFuncoes.gerarId(prefixId, questaoAtual);

  const resetarCampoDinamicoEditor = useSelector(
    store => store.questionarioDinamico.resetarCampoDinamicoEditor
  );

  const valorInicial = form?.initialValues?.[String(questaoAtual?.id)];

  useEffect(() => {
    if (resetarCampoDinamicoEditor) {
      form?.setFieldValue(id, valorInicial);

      if (textArea?.current?.setEditorValue) {
        textArea.current.setEditorValue(valorInicial);
      }
      dispatch(setResetarCampoDinamicoEditor(false));
    }
  }, [resetarCampoDinamicoEditor, id, valorInicial, textArea]);

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      <div id={id}>
        {label}
        <JoditEditor
          ref={textArea}
          height="350px"
          id={id}
          form={form}
          readonly={desabilitado}
          name={String(questaoAtual?.id)}
          placeholder={questaoAtual?.placeHolder}
          value={valorInicial}
          onChange={v => {
            if (valorInicial !== v) {
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
