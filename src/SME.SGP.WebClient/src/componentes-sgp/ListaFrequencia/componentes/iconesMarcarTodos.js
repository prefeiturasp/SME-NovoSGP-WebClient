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

  const listaTiposFrequencia = useSelector(
    state =>
      state.frequenciaPlanoAula.listaDadosFrequencia?.listaTiposFrequencia
  );

  const selecionadoTodasAulasPorTipo = tipo => {
    const totalAulas = aulas.length;
    const totalAulasPorTipo = aulas.filter(
      aula => aula.tipoFrequencia === tipo.valor
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

  const temTipoNaLista = tipo =>
    listaTiposFrequencia?.find(item => item?.valor === tipo);

  return (
    <div className="d-flex" style={{ justifyContent: 'space-evenly' }}>
      {temTipoNaLista(tipoFrequencia.Compareceu.valor) &&
        montarIconesMarcarTodos(
          faCheckCircle,
          tipoFrequencia.Compareceu,
          obterCor(tipoFrequencia.Compareceu)
        )}
      {temTipoNaLista(tipoFrequencia.Faltou.valor) &&
        montarIconesMarcarTodos(
          faTimesCircle,
          tipoFrequencia.Faltou,
          obterCor(tipoFrequencia.Faltou)
        )}
      {temTipoNaLista(tipoFrequencia.Remoto.valor) &&
        montarIconesMarcarTodos(
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
