import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Colors } from '~/componentes';

import { URL_HOME } from '~/constantes';

import { setDadosAlunoObjectCard } from '~/redux/modulos/conselhoClasse/actions';
import { limparDadosRegistroIndividual } from '~/redux/modulos/registroIndividual/actions';

import MetodosRegistroIndividual from '~/componentes-sgp/RegistroIndividual/metodosRegistroIndividual';
import {
  SGP_BUTTON_CADASTRAR,
  SGP_BUTTON_CANCELAR,
} from '~/constantes/ids/button';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { useNavigate } from 'react-router-dom';

const BotoesAcoes = ({ turmaInfantil }) => {
  const navigate = useNavigate();

  const registroIndividualEmEdicao = useSelector(
    state => state.registroIndividual.registroIndividualEmEdicao
  );
  const desabilitarCampos = useSelector(
    state => state.registroIndividual.desabilitarCampos
  );

  const dispatch = useDispatch();

  const onClickVoltar = async () => {
    let validouSalvarRegistro = true;
    if (registroIndividualEmEdicao && turmaInfantil && desabilitarCampos) {
      validouSalvarRegistro =
        await MetodosRegistroIndividual.salvarRegistroIndividual();
    }

    if (validouSalvarRegistro) {
      navigate(URL_HOME);
      MetodosRegistroIndividual.resetarInfomacoes();
      dispatch(setDadosAlunoObjectCard({}));
    }
  };

  const onClickCancelar = () => {
    dispatch(limparDadosRegistroIndividual());
  };

  const onClickCadastrar = () => {
    MetodosRegistroIndividual.verificarSalvarRegistroIndividual(true);
  };

  return (
    <>
      <BotaoVoltarPadrao className="mr-2" onClick={() => onClickVoltar()} />
      <Button
        id={SGP_BUTTON_CANCELAR}
        label="Cancelar"
        color={Colors.Roxo}
        border
        className="mr-2"
        onClick={onClickCancelar}
        disabled={
          !registroIndividualEmEdicao || !turmaInfantil || !desabilitarCampos
        }
      />
      <Button
        id={SGP_BUTTON_CADASTRAR}
        label="Cadastrar"
        color={Colors.Roxo}
        bold
        onClick={onClickCadastrar}
        disabled={
          !registroIndividualEmEdicao || !turmaInfantil || !desabilitarCampos
        }
      />
    </>
  );
};

BotoesAcoes.propTypes = {
  turmaInfantil: PropTypes.bool,
};

BotoesAcoes.defaultProps = {
  turmaInfantil: false,
};
export default BotoesAcoes;
