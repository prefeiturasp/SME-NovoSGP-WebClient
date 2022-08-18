import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '~/componentes';
import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import Button from '~/componentes/button';
import { RotasDto, situacaoPlanoAEE } from '~/dtos';
import {
  limparDadosParecer,
  setAtualizarDados,
  setAtualizarPlanoAEEDados,
  setDesabilitarCamposPlanoAEE,
  setExibirLoaderPlanoAEE,
  setExibirModalDevolverPlanoAEE,
  setParecerEmEdicao,
} from '~/redux/modulos/planoAEE/actions';
import { setQuestionarioDinamicoEmEdicao } from '~/redux/modulos/questionarioDinamico/actions';
import {
  confirmar,
  erros,
  history,
  sucesso,
  verificaSomenteConsulta,
} from '~/servicos';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';

const BotoesAcoesPlanoAEE = props => {
  const { match } = props;

  const questionarioDinamicoEmEdicao = useSelector(
    store => store.questionarioDinamico.questionarioDinamicoEmEdicao
  );

  const desabilitarCamposPlanoAEE = useSelector(
    store => store.planoAEE.desabilitarCamposPlanoAEE
  );

  const perfilSelecionado = useSelector(
    store => store.perfil.perfilSelecionado.nomePerfil
  );

  const dadosParecer = useSelector(store => store.planoAEE.dadosParecer);

  const parecerEmEdicao = useSelector(store => store.planoAEE.parecerEmEdicao);

  const planoAEEDados = useSelector(store => store.planoAEE.planoAEEDados);

  const dadosAtribuicaoResponsavel = useSelector(
    store => store.planoAEE.dadosAtribuicaoResponsavel
  );

  const [desabilitarBtnAcao, setDesabilitarBtnAcao] = useState(false);

  const usuario = useSelector(store => store.usuario);
  const permissoesTela = usuario.permissoes[RotasDto.RELATORIO_AEE_PLANO];

  const ehCP = perfilSelecionado === 'CP';

  const parecerCP = planoAEEDados?.situacao === situacaoPlanoAEE.ParecerCP;
  const parecerPAAI =
    planoAEEDados?.situacao === situacaoPlanoAEE.ParecerPAAI &&
    dadosParecer?.podeEditarParecerPAAI;
  const situacaoAtribuicaoPAAI =
    planoAEEDados?.situacao === situacaoPlanoAEE.AtribuicaoPAAI;

  const situacaoParecer =
    parecerCP ||
    (situacaoAtribuicaoPAAI && !dadosAtribuicaoResponsavel?.codigoRF);

  const planoAeeId = match?.params?.id || 0;
  const labelBotaoSalvar = !planoAeeId ? 'Salvar plano' : 'Alterar plano';

  const desabilitarBotaoSalvar =
    desabilitarCamposPlanoAEE || !questionarioDinamicoEmEdicao;

  const desabilitarBotaoCancelar =
    situacaoParecer || parecerPAAI
      ? !parecerEmEdicao
      : desabilitarCamposPlanoAEE || !questionarioDinamicoEmEdicao;

  const dispatch = useDispatch();

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(permissoesTela);
    const desabilitar =
      planoAeeId > 0
        ? soConsulta || !permissoesTela.podeAlterar
        : soConsulta || !permissoesTela.podeIncluir;
    dispatch(setDesabilitarCamposPlanoAEE(desabilitar));
  }, [planoAeeId, permissoesTela, dispatch]);

  const limparParecer = () => {
    dispatch(limparDadosParecer());
    dispatch(setParecerEmEdicao(false));
  };

  const escolherAcaoAbaParecer = async () => {
    setDesabilitarBtnAcao(true);
    let msg = '';
    let resposta = [];

    if (ehCP || situacaoParecer) {
      dispatch(setExibirLoaderPlanoAEE(true));
      resposta = await ServicoPlanoAEE.salvarParecerCP()
        .catch(e => erros(e))
        .catch(() => dispatch(setExibirLoaderPlanoAEE(false)));
      msg = 'Parecer realizado com sucesso';
    }

    if (!ehCP && situacaoAtribuicaoPAAI) {
      dispatch(setExibirLoaderPlanoAEE(true));
      resposta = await ServicoPlanoAEE.atribuirResponsavel()
        .catch(e => erros(e))
        .catch(() => dispatch(setExibirLoaderPlanoAEE(false)));
      msg = 'Atribuição do responsável realizada com sucesso';
    }

    if (!ehCP && parecerPAAI) {
      dispatch(setExibirLoaderPlanoAEE(true));
      resposta = await ServicoPlanoAEE.salvarParecerPAAI()
        .catch(e => erros(e))
        .catch(() => dispatch(setExibirLoaderPlanoAEE(false)));
      msg = 'Parecer realizado com sucesso';
    }

    if (resposta?.data) {
      sucesso(msg);
      limparParecer();
      history.push(RotasDto.RELATORIO_AEE_PLANO);
    }
    setDesabilitarBtnAcao(false);
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
          escolherAcaoAbaParecer();
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
        id="btn-acao-aba-parecer"
        label={
          !ehCP && situacaoAtribuicaoPAAI
            ? 'Atribuir responsável'
            : 'Salvar parecer'
        }
        color={Colors.Roxo}
        bold
        className="ml-3"
        onClick={escolherAcaoAbaParecer}
        hidden={
          planoAEEDados?.situacao !== situacaoPlanoAEE.ParecerCP &&
          planoAEEDados?.situacao !== situacaoPlanoAEE.AtribuicaoPAAI &&
          planoAEEDados?.situacao !== situacaoPlanoAEE.ParecerPAAI &&
          planoAEEDados?.situacao !== situacaoPlanoAEE.Devolvido
        }
        disabled={
          desabilitarBtnAcao ||
          (planoAEEDados?.situacao === situacaoPlanoAEE.ParecerPAAI &&
            !dadosParecer?.podeEditarParecerPAAI) ||
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
