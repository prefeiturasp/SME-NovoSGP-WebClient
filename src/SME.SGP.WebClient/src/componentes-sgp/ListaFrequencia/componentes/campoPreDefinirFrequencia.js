import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SelectComponent from '~/componentes/select';
import MetodosListaFrequencia from '../MetodosListaFrequencia';
import CampoTipoFreqSomenteLeitura from './campoTipoFreqSomenteLeitura';
import { ContainerTipoFrequencia } from './style';

const CampoPreDefinirFrequencia = props => {
  const { indexAluno, onChange, desabilitar } = props;

  const listaTiposFrequencia = useSelector(
    state =>
      state.frequenciaPlanoAula.listaDadosFrequencia?.listaTiposFrequencia
  );

  const tipoFrequenciaPreDefinido = useSelector(
    state =>
      state.frequenciaPlanoAula?.listaDadosFrequencia?.listaFrequencia?.[
        indexAluno
      ]?.tipoFrequenciaPreDefinido
  );

  const [exibir, setExibir] = useState(false);

  const idCampo = `pre-definir-frequencia-aluno-${indexAluno}`;

  const cor = MetodosListaFrequencia.obterCorTipoFrequencia(
    tipoFrequenciaPreDefinido
  );

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
          id={idCampo}
          lista={listaTiposFrequencia || []}
          valueOption="valor"
          valueText="descricao"
          valueSelect={tipoFrequenciaPreDefinido}
          allowClear={false}
          onChange={onChange}
          disabled={desabilitar}
        />
      ) : (
        <CampoTipoFreqSomenteLeitura
          className={`tamanho-campo-select ${desabilitar ? 'desabilitar' : ''}`}
          id={idCampo}
          valor={tipoFrequenciaPreDefinido}
          style={{ color: cor, borderColor: cor }}
          desabilitar={desabilitar}
        />
      )}
    </ContainerTipoFrequencia>
  );
};

CampoPreDefinirFrequencia.propTypes = {
  indexAluno: PropTypes.oneOfType(PropTypes.any),
  onChange: PropTypes.func,
  desabilitar: PropTypes.bool,
};

CampoPreDefinirFrequencia.defaultProps = {
  indexAluno: null,
  onChange: () => {},
  desabilitar: false,
};

export default CampoPreDefinirFrequencia;
