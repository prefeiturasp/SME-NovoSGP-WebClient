import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_IMPRIMIR,
  SGP_BUTTON_SALVAR,
} from '~/constantes/ids/button';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import { URL_HOME } from '~/constantes/url';
import {
  limparDadosPlanoAnual,
  setComponenteCurricularPlanoAnual,
  setExibirModalCopiarConteudo,
} from '~/redux/modulos/anual/actions';
import { confirmar, erros, sucesso } from '~/servicos';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import servicoSalvarPlanoAnual from '../../servicoSalvarPlanoAnual';
import ServicoPlanoAnual from '~/servicos/Paginas/ServicoPlanoAnual';
import { useNavigate } from 'react-router-dom';
import { MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO } from '@/@legacy/constantes';
import { HttpStatusCode } from 'axios';

const BotoesAcoesPlanoAnual = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const planoAnualEmEdicao = useSelector(
    store => store.planoAnual.planoAnualEmEdicao
  );

  const componenteCurricular = useSelector(
    store => store.planoAnual.componenteCurricular
  );

  const listaTurmasParaCopiar = useSelector(
    store => store.planoAnual.listaTurmasParaCopiar
  );

  const planejamentoAnualId = useSelector(
    store => store.planoAnual.planejamentoAnualId
  );

  const planoAnualSomenteConsulta = useSelector(
    store => store.planoAnual.planoAnualSomenteConsulta
  );

  const onSalvar = async () => {
    const salvou = await servicoSalvarPlanoAnual.validarSalvarPlanoAnual();
    return salvou;
  };

  const perguntaAoSalvar = async () => {
    return confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
  };

  const onClickVoltar = async () => {
    if (planoAnualEmEdicao && !planoAnualSomenteConsulta) {
      const confirmado = await perguntaAoSalvar();
      if (confirmado) {
        const salvou = await onSalvar();
        if (salvou) {
          navigate(URL_HOME);
        }
      } else {
        navigate(URL_HOME);
      }
    } else {
      navigate(URL_HOME);
    }
  };

  const onCancelar = async () => {
    if (planoAnualEmEdicao && !planoAnualSomenteConsulta) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        dispatch(limparDadosPlanoAnual());
        const componente = { ...componenteCurricular };
        dispatch(setComponenteCurricularPlanoAnual(componente));
      }
    }
  };

  const onImprimir = async () => {
    const resultado = await ServicoPlanoAnual.imprimirPlanoAnual({
      id: planejamentoAnualId,
    }).catch(e => erros(e));
    if (resultado?.status === HttpStatusCode.Ok)
      sucesso(MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO);
  };

  const abrirCopiarConteudo = async () => {
    dispatch(setExibirModalCopiarConteudo(true));
  };

  return (
    <>
      <Button
        id="btn-copiar-conteudo-plano-anual"
        label="Copiar Conteúdo"
        icon="share-square"
        color={Colors.Azul}
        className="mr-3"
        border
        onClick={abrirCopiarConteudo}
        disabled={
          !planejamentoAnualId ||
          ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ||
          planoAnualSomenteConsulta ||
          planoAnualEmEdicao ||
          !listaTurmasParaCopiar ||
          listaTurmasParaCopiar.length === 0
        }
      />
      <BotaoVoltarPadrao className="mr-2" onClick={() => onClickVoltar()} />
      <Button
        id={SGP_BUTTON_IMPRIMIR}
        icon="print"
        color={Colors.Azul}
        className="mr-2"
        semMargemDireita
        border
        onClick={onImprimir}
        disabled={!planejamentoAnualId}
      />
      <Button
        id={SGP_BUTTON_CANCELAR}
        label="Cancelar"
        color={Colors.Roxo}
        border
        className="mr-2"
        onClick={onCancelar}
        disabled={
          planoAnualSomenteConsulta ||
          ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ||
          !planoAnualEmEdicao
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
          planoAnualSomenteConsulta ||
          ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ||
          !planoAnualEmEdicao
        }
      />
    </>
  );
};

export default BotoesAcoesPlanoAnual;
