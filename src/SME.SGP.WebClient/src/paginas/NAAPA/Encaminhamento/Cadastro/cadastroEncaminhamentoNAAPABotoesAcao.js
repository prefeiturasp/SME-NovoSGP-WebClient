/* eslint-disable react/prop-types */
import { Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { Button, Colors } from '~/componentes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_ENVIAR,
  SGP_BUTTON_PROXIMO_PASSO,
  SGP_BUTTON_SALVAR_RASCUNHO,
} from '~/constantes/ids/button';
import {
  history,
  verificaSomenteConsulta,
  confirmar,
  sucesso,
  erros,
} from '~/servicos';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import { RotasDto } from '~/dtos';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';
import { setDesabilitarCamposEncaminhamentoNAAPA } from '~/redux/modulos/encaminhamentoNAAPA/actions';
import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import situacaoNAAPA from '~/dtos/situacaoNAAPA';

const CadastroEncaminhamentoNAAPABotoesAcao = props => {
  const { mostrarBusca, setMostrarBusca } = props;

  const routeMatch = useRouteMatch();
  const dispatch = useDispatch();

  const aluno = useSelector(state => state.localizarEstudante.aluno);

  const usuario = useSelector(state => state.usuario);

  const permissoesTela = usuario.permissoes[RotasDto.ENCAMINHAMENTO_NAAPA];

  const questionarioDinamicoEmEdicao = useSelector(
    store => store.questionarioDinamico.questionarioDinamicoEmEdicao
  );

  const desabilitarCamposEncaminhamentoNAAPA = useSelector(
    store => store.encaminhamentoNAAPA.desabilitarCamposEncaminhamentoNAAPA
  );

  const dadosEncaminhamentoNAAPA = useSelector(
    state => state.encaminhamentoNAAPA.dadosEncaminhamentoNAAPA
  );

  const encaminhamentoId = routeMatch.params?.id;

  const desabilitarProximoPasso =
    desabilitarCamposEncaminhamentoNAAPA || !aluno?.codigoAluno;

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(permissoesTela);
    const desabilitar =
      encaminhamentoId > 0
        ? soConsulta || !permissoesTela.podeAlterar
        : soConsulta || !permissoesTela.podeIncluir;
    dispatch(setDesabilitarCamposEncaminhamentoNAAPA(desabilitar));
  }, [encaminhamentoId, permissoesTela, dispatch]);

  const onClickProximoPasso = () => {
    setMostrarBusca(false);
  };

  const onClickVoltar = async () => {
    if (questionarioDinamicoEmEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );

      if (confirmou) {
        const salvou = await ServicoNAAPA.salvarEncaminhamento();

        if (salvou) {
          let mensagem = 'Registro salvo com sucesso';
          if (encaminhamentoId) {
            mensagem = 'Registro alterado com sucesso';
          }
          sucesso(mensagem);
          history.push(RotasDto.ENCAMINHAMENTO_NAAPA);
        }
      } else {
        history.push(RotasDto.ENCAMINHAMENTO_NAAPA);
      }
    } else {
      history.push(RotasDto.ENCAMINHAMENTO_NAAPA);
    }
  };

  const onClickExcluir = async () => {
    const confirmado = await confirmar(
      'Excluir',
      '',
      'Você tem certeza que deseja excluir este encaminhamento?'
    );
    if (confirmado) {
      const resultado = await ServicoNAAPA.excluirEncaminhamento(
        encaminhamentoId
      ).catch(e => {
        erros(e);
      });
      if (resultado?.status === 200) {
        sucesso('Plano excluído com sucesso');
        history.push(RotasDto.RELATORIO_AEE_PLANO);
      }
    }
  };

  const onClickCancelar = async () => {
    if (!desabilitarCamposEncaminhamentoNAAPA && questionarioDinamicoEmEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        QuestionarioDinamicoFuncoes.limparDadosOriginaisQuestionarioDinamico();
      }
    }
  };

  const onClickSalvarRascunho = async () => {
    let situacao = situacaoNAAPA.Rascunho;

    if (encaminhamentoId) {
      // TODO - Validar com back se tem a prop situacao
      situacao = dadosEncaminhamentoNAAPA?.situacao;
    }

    const salvou = await ServicoNAAPA.salvarEncaminhamento(
      encaminhamentoId,
      situacao,
      true
    );
    if (salvou) {
      sucesso(`Rascunho salvo com sucesso`);
    }
  };

  const onClickEnviar = () => {};

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>

      {mostrarBusca ? (
        <Col>
          <Button
            bold
            border
            color={Colors.Roxo}
            label="Próximo passo"
            disabled={desabilitarProximoPasso}
            onClick={onClickProximoPasso}
            id={SGP_BUTTON_PROXIMO_PASSO}
          />
        </Col>
      ) : (
        <>
          <Col>
            <BotaoExcluirPadrao
              disabled={!permissoesTela?.podeExcluir || !encaminhamentoId}
              onClick={() => onClickExcluir()}
            />
          </Col>

          <Col>
            <Button
              border
              label="Cancelar"
              color={Colors.Roxo}
              id={SGP_BUTTON_CANCELAR}
              disabled={
                desabilitarCamposEncaminhamentoNAAPA ||
                !questionarioDinamicoEmEdicao
              }
              onClick={() => onClickCancelar()}
            />
          </Col>

          <Col>
            <Button
              bold
              border
              color={Colors.Azul}
              label="Salvar rascunho"
              id={SGP_BUTTON_SALVAR_RASCUNHO}
              onClick={onClickSalvarRascunho}
              disabled={
                desabilitarCamposEncaminhamentoNAAPA ||
                !questionarioDinamicoEmEdicao
              }
            />
          </Col>

          <Col>
            <Button
              hidden
              bold
              border
              label="Enviar"
              color={Colors.Azul}
              id={SGP_BUTTON_ENVIAR}
              onClick={onClickEnviar}
            />
          </Col>
        </>
      )}
    </Row>
  );
};

export default CadastroEncaminhamentoNAAPABotoesAcao;
