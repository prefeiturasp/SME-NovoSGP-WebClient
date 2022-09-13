import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR,
} from '~/componentes-sgp/filtro/idsCampos';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';

const BotoesAcoesDiarioBordo = props => {
  const {
    onClickVoltar,
    onClickCancelar,
    modoEdicao,
    desabilitarCampos,
    turmaInfantil,
    validaAntesDoSubmit,
  } = props;

  const observacaoEmEdicao = useSelector(
    store => store.observacoesUsuario.observacaoEmEdicao
  );

  const novaObservacao = useSelector(
    store => store.observacoesUsuario.novaObservacao
  );

  return (
    <>
      <BotaoVoltarPadrao
        className="mr-2"
        onClick={() => onClickVoltar(observacaoEmEdicao, novaObservacao)}
      />
      <Button
        id={SGP_BUTTON_CANCELAR}
        label="Cancelar"
        color={Colors.Roxo}
        border
        bold
        className="mr-2"
        onClick={onClickCancelar}
        disabled={!modoEdicao || desabilitarCampos}
      />
      <Button
        id={SGP_BUTTON_SALVAR}
        label="Salvar"
        color={Colors.Roxo}
        border
        bold
        onClick={validaAntesDoSubmit}
        disabled={!modoEdicao || !turmaInfantil || desabilitarCampos}
      />
    </>
  );
};

BotoesAcoesDiarioBordo.propTypes = {
  onClickVoltar: PropTypes.func,
  onClickCancelar: PropTypes.func,
  validaAntesDoSubmit: PropTypes.func,
  modoEdicao: PropTypes.bool,
  desabilitarCampos: PropTypes.bool,
  turmaInfantil: PropTypes.bool,
};

BotoesAcoesDiarioBordo.defaultProps = {
  onClickVoltar: () => {},
  onClickCancelar: () => {},
  validaAntesDoSubmit: () => {},
  modoEdicao: false,
  desabilitarCampos: false,
  turmaInfantil: false,
};

export default BotoesAcoesDiarioBordo;
