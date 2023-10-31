import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Colors } from '~/componentes';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import {
  SGP_BUTTON_CANCELAR_ATENDIMENTO,
  SGP_BUTTON_EXCLUIR_ATENDIMENTO,
  SGP_BUTTON_SALVAR_ATENDIMENTO,
} from '~/constantes/ids/button';
import { ROUTES } from '@/core/enum/routes';
import { setExibirLoaderDrawerAtendimento } from '~/redux/modulos/encaminhamentoNAAPA/actions';
import { confirmar, erros, sucesso, verificaSomenteConsulta } from '~/servicos';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';

const DrawerAtendimentoBotoesAcao = ({
  onClickSalvar,
  onCloseDrawer,
  atendimentoId,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const usuario = useSelector(state => state.usuario);
  const questionarioDinamicoEmEdicao = useSelector(
    store => store.questionarioDinamico.questionarioDinamicoEmEdicao
  );

  const exibirLoaderDrawerAtendimento = useSelector(
    store => store.encaminhamentoNAAPA.exibirLoaderDrawerAtendimento
  );

  const desabilitarCamposEncaminhamentoNAAPA = useSelector(
    store => store.encaminhamentoNAAPA.desabilitarCamposEncaminhamentoNAAPA
  );

  const permissoesTela = usuario.permissoes[ROUTES.ENCAMINHAMENTO_NAAPA];

  const encaminhamentoNAAPAId = id;

  const soConsulta = verificaSomenteConsulta(permissoesTela);

  const podeExcluir =
    encaminhamentoNAAPAId && !!atendimentoId && permissoesTela?.podeExcluir;

  const podeIncluir =
    encaminhamentoNAAPAId && atendimentoId > 0
      ? permissoesTela?.podeAlterar
      : permissoesTela?.podeIncluir;

  const desabilitarCancelar =
    desabilitarCamposEncaminhamentoNAAPA ||
    soConsulta ||
    !questionarioDinamicoEmEdicao ||
    exibirLoaderDrawerAtendimento;

  const desabilitarSalvar =
    desabilitarCamposEncaminhamentoNAAPA ||
    !podeIncluir ||
    (atendimentoId > 0 && !questionarioDinamicoEmEdicao) ||
    exibirLoaderDrawerAtendimento;

  const onClickExcluir = async () => {
    if (!desabilitarCamposEncaminhamentoNAAPA) {
      const confirmado = await confirmar(
        'Excluir',
        '',
        'Deseja realmente excluir o atendimento?'
      );
      if (confirmado) {
        dispatch(setExibirLoaderDrawerAtendimento(true));

        const resultado = await ServicoNAAPA.excluirAtendimento(
          encaminhamentoNAAPAId,
          atendimentoId
        ).catch(e => {
          erros(e);
        });
        if (resultado?.status === 200) {
          onCloseDrawer({ atualizarDados: true });
          sucesso('Atendimento excluído com sucesso');
        }

        dispatch(setExibirLoaderDrawerAtendimento(false));
      }
    }
  };

  const onClickCancelar = async () => {
    if (questionarioDinamicoEmEdicao) {
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

  return (
    <Row gutter={[16]} type="flex" justify="end">
      {podeExcluir && (
        <Col>
          <BotaoExcluirPadrao
            onClick={() => onClickExcluir()}
            disabled={
              exibirLoaderDrawerAtendimento ||
              desabilitarCamposEncaminhamentoNAAPA
            }
            id={SGP_BUTTON_EXCLUIR_ATENDIMENTO}
          />
        </Col>
      )}

      <Col>
        <Button
          border
          label="Cancelar"
          color={Colors.Roxo}
          id={SGP_BUTTON_CANCELAR_ATENDIMENTO}
          disabled={desabilitarCancelar}
          onClick={() => onClickCancelar()}
        />
      </Col>

      <Col>
        <Button
          bold
          border
          label="Salvar"
          color={Colors.Azul}
          id={SGP_BUTTON_SALVAR_ATENDIMENTO}
          disabled={desabilitarSalvar}
          onClick={() => onClickSalvar()}
        />
      </Col>
    </Row>
  );
};

DrawerAtendimentoBotoesAcao.propTypes = {
  atendimentoId: PropTypes.number,
  onClickSalvar: PropTypes.func,
  onCloseDrawer: PropTypes.func,
};

DrawerAtendimentoBotoesAcao.defaultProps = {
  atendimentoId: 0,
  onClickSalvar: () => {},
  onCloseDrawer: () => {},
};

export default DrawerAtendimentoBotoesAcao;
