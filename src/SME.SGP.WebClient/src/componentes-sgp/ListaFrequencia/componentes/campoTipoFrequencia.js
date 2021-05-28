import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SelectComponent from '~/componentes/select';
import MetodosListaFrequencia from '../MetodosListaFrequencia';
import CampoTipoFreqSomenteLeitura from './campoTipoFreqSomenteLeitura';
import { ContainerTipoFrequencia } from './style';

const CampoTipoFrequencia = props => {
  const { onChange, indexAluno, indexAula, numeroAula } = props;

  const compareceu = useSelector(
    state =>
      state.frequenciaPlanoAula?.listaDadosFrequencia?.listaFrequencia?.[
        indexAluno
      ]?.aulas?.[indexAula]?.compareceu
  );

  const tiposFrequencia = useSelector(
    state => state.frequenciaPlanoAula.listaDadosFrequencia?.tiposFrequencia
  );

  const [exibir, setExibir] = useState(false);

  const idCampo = `tipo-frequencia-aula-${numeroAula}`;

  const cor = MetodosListaFrequencia.obterCorTipoFrequencia(compareceu);

  return (
    <ContainerTipoFrequencia
      onMouseEnter={() => setExibir(true)}
      onMouseLeave={() => setExibir(false)}
    >
      {exibir ? (
        <SelectComponent
          color={cor}
          border={cor}
          className="tamanho-campo-select"
          id={`tipo-frequencia-aula-${numeroAula}`}
          lista={tiposFrequencia || []}
          valueOption="valor"
          valueText="desc"
          valueSelect={compareceu}
          allowClear={false}
          onChange={tipo => {
            onChange(tipo);
            setExibir(false);
          }}
        />
      ) : (
        <CampoTipoFreqSomenteLeitura
          className="tamanho-campo-select"
          id={idCampo}
          valor={compareceu}
          style={{ color: cor, borderColor: cor }}
        />
      )}
    </ContainerTipoFrequencia>
  );
};

CampoTipoFrequencia.propTypes = {
  onChange: PropTypes.oneOfType(PropTypes.func),
  indexAluno: PropTypes.oneOfType(PropTypes.number),
  indexAula: PropTypes.oneOfType(PropTypes.number),
  numeroAula: PropTypes.oneOfType(PropTypes.number),
};

CampoTipoFrequencia.defaultProps = {
  onChange: () => {},
  indexAluno: null,
  indexAula: null,
  numeroAula: null,
};

export default CampoTipoFrequencia;
