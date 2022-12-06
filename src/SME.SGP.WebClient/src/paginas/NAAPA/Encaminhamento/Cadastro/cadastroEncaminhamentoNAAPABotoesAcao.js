/* eslint-disable react/prop-types */
import { Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { Button, Colors } from '~/componentes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_ALTERAR_CADASTRAR,
  SGP_BUTTON_CANCELAR,
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

  const salvar = async novaSituacao => {
    const situacaoAtual =
      dadosEncaminhamentoNAAPA?.situacao || situacaoNAAPA.Rascunho;

    const situacaoSalvar = novaSituacao || situacaoAtual;

    const ehRascunho = situacaoSalvar === situacaoNAAPA.Rascunho;

    const validarCamposObrigatorios = !ehRascunho;

    const resposta = await ServicoNAAPA.salvarEncaminhamento(
      encaminhamentoId,
      situacaoSalvar,
      validarCamposObrigatorios,
      ehRascunho
    );

    if (resposta?.status === 200) {
      let mensagem = ehRascunho
        ? 'Rascunho salvo com sucesso'
        : 'Registro cadastrado com sucesso';

      if (encaminhamentoId && situacaoAtual !== situacaoNAAPA.Rascunho) {
        mensagem = 'Registro alterado com sucesso';
      }
      sucesso(mensagem);
    }
    return resposta;
  };

  const onClickVoltar = async () => {
    if (questionarioDinamicoEmEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );

      if (confirmou) {
        const resposta = await salvar();
        if (resposta?.status === 200)
          history.push(RotasDto.ENCAMINHAMENTO_NAAPA);
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
      'Você tem certeza que deseja excluir este registro?'
    );
    if (confirmado) {
      const resultado = await ServicoNAAPA.excluirEncaminhamento(
        encaminhamentoId
      ).catch(e => {
        erros(e);
      });
      if (resultado?.status === 200) {
        sucesso('Encaminhamento excluído com sucesso');
        history.push(RotasDto.ENCAMINHAMENTO_NAAPA);
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
        QuestionarioDinamicoFuncoes.limparDadosOriginaisQuestionarioDinamico(
          ServicoNAAPA.removerArquivo
        );
      }
    }
  };

  const onClickSalvarRascunho = async () => {
    const resposta = await salvar(situacaoNAAPA.Rascunho);
    if (resposta?.status === 200) {
      history.push(`${RotasDto.ENCAMINHAMENTO_NAAPA}/${resposta?.data?.id}`);
    }
  };

  const onClickCadastrarAlterar = async () => {
    const resposta = await salvar(situacaoNAAPA.AguardandoAtendimento);
    if (resposta?.status === 200) {
      history.push(RotasDto.ENCAMINHAMENTO_NAAPA);
    }
  };

  const ocultarBtnRascunho =
    encaminhamentoId &&
    dadosEncaminhamentoNAAPA?.situacao &&
    dadosEncaminhamentoNAAPA?.situacao !== situacaoNAAPA.Rascunho;

  const labelBtnCadastrarAlterar = ocultarBtnRascunho ? 'Alterar' : 'Cadastrar';

  const disabledBtnDefault =
    desabilitarCamposEncaminhamentoNAAPA || !questionarioDinamicoEmEdicao;

  const disabledBtnExcluir =
    !permissoesTela?.podeExcluir ||
    !encaminhamentoId ||
    (dadosEncaminhamentoNAAPA?.situacao !== situacaoNAAPA.Rascunho &&
      dadosEncaminhamentoNAAPA?.situacao !==
        situacaoNAAPA.AguardandoAtendimento);

  const disabledCadastrarAlterar =
    desabilitarCamposEncaminhamentoNAAPA ||
    !permissoesTela?.podeAlterar ||
    (encaminhamentoId &&
      !questionarioDinamicoEmEdicao &&
      dadosEncaminhamentoNAAPA?.situacao !== situacaoNAAPA.Rascunho);

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
              disabled={disabledBtnExcluir}
              onClick={() => onClickExcluir()}
            />
          </Col>

          <Col>
            <Button
              border
              label="Cancelar"
              color={Colors.Roxo}
              id={SGP_BUTTON_CANCELAR}
              disabled={disabledBtnDefault}
              onClick={() => onClickCancelar()}
            />
          </Col>

          {!ocultarBtnRascunho && (
            <Col>
              <Button
                bold
                border
                color={Colors.Azul}
                label="Salvar rascunho"
                id={SGP_BUTTON_SALVAR_RASCUNHO}
                onClick={onClickSalvarRascunho}
                disabled={desabilitarCamposEncaminhamentoNAAPA}
              />
            </Col>
          )}

          <Col>
            <Button
              bold
              border
              label={labelBtnCadastrarAlterar}
              color={Colors.Azul}
              id={SGP_BUTTON_ALTERAR_CADASTRAR}
              onClick={onClickCadastrarAlterar}
              disabled={disabledCadastrarAlterar}
            />
          </Col>
        </>
      )}
    </Row>
  );
};

export default CadastroEncaminhamentoNAAPABotoesAcao;
