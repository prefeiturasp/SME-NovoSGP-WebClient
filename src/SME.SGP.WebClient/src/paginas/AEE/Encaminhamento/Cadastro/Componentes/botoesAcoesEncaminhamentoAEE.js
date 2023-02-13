import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_CONCLUIR_PARECER,
  SGP_BUTTON_DEVOLVER,
  SGP_BUTTON_ENCAMINHAR,
  SGP_BUTTON_ENVIAR,
  SGP_BUTTON_INDEFERIR,
  SGP_BUTTON_SALVAR_RASCUNHO,
} from '~/constantes/ids/button';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import { RotasDto } from '~/dtos';
import situacaoAEE from '~/dtos/situacaoAEE';
import {
  setExibirLoaderEncaminhamentoAEE,
  setExibirModalDevolverAEE,
  setExibirModalEncerramentoEncaminhamentoAEE,
} from '~/redux/modulos/encaminhamentoAEE/actions';
import { confirmar, erros, sucesso } from '~/servicos';
import history from '~/servicos/history';
import ServicoEncaminhamentoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoEncaminhamentoAEE';
import BotaoGerarRelatorioEncaminhamentoAEE from '../../BotaoGerarRelatorioEncaminhamentoAEE';

const BotoesAcoesEncaminhamentoAEE = props => {
  const { match } = props;

  const dispatch = useDispatch();

  const questionarioDinamicoEmEdicao = useSelector(
    store => store.questionarioDinamico.questionarioDinamicoEmEdicao
  );

  const dadosEncaminhamento = useSelector(
    store => store.encaminhamentoAEE.dadosEncaminhamento
  );

  const dadosCollapseLocalizarEstudante = useSelector(
    store => store.collapseLocalizarEstudante.dadosCollapseLocalizarEstudante
  );

  const desabilitarCamposEncaminhamentoAEE = useSelector(
    store => store.encaminhamentoAEE.desabilitarCamposEncaminhamentoAEE
  );

  const [desabilitarBtnAcao, setDesabilitarBtnAcao] = useState(false);

  const usuario = useSelector(store => store.usuario);
  const permissoesTela =
    usuario.permissoes[RotasDto.RELATORIO_AEE_ENCAMINHAMENTO];

  const onClickSalvarRascunho = async () => {
    const encaminhamentoId = match?.params?.id;
    let situacao = situacaoAEE.Rascunho;

    if (encaminhamentoId) {
      situacao = dadosEncaminhamento?.situacao;
    }

    const salvou = await ServicoEncaminhamentoAEE.salvarEncaminhamento(
      encaminhamentoId,
      situacao,
      false,
      false,
      true
    );
    if (salvou) {
      sucesso(`Rascunho salvo com sucesso`);
    }
  };

  const onClickEnviar = async () => {
    const encaminhamentoId = match?.params?.id;
    const salvou = await ServicoEncaminhamentoAEE.salvarEncaminhamento(
      encaminhamentoId,
      situacaoAEE.Encaminhado,
      true,
      true
    );
    if (salvou) {
      sucesso('Encaminhamento enviado para validação do CP');
      history.push(RotasDto.RELATORIO_AEE_ENCAMINHAMENTO);
    }
  };

  const onClickVoltar = async () => {
    if (questionarioDinamicoEmEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );
      if (confirmou) {
        const encaminhamentoId = match?.params?.id;
        let situacao = situacaoAEE.Rascunho;

        if (encaminhamentoId) {
          situacao = dadosEncaminhamento?.situacao;
        }
        const salvou = await ServicoEncaminhamentoAEE.salvarEncaminhamento(
          encaminhamentoId,
          situacao,
          false
        );
        if (salvou) {
          sucesso(`Rascunho salvo com sucesso`);
          history.push(RotasDto.RELATORIO_AEE_ENCAMINHAMENTO);
        }
      } else {
        history.push(RotasDto.RELATORIO_AEE_ENCAMINHAMENTO);
      }
    } else if (
      match?.params?.id &&
      dadosEncaminhamento?.situacao === situacaoAEE.Rascunho
    ) {
      const confirmou = await confirmar(
        'Atenção',
        '',
        `Você salvou o encaminhamento como rascunho. Para dar andamento ao encaminhamento você precisa clicar em "Enviar", deseja realmente sair da tela?`
      );
      if (confirmou) {
        history.push(RotasDto.RELATORIO_AEE_ENCAMINHAMENTO);
      }
    } else {
      history.push(RotasDto.RELATORIO_AEE_ENCAMINHAMENTO);
    }
  };

  const onClickExcluir = async () => {
    const encaminhamentoId = match?.params?.id;
    if (permissoesTela.podeExcluir && encaminhamentoId) {
      const confirmado = await confirmar(
        'Excluir',
        '',
        'Você tem certeza que deseja excluir este registro?'
      );

      if (confirmado) {
        dispatch(setExibirLoaderEncaminhamentoAEE(true));
        const resposta = await ServicoEncaminhamentoAEE.excluirEncaminhamento(
          encaminhamentoId
        )
          .catch(e => erros(e))
          .finally(() => dispatch(setExibirLoaderEncaminhamentoAEE(false)));

        if (resposta?.status === 200) {
          sucesso('Registro excluído com sucesso');
          history.push(RotasDto.RELATORIO_AEE_ENCAMINHAMENTO);
        }
      }
    }
  };

  const onClickDevolver = () => {
    dispatch(setExibirModalDevolverAEE(true));
  };

  const onClickEncerrar = async () => {
    if (!desabilitarCamposEncaminhamentoAEE) {
      const encaminhamentoId = match?.params?.id;
      const salvou = await ServicoEncaminhamentoAEE.salvarEncaminhamento(
        encaminhamentoId,
        situacaoAEE.Encaminhado,
        true
      );
      if (salvou) {
        dispatch(setExibirModalEncerramentoEncaminhamentoAEE(true));
      }
    }
  };

  const onClickEncaminharAEE = async () => {
    if (!desabilitarCamposEncaminhamentoAEE) {
      setDesabilitarBtnAcao(true);
      const encaminhamentoId = match?.params?.id;
      const salvou = await ServicoEncaminhamentoAEE.salvarEncaminhamento(
        encaminhamentoId,
        situacaoAEE.Encaminhado,
        true
      );
      if (salvou) {
        dispatch(setExibirLoaderEncaminhamentoAEE(true));
        const resposta = await ServicoEncaminhamentoAEE.enviarParaAnaliseEncaminhamento(
          encaminhamentoId
        )
          .catch(e => erros(e))
          .finally(() => dispatch(setExibirLoaderEncaminhamentoAEE(false)));

        if (resposta?.status === 200) {
          sucesso('Encaminhamento enviado para a AEE');
          history.push(RotasDto.RELATORIO_AEE_ENCAMINHAMENTO);
        }
      }
      setDesabilitarBtnAcao(false);
    }
  };

  const onClickConcluirParecer = async () => {
    if (!desabilitarCamposEncaminhamentoAEE) {
      const encaminhamentoId = match?.params?.id;
      const salvou = await ServicoEncaminhamentoAEE.salvarEncaminhamento(
        encaminhamentoId,
        situacaoAEE.Analise,
        true
      );
      if (salvou) {
        dispatch(setExibirLoaderEncaminhamentoAEE(true));
        const resposta = await ServicoEncaminhamentoAEE.concluirEncaminhamento(
          encaminhamentoId
        )
          .catch(e => erros(e))
          .finally(() => dispatch(setExibirLoaderEncaminhamentoAEE(false)));

        if (resposta?.status === 200) {
          sucesso('Encaminhamento concluído');
          history.push(RotasDto.RELATORIO_AEE_ENCAMINHAMENTO);
        }
      }
    }
  };

  const ocultarBtnExcluir =
    (dadosEncaminhamento?.situacao !== situacaoAEE.Encaminhado &&
      dadosEncaminhamento?.situacao !== situacaoAEE.Rascunho) ||
    !(permissoesTela.podeExcluir && dadosEncaminhamento?.podeEditar);

  const ocultarBtnEnviar =
    dadosEncaminhamento?.situacao &&
    dadosEncaminhamento?.situacao !== situacaoAEE.Rascunho &&
    dadosEncaminhamento?.situacao !== situacaoAEE.Devolvido;

  const ocultarBtnDevolver =
    dadosEncaminhamento?.situacao !== situacaoAEE.Encaminhado;

  const ocultarBtnIndeferir =
    !dadosEncaminhamento?.situacao ||
    dadosEncaminhamento?.situacao !== situacaoAEE.Encaminhado;

  const ocultarBtnEncaminhar =
    !dadosEncaminhamento?.situacao ||
    dadosEncaminhamento?.situacao !== situacaoAEE.Encaminhado;

  const ocultarBtnConcluirParecer =
    !dadosEncaminhamento?.situacao ||
    dadosEncaminhamento?.situacao !== situacaoAEE.Analise;

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>
      {!ocultarBtnExcluir && (
        <Col>
          <BotaoExcluirPadrao onClick={onClickExcluir} />
        </Col>
      )}
      <Col>
        <Button
          id={SGP_BUTTON_SALVAR_RASCUNHO}
          label="Salvar rascunho"
          color={Colors.Azul}
          border
          bold
          onClick={onClickSalvarRascunho}
          disabled={
            desabilitarCamposEncaminhamentoAEE ||
            !questionarioDinamicoEmEdicao ||
            (match?.params?.id && !dadosEncaminhamento?.podeEditar) ||
            (match?.params?.id &&
              dadosEncaminhamento?.situacao !== situacaoAEE.Rascunho &&
              dadosEncaminhamento?.situacao !== situacaoAEE.Deferido)
          }
        />
      </Col>
      {!ocultarBtnEnviar && (
        <Col>
          <Button
            id={SGP_BUTTON_ENVIAR}
            label="Enviar"
            color={Colors.Roxo}
            border
            bold
            onClick={onClickEnviar}
            disabled={
              !dadosCollapseLocalizarEstudante?.codigoAluno ||
              desabilitarCamposEncaminhamentoAEE
            }
          />
        </Col>
      )}
      {!ocultarBtnDevolver && (
        <Col>
          <Button
            id={SGP_BUTTON_DEVOLVER}
            label="Devolver"
            color={Colors.Azul}
            border
            bold
            onClick={onClickDevolver}
            disabled={
              desabilitarCamposEncaminhamentoAEE ||
              !dadosEncaminhamento?.podeEditar
            }
          />
        </Col>
      )}
      {!ocultarBtnIndeferir && (
        <Col>
          <Button
            id={SGP_BUTTON_INDEFERIR}
            label="Indeferir"
            color={Colors.Azul}
            border
            bold
            onClick={onClickEncerrar}
            disabled={
              desabilitarCamposEncaminhamentoAEE ||
              !dadosEncaminhamento?.podeEditar
            }
          />
        </Col>
      )}
      {!ocultarBtnEncaminhar && (
        <Col>
          <Button
            id={SGP_BUTTON_ENCAMINHAR}
            label="Encaminhar AEE"
            color={Colors.Roxo}
            border
            bold
            onClick={onClickEncaminharAEE}
            disabled={
              desabilitarBtnAcao ||
              desabilitarCamposEncaminhamentoAEE ||
              !dadosEncaminhamento?.podeEditar
            }
          />
        </Col>
      )}
      {!ocultarBtnConcluirParecer && (
        <Col>
          <Button
            id={SGP_BUTTON_CONCLUIR_PARECER}
            label="Concluir parecer"
            color={Colors.Roxo}
            border
            bold
            onClick={onClickConcluirParecer}
            disabled={
              desabilitarCamposEncaminhamentoAEE ||
              !dadosEncaminhamento?.podeEditar
            }
          />
        </Col>
      )}
      <Col>
        <BotaoGerarRelatorioEncaminhamentoAEE
          disabled={!match?.params?.id}
          ids={[match?.params?.id]}
        />
      </Col>
    </Row>
  );
};

BotoesAcoesEncaminhamentoAEE.propTypes = {
  match: PropTypes.oneOfType([PropTypes.object]),
};

BotoesAcoesEncaminhamentoAEE.defaultProps = {
  match: {},
};

export default BotoesAcoesEncaminhamentoAEE;
