import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import SelectComponent from '~/componentes/select';

const CampoTipoFrequencia = props => {
  const { onChangeTipoFrequencia, indexAluno, indexAula, numeroAula } = props;

  const compareceu = useSelector(
    state =>
      state.frequenciaPlanoAula?.listaDadosFrequencia?.listaFrequencia?.[
        indexAluno
      ]?.aulas?.[indexAula]?.compareceu
  );

  // TODO Consumir do endpoint!
  const listaTipoFrequencia = [
    { valor: 'F', desc: 'F' },
    { valor: 'C', desc: 'C' },
    { valor: 'R', desc: 'R' },
  ];

  return (
    <div className={compareceu ? 'presenca' : 'falta'}>
      <SelectComponent
        id={`tipo-frequencia-aula-${numeroAula}`}
        lista={listaTipoFrequencia}
        valueOption="valor"
        valueText="desc"
        valueSelect={compareceu || 'C'}
        allowClear={false}
        onChange={onChangeTipoFrequencia}
      />
    </div>
  );
};

CampoTipoFrequencia.propTypes = {
  onChangeTipoFrequencia: PropTypes.oneOfType(PropTypes.func),
  indexAluno: PropTypes.oneOfType(PropTypes.number),
  indexAula: PropTypes.oneOfType(PropTypes.number),
  numeroAula: PropTypes.oneOfType(PropTypes.number),
};

CampoTipoFrequencia.defaultProps = {
  onChangeTipoFrequencia: () => {},
  indexAluno: null,
  indexAula: null,
  numeroAula: null,
};

export default CampoTipoFrequencia;
