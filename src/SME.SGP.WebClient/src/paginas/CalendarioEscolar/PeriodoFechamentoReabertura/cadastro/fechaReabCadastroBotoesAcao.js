import { Col, Row } from 'antd';
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Colors } from '~/componentes';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_ALTERAR_CADASTRAR,
  SGP_BUTTON_CANCELAR,
} from '~/componentes-sgp/filtro/idsCampos';
import { RotasDto } from '~/dtos';
import {
  confirmar,
  erros,
  history,
  ServicoFechamentoReabertura,
  sucesso,
  verificaSomenteConsulta,
} from '~/servicos';
import FechaReabCadastroContext from './fechaReabCadastroContext';

const FechaReabCadastroBotoesAcao = () => {
  const {
    setEmEdicao,
    emEdicao,
    setExecutaResetarTela,
    refForm,
    valoresIniciaisPadrao,
    somenteConsulta,
    desabilitarCampos,
    setDesabilitarCampos,
    setSomenteConsulta,
    setExibirLoaderReabertura,
  } = useContext(FechaReabCadastroContext);

  const usuarioStore = useSelector(store => store.usuario);
  const permissoesTela =
    usuarioStore.permissoes[RotasDto.PERIODO_FECHAMENTO_REABERTURA];

  const paramsRota = useParams();

  const fechamentoReaberturaId = paramsRota?.id;
  const novoRegistro = !fechamentoReaberturaId;

  useEffect(() => {
    setSomenteConsulta(verificaSomenteConsulta(permissoesTela));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissoesTela]);

  useEffect(() => {
    const desabilitar = novoRegistro
      ? somenteConsulta || !permissoesTela.podeIncluir
      : somenteConsulta || !permissoesTela.podeAlterar;
    setDesabilitarCampos(desabilitar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [somenteConsulta, novoRegistro, permissoesTela]);

  const perguntaAoSalvar = async () => {
    return confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
  };

  const validaAntesDoSubmit = () => {
    setEmEdicao(true);
    const arrayCampos = Object.keys(valoresIniciaisPadrao);
    arrayCampos.forEach(campo => {
      refForm.setFieldTouched(campo, true, true);
    });
    refForm.validateForm().then(() => {
      if (Object.keys(refForm.state.errors).length === 0) {
        refForm.handleSubmit(e => e);
      }
    });
  };

  const onClickVoltar = async form => {
    if (emEdicao) {
      const confirmado = await perguntaAoSalvar();
      if (confirmado) {
        validaAntesDoSubmit(form);
      } else {
        history.push(RotasDto.PERIODO_FECHAMENTO_REABERTURA);
      }
    } else {
      history.push(RotasDto.PERIODO_FECHAMENTO_REABERTURA);
    }
  };

  const onClickCancelar = async () => {
    if (emEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        setExecutaResetarTela(true);
      }
    }
  };

  const onClickExcluir = async () => {
    if (!novoRegistro) {
      const confirmado = await confirmar(
        'Excluir Fechamento',
        '',
        'Deseja realmente excluir este fechamento?',
        'Excluir',
        'Cancelar'
      );
      if (confirmado) {
        setExibirLoaderReabertura(true);
        const resposta = await ServicoFechamentoReabertura.deletar([
          fechamentoReaberturaId,
        ])
          .catch(e => erros(e))
          .finally(() => setExibirLoaderReabertura(false));

        if (resposta?.status === 200) {
          sucesso(resposta.data);
          history.push(RotasDto.PERIODO_FECHAMENTO_REABERTURA);
        }
      }
    }
  };

  return (
    <Col span={24}>
      <Row gutter={[8, 8]} type="flex">
        <Col>
          <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
        </Col>
        <Col>
          <Button
            id={SGP_BUTTON_CANCELAR}
            label="Cancelar"
            color={Colors.Roxo}
            border
            onClick={() => onClickCancelar()}
            disabled={!emEdicao}
          />
        </Col>
        {!novoRegistro ? (
          <Col>
            <BotaoExcluirPadrao
              onClick={onClickExcluir}
              disabled={
                somenteConsulta || !permissoesTela.podeExcluir || novoRegistro
              }
            />
          </Col>
        ) : (
          <></>
        )}
        <Col>
          <Button
            id={SGP_BUTTON_ALTERAR_CADASTRAR}
            label={novoRegistro ? 'Cadastrar' : 'Alterar'}
            color={Colors.Roxo}
            border
            bold
            onClick={() => validaAntesDoSubmit()}
            disabled={desabilitarCampos || (!novoRegistro && !emEdicao)}
          />
        </Col>
      </Row>
    </Col>
  );
};

export default FechaReabCadastroBotoesAcao;
