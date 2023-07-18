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
  setAcompanhamentoAprendizagemEmEdicao,
  setApanhadoGeralEmEdicao,
} from '~/redux/modulos/acompanhamentoAprendizagem/actions';
import { confirmar } from '~/servicos';
import ServicoAcompanhamentoAprendizagem from '~/servicos/Paginas/Relatorios/AcompanhamentoAprendizagem/ServicoAcompanhamentoAprendizagem';
import { useNavigate } from 'react-router-dom';

const BotoesAcoesAcompanhamentoAprendizagem = props => {
  const { semestreSelecionado, componenteCurricularId,limparAlunoIconeAlunoSelecionado } = props;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const desabilitarCamposAcompanhamentoAprendizagem = useSelector(
    store =>
      store.acompanhamentoAprendizagem
        .desabilitarCamposAcompanhamentoAprendizagem
  );

  const acompanhamentoAprendizagemEmEdicao = useSelector(
    store => store.acompanhamentoAprendizagem.acompanhamentoAprendizagemEmEdicao
  );

  const apanhadoGeralEmEdicao = useSelector(
    store => store.acompanhamentoAprendizagem.apanhadoGeralEmEdicao
  );

  const dadosAlunoObjectCard = useSelector(
    store => store.acompanhamentoAprendizagem.dadosAlunoObjectCard
  );

  const { codigoEOL } = dadosAlunoObjectCard;

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const recarregarDados = () => {
    if (acompanhamentoAprendizagemEmEdicao) {
      dispatch(setAcompanhamentoAprendizagemEmEdicao(false));
      ServicoAcompanhamentoAprendizagem.obterAcompanhamentoEstudante(
        turmaSelecionada?.id,
        codigoEOL,
        semestreSelecionado,
        componenteCurricularId
      );
    }

    if (apanhadoGeralEmEdicao) {
      dispatch(setApanhadoGeralEmEdicao(false));
      ServicoAcompanhamentoAprendizagem.obterDadosApanhadoGeral(
        turmaSelecionada?.id,
        semestreSelecionado
      );
    }
  };

  const onClickSalvar = async () => {
    const salvouApanhadoGeral =
      await ServicoAcompanhamentoAprendizagem.salvarDadosApanhadoGeral(
        semestreSelecionado
      );

    const salvouCompanhamento =
      await ServicoAcompanhamentoAprendizagem.salvarDadosAcompanhamentoAprendizagem(
        semestreSelecionado
      );

    if (salvouApanhadoGeral && salvouCompanhamento) await recarregarDados();

    if(salvouApanhadoGeral && salvouCompanhamento)
           limparAlunoIconeAlunoSelecionado(codigoEOL);

    return salvouApanhadoGeral && salvouCompanhamento;
  };

  const perguntaAoSalvar = async () => {
    return confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
  };

  const onClickVoltar = async () => {
    if (
      !desabilitarCamposAcompanhamentoAprendizagem &&
      (acompanhamentoAprendizagemEmEdicao || apanhadoGeralEmEdicao)
    ) {
      const confirmado = await perguntaAoSalvar();
      if (confirmado) {
        const continuar = await onClickSalvar();
        if (continuar) {
          navigate(URL_HOME);
        }
      } else {
        navigate(URL_HOME);
      }
    } else {
      navigate(URL_HOME);
    }
  };

  const onClickCancelar = async () => {
    if (acompanhamentoAprendizagemEmEdicao || apanhadoGeralEmEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        recarregarDados();
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
        onClick={onClickCancelar}
        disabled={
          desabilitarCamposAcompanhamentoAprendizagem ||
          (!acompanhamentoAprendizagemEmEdicao && !apanhadoGeralEmEdicao)
        }
      />
      <Button
        id={SGP_BUTTON_SALVAR}
        label="Salvar"
        color={Colors.Roxo}
        border
        bold
        onClick={onClickSalvar}
        disabled={
          desabilitarCamposAcompanhamentoAprendizagem ||
          (!acompanhamentoAprendizagemEmEdicao && !apanhadoGeralEmEdicao)
        }
      />
    </>
  );
};

BotoesAcoesAcompanhamentoAprendizagem.propTypes = {
  semestreSelecionado: PropTypes.string,
  componenteCurricularId: PropTypes.string,
};

BotoesAcoesAcompanhamentoAprendizagem.defaultProps = {
  semestreSelecionado: '',
  componenteCurricularId: '',
};

export default BotoesAcoesAcompanhamentoAprendizagem;
