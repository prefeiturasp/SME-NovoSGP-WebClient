import {
  faCheckCircle,
  faDotCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Base } from '~/componentes/colors';
import tipoFrequencia from '~/dtos/tipoFrequencia';

const IconesMarcarTodos = props => {
  const { indexAluno, marcaPresencaFaltaTodasAulas } = props;

  const aulas = useSelector(
    state =>
      state.frequenciaPlanoAula?.listaDadosFrequencia?.listaFrequencia?.[
        indexAluno
      ]?.aulas
  );

  const selecionadoTodasAulasPorTipo = tipo => {
    const totalAulas = aulas.length;
    const totalAulasPorTipo = aulas.filter(
      aula => aula.compareceu === tipo.valor
    );

    return totalAulasPorTipo?.length === totalAulas;
  };

  const obterCor = tipo => {
    if (selecionadoTodasAulasPorTipo(tipo)) {
      return tipo.cor;
    }
    return Base.CinzaDivisor;
  };

  const montarIconesMarcarTodos = (icone, tipo, cor) => {
    return (
      <FontAwesomeIcon
        style={{
          fontSize: '18px',
          cursor: 'pointer',
          color: cor,
        }}
        icon={icone}
        onClick={() => {
          marcaPresencaFaltaTodasAulas(tipo.valor);
        }}
      />
    );
  };

  return (
    <div className="d-flex" style={{ justifyContent: 'space-evenly' }}>
      {montarIconesMarcarTodos(
        faCheckCircle,
        tipoFrequencia.Compareceu,
        obterCor(tipoFrequencia.Compareceu)
      )}
      {montarIconesMarcarTodos(
        faTimesCircle,
        tipoFrequencia.Faltou,
        obterCor(tipoFrequencia.Faltou)
      )}
      {montarIconesMarcarTodos(
        faDotCircle,
        tipoFrequencia.Remoto,
        obterCor(tipoFrequencia.Remoto)
      )}
    </div>
  );
};

IconesMarcarTodos.propTypes = {
  marcaPresencaFaltaTodasAulas: PropTypes.oneOfType(PropTypes.func),
  indexAluno: PropTypes.number,
};

IconesMarcarTodos.defaultProps = {
  marcaPresencaFaltaTodasAulas: () => {},
  indexAluno: null,
};

export default IconesMarcarTodos;
