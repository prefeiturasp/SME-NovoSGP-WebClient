import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR,
} from '~/constantes/ids/button';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import { URL_HOME } from '~/constantes/url';
import {
  limparDadosCartaIntencoes,
  setCarregandoCartaIntencoes,
} from '~/redux/modulos/cartaIntencoes/actions';
import { confirmar } from '~/servicos/alertas';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import ServicoSalvarCartaIntencoes from '../../servicoSalvarCartaIntencoes';
import { useNavigate } from 'react-router-dom';

const BotoesAcoesCartaIntencoes = props => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    onClickCancelar,
    onClickSalvar,
    componenteCurricularId,
    codigoTurma,
    somenteConsulta,
    salvarEditarObservacao,
  } = props;

  const cartaIntencoesEmEdicao = useSelector(
    store => store.cartaIntencoes.cartaIntencoesEmEdicao
  );

  const observacaoEmEdicao = useSelector(
    store => store.observacoesUsuario.observacaoEmEdicao
  );

  const novaObservacao = useSelector(
    store => store.observacoesUsuario.novaObservacao
  );

  const onSalvar = async () => {
    if (cartaIntencoesEmEdicao && ehTurmaInfantil) {
      dispatch(setCarregandoCartaIntencoes(true));
      const salvou =
        await ServicoSalvarCartaIntencoes.validarSalvarCartaIntencoes(
          componenteCurricularId,
          codigoTurma
        );
      dispatch(setCarregandoCartaIntencoes(false));
      if (salvou) {
        onClickSalvar();
      }
    }
  };

  const perguntaAoSalvar = async () => {
    return confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
  };

  const salvarCarta = async () => {
    const confirmado = await perguntaAoSalvar();
    if (confirmado) {
      dispatch(setCarregandoCartaIntencoes(true));
      const salvou =
        await ServicoSalvarCartaIntencoes.validarSalvarCartaIntencoes(
          componenteCurricularId,
          codigoTurma
        );
      dispatch(setCarregandoCartaIntencoes(false));
      if (salvou) {
        return true;
      }
      return false;
    }
    return true;
  };

  const perguntaAoSalvarObservacao = async () => {
    return confirmar(
      'Atenção',
      '',
      'Você não salvou as observações, deseja salvar agora?'
    );
  };

  const salvarObservacao = async dados => {
    const confirmado = await perguntaAoSalvarObservacao();
    if (confirmado) {
      const salvou = await salvarEditarObservacao(dados);
      if (salvou) {
        return true;
      }
      return false;
    }
    return true;
  };

  const onClickVoltar = async () => {
    let validouSalvarCarta = true;
    if (!somenteConsulta && cartaIntencoesEmEdicao && ehTurmaInfantil) {
      validouSalvarCarta = await salvarCarta();
    }

    let validouSalvarObservacao = true;
    if (novaObservacao) {
      validouSalvarObservacao = await salvarObservacao({
        observacao: novaObservacao,
      });
    } else if (observacaoEmEdicao) {
      validouSalvarObservacao = await salvarObservacao(observacaoEmEdicao);
    }

    if (validouSalvarCarta && validouSalvarObservacao) {
      navigate(URL_HOME);
    }
  };

  const onCancelar = async () => {
    if (cartaIntencoesEmEdicao && ehTurmaInfantil) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        dispatch(limparDadosCartaIntencoes());
        onClickCancelar();
      }
    }
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
        onClick={onCancelar}
        disabled={
          !ehTurmaInfantil || somenteConsulta || !cartaIntencoesEmEdicao
        }
      />
      <Button
        id={SGP_BUTTON_SALVAR}
        label="Salvar"
        color={Colors.Roxo}
        border
        bold
        onClick={onSalvar}
        disabled={
          !ehTurmaInfantil || somenteConsulta || !cartaIntencoesEmEdicao
        }
      />
    </>
  );
};

BotoesAcoesCartaIntencoes.propTypes = {
  onClickCancelar: PropTypes.func,
  onClickSalvar: PropTypes.func,
  componenteCurricularId: PropTypes.string,
  codigoTurma: PropTypes.oneOfType([PropTypes.any]),
  somenteConsulta: PropTypes.bool,
  salvarEditarObservacao: PropTypes.func,
};

BotoesAcoesCartaIntencoes.defaultProps = {
  onClickCancelar: () => {},
  onClickSalvar: () => {},
  componenteCurricularId: '',
  codigoTurma: '',
  somenteConsulta: false,
  salvarEditarObservacao: () => {},
};

export default BotoesAcoesCartaIntencoes;
