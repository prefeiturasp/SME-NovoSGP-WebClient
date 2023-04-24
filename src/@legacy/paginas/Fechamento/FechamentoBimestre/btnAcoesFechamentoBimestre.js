import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '~/componentes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR,
} from '~/constantes/ids/button';
import Button from '~/componentes/button';

const BtnAcoesFechamentoBimestre = props => {
  const dispatch = useDispatch();

  const {
    salvarFechamentoFinal,
    onClickVoltar,
    onClickCancelar,
    somenteConsulta,
    ehSintese,
    emEdicao,
    setEmEdicao,
  } = props;

  return (
    <>
      <BotaoVoltarPadrao className="mr-2" onClick={() => onClickVoltar()} />
      <Button
        id={SGP_BUTTON_CANCELAR}
        label="Cancelar"
        color={Colors.Roxo}
        border
        className="mr-2"
        onClick={() => onClickCancelar()}
        disabled={!emEdicao || somenteConsulta}
        hidden={ehSintese}
      />
      <Button
        id={SGP_BUTTON_SALVAR}
        label="Salvar"
        color={Colors.Roxo}
        border
        bold
        onClick={() => salvarFechamentoFinal()}
        disabled={!emEdicao || somenteConsulta}
        hidden={ehSintese}
      />
    </>
  );
};

BtnAcoesFechamentoBimestre.propTypes = {
  salvarFechamentoFinal: PropTypes.func,
  onClickVoltar: PropTypes.func,
  onClickCancelar: PropTypes.func,
  somenteConsulta: PropTypes.bool,
  ehSintese: PropTypes.bool,
};

BtnAcoesFechamentoBimestre.defaultProps = {
  salvarFechamentoFinal: () => {},
  onClickVoltar: () => {},
  onClickCancelar: () => {},
  somenteConsulta: false,
  ehSintese: true,
};

export default BtnAcoesFechamentoBimestre;
