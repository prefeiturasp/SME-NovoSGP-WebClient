import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SelectComponent from '~/componentes/select';
import MetodosListaFrequencia from '../MetodosListaFrequencia';
import CampoTipoFreqSomenteLeitura from './campoTipoFreqSomenteLeitura';
import { ContainerTipoFrequencia } from './style';

const CampoTipoFrequencia = props => {
  const { onChange, indexAluno, indexAula, numeroAula, desabilitar } = props;

  const tipoFrequencia = useSelector(
    state =>
      state.frequenciaPlanoAula?.listaDadosFrequencia?.listaFrequencia?.[
        indexAluno
      ]?.aulas?.[indexAula]?.tipoFrequencia
  );

  const listaTiposFrequencia = useSelector(
    state =>
      state.frequenciaPlanoAula.listaDadosFrequencia?.listaTiposFrequencia
  );

  const [exibir, setExibir] = useState(false);

  const idCampo = `tipo-frequencia-aula-${numeroAula}`;

  const cor = MetodosListaFrequencia.obterCorTipoFrequencia(tipoFrequencia);

  const validarExibir = valor => {
    if (!desabilitar) {
      setExibir(valor);
    }
  };

  return (
    <ContainerTipoFrequencia
      onMouseEnter={() => validarExibir(true)}
      onMouseLeave={() => validarExibir(false)}
    >
      {!desabilitar && exibir ? (
        <SelectComponent
          color={cor}
          border={cor}
          className="tamanho-campo-select"
          id={`tipo-frequencia-aula-${numeroAula}`}
          lista={listaTiposFrequencia || []}
          valueOption="valor"
          valueText="descricao"
          valueSelect={tipoFrequencia}
          allowClear={false}
          onChange={tipo => {
            onChange(tipo);
            setExibir(false);
          }}
          disabled={desabilitar}
        />
      ) : (
        <CampoTipoFreqSomenteLeitura
          className={`tamanho-campo-select ${desabilitar ? 'desabilitar' : ''}`}
          id={idCampo}
          valor={tipoFrequencia}
          style={{ color: cor, borderColor: cor }}
          desabilitar={desabilitar}
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
  desabilitar: PropTypes.bool,
};

CampoTipoFrequencia.defaultProps = {
  onChange: () => {},
  indexAluno: null,
  indexAula: null,
  numeroAula: null,
  desabilitar: false,
};

export default CampoTipoFrequencia;
