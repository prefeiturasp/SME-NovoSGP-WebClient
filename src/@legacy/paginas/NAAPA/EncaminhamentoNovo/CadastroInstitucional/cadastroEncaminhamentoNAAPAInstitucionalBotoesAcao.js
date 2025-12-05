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
import ServicoEncaminhamentoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoEncaminhamentoNAAPA';
import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import ServicoEncaInstitucionalNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoEncaInstitucionalNAAPA';

export const CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao = ({
  formEncInstitucional,
  salvarEncaminhamento,
}) => {
  const { id } = useParams();
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const usuario = useSelector(state => state.usuario);

  const dadosRouteState = state;

  const permissoesTela = usuario?.permissoes?.[ROUTES.ENCAMINHAMENTO_NAAPA] || {};

  const encaminhamentoId = id;

  useEffect(() => {
    if (pathname && encaminhamentoId) {
      setBreadcrumbManual(
        pathname,
        'Encaminhamento Institucional',
        `${ROUTES.ENCAMINHAMENTO_NAAPA}`
      );
    }
  }, [pathname, encaminhamentoId]);

  const questionarioDinamicoEmEdicao = useSelector(
    store => store.questionarioDinamico.questionarioDinamicoEmEdicao
  );

  const onClickVoltar = async () => {
    const formTouched = formEncInstitucional?.isFieldsTouched?.() || false;
    const foiModificado = questionarioDinamicoEmEdicao || formTouched;

    if (foiModificado) {
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );

      if (confirmou) {
        const salvou = await salvarEncaminhamento();
        if (salvou) {
          navigate(ROUTES.ENCAMINHAMENTO_NAAPA, { state: dadosRouteState });
        }
      } else {
        navigate(ROUTES.ENCAMINHAMENTO_NAAPA, { state: dadosRouteState });
      }
    } else {
      navigate(ROUTES.ENCAMINHAMENTO_NAAPA, { state: dadosRouteState });
    }
  };

  const onClickExcluir = async () => {
    if (!encaminhamentoId) return;

    const confirmado = await confirmar(
      'Excluir',
      '',
      'Você tem certeza que deseja excluir este encaminhamento institucional?'
    );

    if (confirmado) {
      const resultado = await ServicoEncaminhamentoNAAPA.excluirEncaminhamento(
        encaminhamentoId
      ).catch(e => {
        erros(e);
      });

      if (resultado?.status === 200) {
        sucesso('Encaminhamento institucional excluído com sucesso');
        navigate(ROUTES.ENCAMINHAMENTO_NAAPA, {
          state: dadosRouteState,
        });
      }
    }
  };

  const onClickCancelar = async () => {
    const formTouched = formEncInstitucional?.isFieldsTouched?.() || false;
    const foiModificado = questionarioDinamicoEmEdicao || formTouched;

    if (foiModificado) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );

      if (confirmou) {
        // Limpa dados dinâmicos e arquivos temporários
        QuestionarioDinamicoFuncoes.limparDadosOriginaisQuestionarioDinamico(
          ServicoEncaInstitucionalNAAPA.removerArquivoInstitucional
        );

        if (encaminhamentoId) {
          window.location.reload();
        } else {
          formEncInstitucional.resetFields();
        }
      }
    }
  };

  const onClickCadastrarAlterar = async () => {
    const salvou = await salvarEncaminhamento();

    if (salvou) {
      navigate(ROUTES.ENCAMINHAMENTO_NAAPA, { state: dadosRouteState });
    }
  };

  const labelBtnCadastrarAlterar = encaminhamentoId ? 'Alterar' : 'Cadastrar';

  const disabledBtnExcluir = !permissoesTela?.podeExcluir || !encaminhamentoId;

  const disabledCadastrarAlterar = false;

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
          disabled={disabledCadastrarAlterar}
        />
      </Col>
    </Row>
  );
};

export default CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao;
