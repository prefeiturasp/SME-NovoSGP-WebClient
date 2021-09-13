import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '~/componentes';
import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import Button from '~/componentes/button';
import { RotasDto, situacaoPlanoAEE } from '~/dtos';
import {
  limparDadosParecer,
  setAtualizarDados,
  setAtualizarPlanoAEEDados,
  setExibirLoaderPlanoAEE,
  setExibirModalDevolverPlanoAEE,
  setParecerEmEdicao,
} from '~/redux/modulos/planoAEE/actions';
import { setQuestionarioDinamicoEmEdicao } from '~/redux/modulos/questionarioDinamico/actions';
import { confirmar, erros, history, sucesso } from '~/servicos';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';

const BotoesAcoesPlanoAEE = props => {
  const { match } = props;

  const questionarioDinamicoEmEdicao = useSelector(
    store => store.questionarioDinamico.questionarioDinamicoEmEdicao
  );

  const desabilitarCamposPlanoAEE = useSelector(
    store => store.planoAEE.desabilitarCamposPlanoAEE
  );

  const dadosParecer = useSelector(store => store.planoAEE.dadosParecer);

  const parecerEmEdicao = useSelector(store => store.planoAEE.parecerEmEdicao);

  const planoAEEDados = useSelector(store => store.planoAEE.planoAEEDados);

  const dadosAtribuicaoResponsavel = useSelector(
    store => store.planoAEE.dadosAtribuicaoResponsavel
  );

  const usuario = useSelector(store => store.usuario);
  const permissoesTela = usuario.permissoes[RotasDto.RELATORIO_AEE_PLANO];

  const parecerCP = planoAEEDados?.situacao === situacaoPlanoAEE.ParecerCP;
  const parecerPAAI =
    planoAEEDados?.situacao === situacaoPlanoAEE.ParecerPAAI &&
    dadosParecer?.podeEditarParecerPAAI;
  const situacaoAtribuicaoPAAI =
    planoAEEDados?.situacao === situacaoPlanoAEE.AtribuicaoPAAI;

  const situacaoParecer =
    parecerCP ||
    (situacaoAtribuicaoPAAI && !dadosAtribuicaoResponsavel?.codigoRF);

  const planoAeeId = match?.params?.id;
  const labelBotaoSalvar =
    situacaoParecer || !planoAeeId ? 'Salvar' : 'Alterar';

  const desabilitarBotaoSalvar = situacaoParecer
    ? !parecerEmEdicao
    : desabilitarCamposPlanoAEE || !questionarioDinamicoEmEdicao;

  const desabilitarBotaoCancelar =
    situacaoParecer || parecerPAAI
      ? !parecerEmEdicao
      : desabilitarCamposPlanoAEE || !questionarioDinamicoEmEdicao;

  const dispatch = useDispatch();

  const limparParecer = () => {
    dispatch(limparDadosParecer());
    dispatch(setParecerEmEdicao(false));
  };

  const escolherAcao = async () => {
    let msg = '';
    let resposta = [];
    if (situacaoParecer) {
      resposta = await ServicoPlanoAEE.salvarParecerCP().catch(e => erros(e));
      msg = 'Parecer realizado com sucesso';
    }
    if (situacaoAtribuicaoPAAI) {
      resposta = await ServicoPlanoAEE.atribuirResponsavel().catch(e =>
        erros(e)
      );
      msg = 'Atribuição do responsável realizada com sucesso';
    }
    if (parecerPAAI) {
      resposta = await ServicoPlanoAEE.salvarParecerPAAI().catch(e => erros(e));
      msg = 'Encerramento do plano realizado com sucesso';
    }
    if (resposta?.data) {
      sucesso(msg);
      limparParecer();
      history.push(RotasDto.RELATORIO_AEE_PLANO);
    }
  };

  const onClickVoltar = async () => {
    if (questionarioDinamicoEmEdicao || parecerEmEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );

      if (confirmou) {
        if (parecerEmEdicao) {
          escolherAcao();
          return;
        }
        const salvou = await ServicoPlanoAEE.salvarPlano();
        const planoId = match?.params?.id;

        if (salvou) {
          let mensagem = 'Registro salvo com sucesso';
          if (planoId) {
            mensagem = 'Registro alterado com sucesso';
          }
          sucesso(mensagem);
          history.push(RotasDto.RELATORIO_AEE_PLANO);
        }
      } else {
        limparParecer();
        history.push(RotasDto.RELATORIO_AEE_PLANO);
      }
    } else {
      history.push(RotasDto.RELATORIO_AEE_PLANO);
    }
  };

  const onClickCancelar = async () => {
    if (
      !desabilitarCamposPlanoAEE &&
      (questionarioDinamicoEmEdicao || parecerEmEdicao)
    ) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        if (parecerEmEdicao) {
          limparParecer();
          dispatch(setAtualizarPlanoAEEDados(true));
          return;
        }
        QuestionarioDinamicoFuncoes.limparDadosOriginaisQuestionarioDinamico();
      }
    }
  };

  const onClickSalvar = async () => {
    if (situacaoParecer) {
      escolherAcao();
      return;
    }
    const planoId = await ServicoPlanoAEE.salvarPlano(true);
    const registroNovo = !match?.params?.id;

    if (planoId) {
      let mensagem = 'Registro alterado com sucesso';
      if (registroNovo) {
        mensagem = 'Registro salvo com sucesso';
      }
      sucesso(mensagem);

      dispatch(setQuestionarioDinamicoEmEdicao(false));

      if (registroNovo) {
        history.push(`${RotasDto.RELATORIO_AEE_PLANO}`);
      } else {
        dispatch(setAtualizarDados(true));
      }
    }
  };

  const onClickSolicitarEncerramento = async () => {
    if (!desabilitarCamposPlanoAEE && !questionarioDinamicoEmEdicao) {
      dispatch(setExibirLoaderPlanoAEE(true));

      const resposta = await ServicoPlanoAEE.encerrarPlano(planoAeeId)
        .catch(e => erros(e))
        .finally(() => dispatch(setExibirLoaderPlanoAEE(false)));
      if (resposta?.data) {
        sucesso('Solicitação de encerramento realizada com sucesso');
        dispatch(setAtualizarPlanoAEEDados(resposta?.data));
      }
    }
  };

  const onClickSalvarPlano = async () => {
    dispatch(setExibirLoaderPlanoAEE(true));
    const resposta = await ServicoPlanoAEE.salvarParecerPAAI()
      .catch(e => erros(e))
      .finally(() => dispatch(setExibirLoaderPlanoAEE(false)));

    if (resposta?.data) {
      sucesso('Plano salvo com sucesso');
      limparParecer();
      history.push(RotasDto.RELATORIO_AEE_PLANO);
    }
  };

  const onClickDevolver = () => dispatch(setExibirModalDevolverPlanoAEE(true));

  return (
    <>
      <Button
        id="btn-voltar"
        label="Voltar"
        icon="arrow-left"
        color={Colors.Azul}
        border
        className="mr-2"
        onClick={onClickVoltar}
      />
      <Button
        id="btn-cancelar"
        label="Cancelar"
        color={Colors.Roxo}
        border
        className="mr-3"
        onClick={onClickCancelar}
        disabled={desabilitarBotaoCancelar}
      />
      <Button
        id="btn-salvar"
        label={labelBotaoSalvar}
        color={Colors.Azul}
        border
        bold
        onClick={onClickSalvar}
        disabled={desabilitarBotaoSalvar}
      />

      <Button
        id="btn-solicitar-encerramento"
        label="Solicitar encerramento"
        color={Colors.Roxo}
        bold
        className="ml-3"
        onClick={onClickSolicitarEncerramento}
        hidden={
          !planoAEEDados?.situacao ||
          (planoAEEDados?.situacao !== situacaoPlanoAEE.Validado &&
            planoAEEDados?.situacao !== situacaoPlanoAEE.Expirado &&
            planoAEEDados?.situacao !== situacaoPlanoAEE.Reestruturado)
        }
        disabled={
          desabilitarCamposPlanoAEE ||
          questionarioDinamicoEmEdicao ||
          !permissoesTela?.podeAlterar
        }
      />

      <Button
        id="btn-devolver-plano"
        label="Devolver"
        color={Colors.Roxo}
        bold
        className="ml-3"
        onClick={onClickDevolver}
        hidden={!planoAEEDados?.podeDevolverPlanoAEE}
        disabled={
          desabilitarCamposPlanoAEE ||
          questionarioDinamicoEmEdicao ||
          !permissoesTela?.podeAlterar
        }
      />

      <Button
        id="btn-salvar-plano"
        label="Salvar plano"
        color={Colors.Roxo}
        bold
        className="ml-3"
        onClick={onClickSalvarPlano}
        hidden={
          !planoAEEDados?.situacao ||
          planoAEEDados?.situacao !== situacaoPlanoAEE.ParecerPAAI
        }
        disabled={
          !dadosParecer?.podeEditarParecerPAAI ||
          desabilitarCamposPlanoAEE ||
          questionarioDinamicoEmEdicao ||
          !parecerEmEdicao ||
          !permissoesTela?.podeAlterar
        }
      />
    </>
  );
};

BotoesAcoesPlanoAEE.propTypes = {
  match: PropTypes.oneOfType([PropTypes.object]),
};

BotoesAcoesPlanoAEE.defaultProps = {
  match: {},
};

export default BotoesAcoesPlanoAEE;
