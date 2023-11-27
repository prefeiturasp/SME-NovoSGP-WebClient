import ButtonPrimary from '@/components/lib/button/primary';
import ButtonSecundary from '@/components/lib/button/secundary';
import { BuscaAtivaRegistroAcoesFormDto } from '@/core/dto/BuscaAtivaRegistroAcoesFormDto';
import { PermissaoAcoesDto } from '@/core/dto/PermissaoAcoes';
import { RegistroAcaoBuscaAtivaDto } from '@/core/dto/RegistroAcaoBuscaAtivaDto';
import { RegistroAcaoBuscaAtivaSecaoDto } from '@/core/dto/RegistroAcaoBuscaAtivaSecaoDto';
import { useAppSelector } from '@/core/hooks/use-redux';
import buscaAtivaService from '@/core/services/busca-ativa-service';
import { Col, Form, Row } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import { SGP_BUTTON_CANCELAR, SGP_BUTTON_SALVAR_ALTERAR } from '~/constantes/ids/button';
import {
  setDesabilitarCamposBuscaAtivaRegistroAcoes,
  setExibirLoaderBuscaAtivaRegistroAcoes,
  setLimparDadosBuscaAtivaRegistroAcoes,
} from '~/redux/modulos/buscaAtivaRegistroAcoes/actions';
import {
  setLimparDadosQuestionarioDinamico,
  setListaSecoesEmEdicao,
  setQuestionarioDinamicoEmEdicao,
} from '~/redux/modulos/questionarioDinamico/actions';
import { confirmar, setBreadcrumbManual, sucesso, verificaSomenteConsulta } from '~/servicos';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';

type BuscaAtivaRegistroAcoesFormBotoesAcaoProps = {
  permissoesTela: PermissaoAcoesDto;
  rotaPai: string;
};

const BuscaAtivaRegistroAcoesFormBotoesAcao: React.FC<
  BuscaAtivaRegistroAcoesFormBotoesAcaoProps
> = ({ permissoesTela, rotaPai }) => {
  const paramsRoute = useParams();
  const { pathname, state } = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = Form.useFormInstance();

  const questionarioDinamicoEmEdicao = useAppSelector(
    (store) => store.questionarioDinamico.questionarioDinamicoEmEdicao,
  );

  const dadosSecoesBuscaAtivaRegistroAcoes = useAppSelector(
    (store) => store.buscaAtivaRegistroAcoes.dadosSecoesBuscaAtivaRegistroAcoes,
  );

  const desabilitarCamposBuscaAtivaRegistroAcoes = useAppSelector(
    (store) => store.buscaAtivaRegistroAcoes.desabilitarCamposBuscaAtivaRegistroAcoes,
  );

  const registroAcaoId = paramsRoute?.id ? Number(paramsRoute.id) : 0;

  const labelBtnCadastrarAlterar = registroAcaoId ? 'Alterar' : 'Cadastrar';

  const disabledBtnDefault =
    desabilitarCamposBuscaAtivaRegistroAcoes || !questionarioDinamicoEmEdicao;

  const disabledBtnExcluir = !permissoesTela?.podeExcluir || !registroAcaoId;

  const disabledCadastrarAlterar = !!(
    desabilitarCamposBuscaAtivaRegistroAcoes ||
    !permissoesTela?.podeAlterar ||
    (registroAcaoId && !questionarioDinamicoEmEdicao)
  );

  useEffect(() => {
    if (pathname && registroAcaoId) {
      setBreadcrumbManual(pathname, 'Registro Ação', `${rotaPai}`);
    }
  }, [pathname, registroAcaoId, rotaPai]);

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(permissoesTela);
    const desabilitar =
      registroAcaoId > 0
        ? soConsulta || !permissoesTela.podeAlterar
        : soConsulta || !permissoesTela.podeIncluir;

    dispatch(setDesabilitarCamposBuscaAtivaRegistroAcoes(desabilitar));
  }, [registroAcaoId, permissoesTela, dispatch]);

  const onClickExcluir = async () => {
    const confirmado = await confirmar(
      'Excluir',
      '',
      'Você tem certeza que deseja excluir este registro?',
    );
    if (confirmado) {
      const resultado = await buscaAtivaService.excluirRegistroAcao(registroAcaoId);
      if (resultado?.sucesso) {
        sucesso('Registro excluído com sucesso');
        navigate(rotaPai, { state });
      }
    }
  };

  const onClickCancelar = async () => {
    if (!desabilitarCamposBuscaAtivaRegistroAcoes && questionarioDinamicoEmEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?',
      );
      if (confirmou) {
        QuestionarioDinamicoFuncoes.limparDadosOriginaisQuestionarioDinamico(
          ServicoNAAPA.removerArquivo,
        );
        form.resetFields();
      }
    }
  };

  const onClickCadastrarAlterar = async () => {
    const validarCamposObrigatorios = true;

    const formValues: BuscaAtivaRegistroAcoesFormDto = form.getFieldsValue(true);

    const secoesEncaminhamentoNAAPA = cloneDeep(dadosSecoesBuscaAtivaRegistroAcoes);

    const dadosMapeados: any = await QuestionarioDinamicoFuncoes.mapearQuestionarios(
      [secoesEncaminhamentoNAAPA],
      validarCamposObrigatorios,
      [],
    );

    const formsValidos = !!dadosMapeados?.formsValidos;

    if (formsValidos || dadosMapeados?.secoes?.length) {
      const secoesMapCloned: any = cloneDeep(dadosMapeados.secoes);

      let secoes: RegistroAcaoBuscaAtivaSecaoDto[] = [];

      if (secoesMapCloned?.length) {
        secoes = secoesMapCloned.map((secao: any) => {
          let questoes = [];

          if (secao?.questoes?.length) {
            questoes = secao.questoes.map((questao: any) => ({
              questaoId: questao?.questaoId,
              resposta: questao?.resposta,
              tipoQuestao: questao?.tipoQuestao,
              respostaRegistroAcaoId: questao?.respostaEncaminhamentoId || 0,
            }));
          }

          return { concluido: secao?.concluido, secaoId: secao?.secaoId, questoes };
        });
      }

      const paramsSalvar: RegistroAcaoBuscaAtivaDto = {
        id: registroAcaoId,
        turmaId: formValues?.turma?.id,
        alunoCodigo: formValues?.localizadorEstudante?.codigo,
        alunoNome: formValues?.localizadorEstudante?.nome,
        secoes,
      };

      if (registroAcaoId) {
        paramsSalvar.id = registroAcaoId;
      }

      dispatch(setExibirLoaderBuscaAtivaRegistroAcoes(true));

      const resposta = await buscaAtivaService.salvarAtualizarRegistroAcao(paramsSalvar);

      if (resposta.sucesso) {
        dispatch(setQuestionarioDinamicoEmEdicao(false));
        dispatch(setListaSecoesEmEdicao([]));
        dispatch(setLimparDadosBuscaAtivaRegistroAcoes());
        dispatch(setLimparDadosQuestionarioDinamico());

        let mensagem = 'Registro cadastrado com sucesso';

        if (registroAcaoId) {
          mensagem = 'Registro alterado com sucesso';
        }
        sucesso(mensagem);

        navigate(rotaPai, { state });
      }

      setTimeout(() => {
        dispatch(setExibirLoaderBuscaAtivaRegistroAcoes(false));
      }, 1000);
    }
  };

  const onClickVoltar = async () => {
    if (questionarioDinamicoEmEdicao || form.isFieldsTouched()) {
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?',
      );

      if (confirmou) {
        onClickCadastrarAlterar();
      } else {
        navigate(rotaPai, { state });
      }
    } else {
      navigate(rotaPai, { state });
    }
  };

  return (
    <Row gutter={[8, 8]}>
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>

      {registroAcaoId ? (
        <Col>
          <BotaoExcluirPadrao onClick={() => onClickExcluir()} disabled={disabledBtnExcluir} />
        </Col>
      ) : (
        <></>
      )}

      <Col>
        <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
          {() => (
            <ButtonSecundary
              id={SGP_BUTTON_CANCELAR}
              onClick={() => onClickCancelar()}
              disabled={disabledBtnDefault || !form.isFieldsTouched()}
            >
              Cancelar
            </ButtonSecundary>
          )}
        </Form.Item>
      </Col>

      <Col>
        <ButtonPrimary
          id={SGP_BUTTON_SALVAR_ALTERAR}
          onClick={() => onClickCadastrarAlterar()}
          disabled={disabledCadastrarAlterar}
        >
          {labelBtnCadastrarAlterar}
        </ButtonPrimary>
      </Col>
    </Row>
  );
};

export default BuscaAtivaRegistroAcoesFormBotoesAcao;
