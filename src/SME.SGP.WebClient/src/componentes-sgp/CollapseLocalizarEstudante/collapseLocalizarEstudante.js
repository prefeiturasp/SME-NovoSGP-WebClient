import React from 'react';
import PropTypes from 'prop-types';
import CardCollapse from '~/componentes/cardCollapse';
import CollapseLocalizarEstudanteDados from './collapseLocalizarEstudanteDados';
import { SGP_COLLAPSE_LOCALIZAR_ESTUDANTE_CRIANCA } from '~/constantes/ids/collapse';

const CollapseLocalizarEstudante = props => {
  const {
    changeDre,
    changeUe,
    changeTurma,
    changeLocalizadorEstudante,
    clickCancelar,
    clickProximoPasso,
    validarSePermiteProximoPasso,
  } = props;

  return (
    <CardCollapse
      id={SGP_COLLAPSE_LOCALIZAR_ESTUDANTE_CRIANCA}
      key="localizar-estudante-collapse-key"
      titulo="Localizar Criança/Estudante"
      indice="localizar-estudante-collapse-indice"
      alt="localizar-estudante-alt"
      show
    >
      <CollapseLocalizarEstudanteDados
        changeDre={changeDre}
        changeUe={changeUe}
        changeTurma={changeTurma}
        changeLocalizadorEstudante={changeLocalizadorEstudante}
        clickCancelar={clickCancelar}
        clickProximoPasso={() => {
          document
            .getElementById(
              'expandir-retrair-localizar-estudante-collapse-indice'
            )
            .click();
          clickProximoPasso();
        }}
        validarSePermiteProximoPasso={validarSePermiteProximoPasso}
      />
    </CardCollapse>
  );
};

CollapseLocalizarEstudante.propTypes = {
  changeDre: PropTypes.func,
  changeUe: PropTypes.func,
  changeTurma: PropTypes.func,
  changeLocalizadorEstudante: PropTypes.func,
  clickCancelar: PropTypes.func,
  clickProximoPasso: PropTypes.func,
  validarSePermiteProximoPasso: PropTypes.func,
};

CollapseLocalizarEstudante.defaultProps = {
  changeDre: () => {},
  changeUe: () => {},
  changeTurma: () => {},
  changeLocalizadorEstudante: () => {},
  clickCancelar: () => {},
  clickProximoPasso: () => {},
  validarSePermiteProximoPasso: null,
};

export default CollapseLocalizarEstudante;
