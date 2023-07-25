import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '~/componentes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import {
  SGP_BUTTON_ATRIBUIR,
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_DEVOLVER,
  SGP_BUTTON_SALVAR,
} from '~/constantes/ids/button';
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
import { confirmar, erros, sucesso, verificaSomenteConsulta } from '~/servicos';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';
import ModalImpressaoPlano from './ModalImpressaoPlano/modalImpressaoPlano';
import { useNavigate, useParams } from 'react-router-dom';

const BotoesAcoesPlanoAEE = () => {
  const navigate = useNavigate();
  const paramsRoute = useParams();

  const planoId = paramsRoute?.id;

  const questionarioDinamicoEmEdicao = useSelector(
    store => store.questionarioDinamico.questionarioDinamicoEmEdicao
  );

  const desabilitarCamposPlanoAEE = useSelector(
    store => store.planoAEE.desabilitarCamposPlanoAEE
  );

  const perfilSelecionado = useSelector(
    store => store.perfil.perfilSelecionado.nomePerfil
  );

  const registroCadastradoEmOutraUE = useSelector(
    store => store.planoAEE.planoAEEDados?.registroCadastradoEmOutraUE
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

  const labelBotaoSalvar = !planoId ? 'Salvar plano' : 'Alterar plano';

  const desabilitarBotaoSalvar =
    planoAEEDados?.situacao !== situacaoPlanoAEE.Expirado &&
    (desabilitarCamposPlanoAEE ||
      !planoAEEDados?.questionarioId ||
      (planoId && !questionarioDinamicoEmEdicao));

  const desabilitarBotaoCancelar =
    desabilitarCamposPlanoAEE ||
    !(questionarioDinamicoEmEdicao || parecerEmEdicao);

  const dispatch = useDispatch();

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(permissoesTela);
    const desabilitar =
      planoId > 0
        ? soConsulta ||
          !permissoesTela.podeAlterar ||
          registroCadastradoEmOutraUE
        : soConsulta || !permissoesTela.podeIncluir;

    dispatch(setDesabilitarCamposPlanoAEE(desabilitar));
  }, [planoId, permissoesTela, registroCadastradoEmOutraUE, dispatch]);

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
      navigate(RotasDto.RELATORIO_AEE_PLANO);
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

        if (salvou) {
          let mensagem = 'Registro salvo com sucesso';
          if (planoId) {
            mensagem = 'Registro alterado com sucesso';
          }
          sucesso(mensagem);
          navigate(RotasDto.RELATORIO_AEE_PLANO);
        }
      } else {
        limparParecer();
        navigate(RotasDto.RELATORIO_AEE_PLANO);
      }
    } else {
      navigate(RotasDto.RELATORIO_AEE_PLANO);
    }
  };

  const onClickExcluir = async () => {
    const confirmado = await confirmar(
      'Excluir',
      '',
      'Você tem certeza que deseja excluir este plano?'
    );
    if (confirmado) {
      const resultado = await ServicoPlanoAEE.excluirPlano(
        planoAEEDados?.id
      ).catch(e => {
        erros(e);
      });
      if (resultado && resultado.status === 200) {
        sucesso('Plano excluído com sucesso');
        navigate(RotasDto.RELATORIO_AEE_PLANO);
      }
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
    const id = await ServicoPlanoAEE.salvarPlano(true);
    const registroNovo = !planoId;

    if (id) {
      let mensagem = 'Registro alterado com sucesso';
      if (registroNovo) {
        mensagem = 'Registro salvo com sucesso';
      }
      sucesso(mensagem);

      dispatch(setQuestionarioDinamicoEmEdicao(false));
      if (registroNovo) {
        navigate(`${RotasDto.RELATORIO_AEE_PLANO}`);
      } else {
        dispatch(setAtualizarDados(true));
      }
    }
  };

  const onClickDevolver = () => dispatch(setExibirModalDevolverPlanoAEE(true));

  return (
    <>
      <BotaoVoltarPadrao className="mr-2" onClick={() => onClickVoltar()} />
      {planoId ? <ModalImpressaoPlano /> : <></>}
      <Button
        id={SGP_BUTTON_CANCELAR}
        label="Cancelar"
        color={Colors.Roxo}
        border
        className="mr-2"
        onClick={onClickCancelar}
        disabled={desabilitarBotaoCancelar}
      />
      <Button
        id={SGP_BUTTON_SALVAR}
        label={labelBotaoSalvar}
        color={Colors.Azul}
        border
        bold
        onClick={onClickSalvar}
        disabled={desabilitarBotaoSalvar}
      />
      {planoAEEDados?.permitirExcluir && (
        <BotaoExcluirPadrao
          className="ml-2"
          disabled={!permissoesTela || !planoAEEDados?.permitirExcluir}
          onClick={onClickExcluir}
        />
      )}
      <Button
        id={SGP_BUTTON_DEVOLVER}
        label="Devolver"
        color={Colors.Roxo}
        bold
        className="ml-2"
        onClick={onClickDevolver}
        hidden={!planoAEEDados?.podeDevolverPlanoAEE}
        disabled={
          desabilitarCamposPlanoAEE ||
          questionarioDinamicoEmEdicao ||
          !permissoesTela?.podeAlterar
        }
      />
      <Button
        id={
          !ehCP && situacaoAtribuicaoPAAI
            ? SGP_BUTTON_ATRIBUIR
            : SGP_BUTTON_SALVAR
        }
        label={
          !ehCP && situacaoAtribuicaoPAAI
            ? 'Atribuir responsável'
            : 'Salvar parecer'
        }
        color={Colors.Roxo}
        bold
        className="ml-2"
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

export default BotoesAcoesPlanoAEE;
