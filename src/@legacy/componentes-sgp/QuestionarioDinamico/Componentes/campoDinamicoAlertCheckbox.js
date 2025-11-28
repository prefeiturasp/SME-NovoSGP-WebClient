import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setQuestionarioDinamicoEmEdicao } from '~/redux/modulos/questionarioDinamico/actions';

const CampoDinamicoAlertCheckbox = props => {
  const dispatch = useDispatch();
  const { form, questaoAtual, desabilitado, onChange } = props;

  const handleChange = e => {
    form.setFieldValue(questaoAtual.id, e.target.checked);
    dispatch(setQuestionarioDinamicoEmEdicao(true));
    if (onChange) onChange();
  };

  return (
    <div className="col-md-12 mb-3">
      <div
        className="d-flex align-items-center p-2 mb-2"
        style={{ backgroundColor: '#FFF3CD', borderRadius: '4px' }}
      >
        <input
          type="checkbox"
          style={{ marginRight: '12px', marginLeft: '12px', color: '#856404' }}
          checked={!!form.values[questaoAtual.id]}
          onChange={handleChange}
          disabled={desabilitado}
        />
        <div>
          <span
            className="fw-bold"
            style={{ color: '#856404', fontWeight: 'bold' }}
          >
            {questaoAtual.nome}
          </span>
          <div className="small" style={{ color: '#856404' }}>
            {questaoAtual.observacao}
          </div>
        </div>
      </div>
    </div>
  );
};

CampoDinamicoAlertCheckbox.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
  desabilitado: PropTypes.bool,
  onChange: PropTypes.func,
};

CampoDinamicoAlertCheckbox.defaultProps = {
  form: null,
  questaoAtual: null,
  desabilitado: false,
  onChange: () => {},
};

export default CampoDinamicoAlertCheckbox;
