import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR,
} from '~/constantes/ids/button';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import { confirmar } from '~/servicos/alertas';

const BotoesAcoessNotasConceitos = props => {
  const { onClickVoltar, onClickCancelar, onClickSalvar, desabilitarBotao } =
    props;

  const modoEdicaoGeral = useSelector(
    store => store.notasConceitos.modoEdicaoGeral
  );

  const modoEdicaoGeralNotaFinal = useSelector(
    store => store.notasConceitos.modoEdicaoGeralNotaFinal
  );

  const onCancelar = async () => {
    if (modoEdicaoGeral || modoEdicaoGeralNotaFinal) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        return onClickCancelar(true);
      }
    }
    return onClickCancelar(false);
  };

  return (
    <>
      <BotaoVoltarPadrao className="mr-2" onClick={onClickVoltar} />
      <Button
        id={SGP_BUTTON_CANCELAR}
        label="Cancelar"
        color={Colors.Roxo}
        border
        className="mr-2"
        onClick={onCancelar}
        disabled={!modoEdicaoGeral && !modoEdicaoGeralNotaFinal}
      />
      <Button
        id={SGP_BUTTON_SALVAR}
        label="Salvar"
        color={Colors.Roxo}
        border
        bold
        onClick={onClickSalvar}
        disabled={
          desabilitarBotao || (!modoEdicaoGeral && !modoEdicaoGeralNotaFinal)
        }
      />
    </>
  );
};

BotoesAcoessNotasConceitos.propTypes = {
  onClickVoltar: PropTypes.func,
  onClickCancelar: PropTypes.func,
  onClickSalvar: PropTypes.func,
  desabilitarBotao: PropTypes.bool,
};

BotoesAcoessNotasConceitos.defaultProps = {
  onClickVoltar: () => {},
  onClickCancelar: () => {},
  onClickSalvar: () => {},
  desabilitarBotao: false,
};

export default BotoesAcoessNotasConceitos;
