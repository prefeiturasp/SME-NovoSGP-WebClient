import { Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Colors } from '~/componentes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_ALTERAR_CADASTRAR,
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_ENCERRAR_ENCAMINHAMENTO_NAAPA,
  SGP_BUTTON_PROXIMO_PASSO,
  SGP_BUTTON_SALVAR_RASCUNHO,
} from '~/constantes/ids/button';
import {
  verificaSomenteConsulta,
  confirmar,
  sucesso,
  erros,
  setBreadcrumbManual,
  erro,
} from '~/servicos';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import { ROUTES } from '@/core/enum/routes';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';
import {
  setCarregarDadosEncaminhamentoNAAPA,
  setDesabilitarCamposEncaminhamentoNAAPA,
  setExibirModalEncerramentoEncaminhamentoNAAPA,
} from '~/redux/modulos/encaminhamentoNAAPA/actions';
import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import situacaoNAAPA from '~/dtos/situacaoNAAPA';
import BtnImpressaoEncaminhamentoNAAPA from '../componentes/btnImpressaoNAAPA';
import BtnReabrirEncaminhamentoNAAPA from './componentes/reabrir';

const CadastroEncaminhamentoNAAPABotoesAcao = props => {
  const { mostrarBusca, setMostrarBusca } = props;

  const { id } = useParams();
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const aluno = useSelector(state => state.localizarEstudante.aluno);

  const usuario = useSelector(state => state.usuario);

  const dadosRouteState = state;

  const permissoesTela = usuario.permissoes[ROUTES.ENCAMINHAMENTO_NAAPA];

  const questionarioDinamicoEmEdicao = useSelector(
    store => store.questionarioDinamico.questionarioDinamicoEmEdicao
  );

  const desabilitarCamposEncaminhamentoNAAPA = useSelector(
    store => store.encaminhamentoNAAPA.desabilitarCamposEncaminhamentoNAAPA
  );

  const dadosSituacao = useSelector(
    state => state.encaminhamentoNAAPA.dadosSituacaoEncaminhamentoNAAPA
  );

  const encaminhamentoId = id;

  const desabilitarProximoPasso =
    desabilitarCamposEncaminhamentoNAAPA || !aluno?.codigoAluno;

  useEffect(() => {
    if (pathname && encaminhamentoId) {
      setBreadcrumbManual(
        pathname,
        'Encaminhamento',
        `${ROUTES.ENCAMINHAMENTO_NAAPA}`
      );
    }
  }, [pathname, encaminhamentoId]);

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(permissoesTela);
    const desabilitar =
      encaminhamentoId > 0
        ? soConsulta || !permissoesTela.podeAlterar
        : soConsulta || !permissoesTela.podeIncluir;
    dispatch(setDesabilitarCamposEncaminhamentoNAAPA(desabilitar));
  }, [encaminhamentoId, permissoesTela, dispatch]);

  const onClickProximoPasso = () => {
    ServicoNAAPA.existeEncaminhamentoAtivo(aluno?.codigoAluno)
      .then(resposta => {
        if (resposta.data) {
          erro('Existe encaminhamento ativo para este estudante');
        } else {
          setMostrarBusca(false);
        }
      })
      .catch(e => erros(e));
  };

  const onClickVoltar = async () => {
    if (questionarioDinamicoEmEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );

      if (confirmou) {
        const resposta = await ServicoNAAPA.salvarPadrao(encaminhamentoId);
        if (resposta?.status === 200) navigate(ROUTES.ENCAMINHAMENTO_NAAPA);
      } else {
        navigate(ROUTES.ENCAMINHAMENTO_NAAPA, { state: dadosRouteState });
      }
    } else {
      navigate(ROUTES.ENCAMINHAMENTO_NAAPA, { state: dadosRouteState });
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
        navigate(ROUTES.ENCAMINHAMENTO_NAAPA, { state: dadosRouteState });
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
    const resposta = await ServicoNAAPA.salvarPadrao(
      encaminhamentoId,
      true,
      situacaoNAAPA.Rascunho
    );
    if (resposta?.status === 200) {
      if (encaminhamentoId) {
        dispatch(setCarregarDadosEncaminhamentoNAAPA(true));
      }
      navigate(`${ROUTES.ENCAMINHAMENTO_NAAPA}/${resposta?.data?.id}`, {
        state: dadosRouteState,
      });
    }
  };

  const onClickCadastrarAlterar = async () => {
    const resposta = await ServicoNAAPA.salvarPadrao(
      encaminhamentoId,
      true,
      encaminhamentoId && !dadosSituacao?.situacao === situacaoNAAPA.Rascunho
        ? dadosSituacao?.situacao
        : situacaoNAAPA.AguardandoAtendimento
    );
    if (resposta?.status === 200) {
      navigate(ROUTES.ENCAMINHAMENTO_NAAPA, { state: dadosRouteState });
    }
  };

  const onClickEncerrar = () =>
    dispatch(setExibirModalEncerramentoEncaminhamentoNAAPA(true));

  const ocultarBtnRascunho =
    encaminhamentoId &&
    dadosSituacao?.situacao &&
    dadosSituacao?.situacao !== situacaoNAAPA.Rascunho;

  const exibirBtnEncerrar =
    encaminhamentoId &&
    dadosSituacao?.situacao &&
    (dadosSituacao?.situacao === situacaoNAAPA.AguardandoAtendimento ||
      dadosSituacao?.situacao === situacaoNAAPA.EmAtendimento);

  const labelBtnCadastrarAlterar = ocultarBtnRascunho ? 'Alterar' : 'Cadastrar';

  const disabledBtnDefault =
    desabilitarCamposEncaminhamentoNAAPA || !questionarioDinamicoEmEdicao;

  const disabledBtnExcluir =
    !permissoesTela?.podeExcluir ||
    !encaminhamentoId ||
    (dadosSituacao?.situacao !== situacaoNAAPA.Rascunho &&
      dadosSituacao?.situacao !== situacaoNAAPA.AguardandoAtendimento);

  const disabledCadastrarAlterar =
    desabilitarCamposEncaminhamentoNAAPA ||
    !permissoesTela?.podeAlterar ||
    (encaminhamentoId &&
      !questionarioDinamicoEmEdicao &&
      dadosSituacao?.situacao !== situacaoNAAPA.Rascunho);

  const disabledRascunho =
    desabilitarCamposEncaminhamentoNAAPA ||
    (encaminhamentoId &&
      !questionarioDinamicoEmEdicao &&
      dadosSituacao?.situacao === situacaoNAAPA.Rascunho);

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>
      <Col>
        <BtnImpressaoEncaminhamentoNAAPA
          idsSelecionados={encaminhamentoId ? [encaminhamentoId] : []}
        />
      </Col>
      {mostrarBusca ? (
        <Col>
          <Button
            bold
            border
            color={Colors.Roxo}
            label="Próximo passo"
            disabled={desabilitarProximoPasso}
            onClick={() => onClickProximoPasso()}
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

          <BtnReabrirEncaminhamentoNAAPA />

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
                onClick={() => onClickSalvarRascunho()}
                disabled={disabledRascunho}
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
              onClick={() => onClickCadastrarAlterar()}
              disabled={disabledCadastrarAlterar}
            />
          </Col>

          {exibirBtnEncerrar && (
            <Col>
              <Button
                bold
                border
                color={Colors.Roxo}
                label="Encerrar"
                id={SGP_BUTTON_ENCERRAR_ENCAMINHAMENTO_NAAPA}
                onClick={() => onClickEncerrar()}
                disabled={desabilitarCamposEncaminhamentoNAAPA}
              />
            </Col>
          )}
        </>
      )}
    </Row>
  );
};

export default CadastroEncaminhamentoNAAPABotoesAcao;
