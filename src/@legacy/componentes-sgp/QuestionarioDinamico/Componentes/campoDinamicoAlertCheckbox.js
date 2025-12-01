import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setQuestionarioDinamicoEmEdicao } from '~/redux/modulos/questionarioDinamico/actions';

const CampoDinamicoAlertCheckbox = props => {
  const dispatch = useDispatch();
  const { form, questaoAtual, desabilitado, onChange } = props;

  const idOpcaoSim = questaoAtual.opcaoResposta.find(o => o.nome === "Sim")?.id;
  const idOpcaoNao = questaoAtual.opcaoResposta.find(o => o.nome === "Não")?.id;

  const value = form.values[questaoAtual.id];

  const checked = String(value) === String(idOpcaoSim);

  const handleChange = e => {
    const novoValor = e.target.checked ? idOpcaoSim : idOpcaoNao;

    form.setFieldValue(questaoAtual.id, novoValor);
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
          checked={checked}
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