import QuestionarioDinamicoFuncoes from '@/@legacy/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import { confirmar } from '@/@legacy/servicos';
import { ROUTES } from '@/core/enum/routes';
import { useAppSelector } from '@/core/hooks/use-redux';
import mapeamentoEstudantesService from '@/core/services/mapeamento-estudantes-service';
import { Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import BotaoCancelarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoCancelarPadrao';
import BotaoSalvarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoSalvarPadrao';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';

export const BotoesAcoesMapeamentoEstudantes = () => {
  const navigate = useNavigate();

  const estudantesMapeamentoEstudantes = useAppSelector(
    (store) => store.mapeamentoEstudantes?.estudantesMapeamentoEstudantes,
  );

  const desabilitarCamposMapeamentoEstudantes = useAppSelector(
    (store) => store.mapeamentoEstudantes?.desabilitarCamposMapeamentoEstudantes,
  );

  const questionarioDinamicoEmEdicao = useAppSelector(
    (store) => store.questionarioDinamico?.questionarioDinamicoEmEdicao,
  );

  const disabledBtnDefault = desabilitarCamposMapeamentoEstudantes || !questionarioDinamicoEmEdicao;

  const onClickSalvar = () => mapeamentoEstudantesService.salvar(false, true);

  const onClickVoltar = async () => {
    if (questionarioDinamicoEmEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?',
      );

      if (confirmou) {
        const sucesso = await mapeamentoEstudantesService.salvar(false, false, false);

        if (sucesso) {
          navigate(ROUTES.PRINCIPAL);
        }
      } else {
        navigate(ROUTES.PRINCIPAL);
      }
    } else {
      navigate(ROUTES.PRINCIPAL);
    }
  };

  const onClickCancelar = async () => {
    if (!desabilitarCamposMapeamentoEstudantes && questionarioDinamicoEmEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?',
      );
      if (confirmou) {
        QuestionarioDinamicoFuncoes.limparDadosOriginaisQuestionarioDinamico();
      }
    }
  };

  return (
    <Row gutter={[8, 8]}>
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>
      <Col>
        <BotaoCancelarPadrao
          onClick={() => onClickCancelar()}
          disabled={disabledBtnDefault || !estudantesMapeamentoEstudantes?.length}
        />
      </Col>
      <Col>
        <BotaoSalvarPadrao onClick={() => onClickSalvar()} disabled={disabledBtnDefault} />
      </Col>
    </Row>
  );
};
