import { Col, Row } from 'antd';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Colors } from '~/componentes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_ALTERAR_CADASTRAR,
  SGP_BUTTON_CANCELAR,
} from '~/constantes/ids/button';
import {
  verificaSomenteConsulta,
  confirmar,
  sucesso,
  erros,
  setBreadcrumbManual,
} from '~/servicos';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import { ROUTES } from '@/core/enum/routes';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';
import { setDesabilitarCamposEncaminhamentoNAAPA } from '~/redux/modulos/encaminhamentoNAAPA/actions';
import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import situacaoNAAPA from '~/dtos/situacaoNAAPA';

export const CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao = ({
  formEncInstitucional,
}) => {
  const { id } = useParams();
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const usuario = useSelector(state => state.usuario);

  const dadosRouteState = state;

  const permissoesTela =
    usuario?.permissoes?.[ROUTES.ENCAMINHAMENTO_NAAPA_NOVO] || {};

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

  useEffect(() => {
    if (pathname && encaminhamentoId) {
      setBreadcrumbManual(
        pathname,
        'Encaminhamento',
        `${ROUTES.ENCAMINHAMENTO_NAAPA_NOVO}`
      );
    }
  }, [pathname, encaminhamentoId]);

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(permissoesTela);
    const desabilitar =
      encaminhamentoId > 0
        ? soConsulta || !permissoesTela?.podeAlterar
        : soConsulta || !permissoesTela?.podeIncluir;
  }, [encaminhamentoId, permissoesTela, dispatch]);

  const onClickVoltar = async () => {
    const confirmou = await confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );

    if (confirmou) {
      const resposta = await ServicoNAAPA.salvarPadrao(encaminhamentoId);
      if (resposta?.status === 200) navigate(ROUTES.ENCAMINHAMENTO_NAAPA_NOVO);
    } else {
      navigate(ROUTES.ENCAMINHAMENTO_NAAPA_NOVO, { state: dadosRouteState });
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
        navigate(ROUTES.ENCAMINHAMENTO_NAAPA_NOVO, {
          state: dadosRouteState,
        });
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

  const onClickCadastrarAlterar = async () => {
    const dadosFormulario = await formEncInstitucional.validateFields();
    console.log(
      'Dados do formulário ao clicar em Cadastrar/Alterar:',
      dadosFormulario
    );
    //   const resposta = await ServicoNAAPA.salvarPadrao(
    //     encaminhamentoId,
    //     true,
    //     encaminhamentoId && !dadosSituacao?.situacao === situacaoNAAPA.Rascunho
    //       ? dadosSituacao?.situacao
    //       : situacaoNAAPA.AguardandoAtendimento
    //   );
    //   if (resposta?.status === 200) {
    //     navigate(ROUTES.ENCAMINHAMENTO_NAAPA_NOVO, { state: dadosRouteState });
    //   }
  };

  const ocultarBtnRascunho =
    encaminhamentoId &&
    dadosSituacao?.situacao &&
    dadosSituacao?.situacao !== situacaoNAAPA.Rascunho;

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

  if (!permissoesTela) {
    return null;
  }

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>
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
      <Col>
        <Button
          bold
          border
          label={labelBtnCadastrarAlterar}
          color={Colors.Azul}
          id={SGP_BUTTON_ALTERAR_CADASTRAR}
          onClick={() => onClickCadastrarAlterar()}
          disabled={false}
          // disabled={false} disabledCadastrarAlterar
        />
      </Col>
    </Row>
  );
};

export default CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao;
