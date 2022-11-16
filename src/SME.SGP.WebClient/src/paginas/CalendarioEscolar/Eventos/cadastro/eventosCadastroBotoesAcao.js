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
} from '~/constantes/ids/button';
import { RotasDto } from '~/dtos';
import {
  confirmar,
  erros,
  history,
  ServicoEvento,
  setBreadcrumbManual,
  sucesso,
  verificaSomenteConsulta,
} from '~/servicos';
import EventosCadastroContext from './eventosCadastroContext';

const EventosCadastroBotoesAcao = () => {
  const {
    emEdicao,
    podeAlterarEvento,
    setExecutaResetarTela,
    setSomenteConsulta,
    somenteConsulta,
    podeAlterarExcluir,
    valoresIniciaisPadrao,
    refFormEventos,
    desabilitarCampos,
  } = useContext(EventosCadastroContext);

  const usuarioStore = useSelector(store => store.usuario);
  const permissoesTela = usuarioStore.permissoes[RotasDto.EVENTOS];

  const paramsRota = useParams();
  const tipoCalendarioId = paramsRota?.tipoCalendarioId;

  const eventoId = paramsRota?.id;
  const novoRegistro = !eventoId;

  useEffect(() => {
    setSomenteConsulta(verificaSomenteConsulta(permissoesTela));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissoesTela]);

  const urlTelaListagemEventos = () => {
    if (tipoCalendarioId) {
      return `${RotasDto.EVENTOS}/${tipoCalendarioId}`;
    }
    return RotasDto.EVENTOS;
  };

  const setBreadcrumbLista = () => {
    if (tipoCalendarioId) {
      setBreadcrumbManual(
        `${RotasDto.EVENTOS}/${tipoCalendarioId}`,
        '',
        RotasDto.EVENTOS
      );
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
        'Excluir evento',
        '',
        'Deseja realmente excluir este evento?',
        'Excluir',
        'Cancelar'
      );
      if (confirmado) {
        const resposta = await ServicoEvento.deletar([eventoId]).catch(e =>
          erros(e)
        );
        if (resposta) {
          sucesso('Evento excluído com sucesso');
          history.push(urlTelaListagemEventos());
        }
      }
    }
  };

  const validaAntesDoSubmit = () => {
    const arrayCampos = Object.keys(valoresIniciaisPadrao);
    arrayCampos.forEach(campo => {
      refFormEventos.setFieldTouched(campo, true, true);
    });
    refFormEventos.validateForm().then(() => {
      if (Object.keys(refFormEventos.state.errors).length === 0) {
        refFormEventos.handleSubmit(e => e);
      }
    });
  };

  const onClickVoltar = async () => {
    if (emEdicao) {
      const confirmado = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );
      if (confirmado) {
        validaAntesDoSubmit();
      } else {
        history.push(urlTelaListagemEventos());
      }
    } else {
      setBreadcrumbLista();
      history.push(urlTelaListagemEventos());
    }
  };

  const desabilitarCadastrar =
    desabilitarCampos ||
    (!novoRegistro && !eventoId) ||
    somenteConsulta ||
    !permissoesTela?.podeAlterar ||
    (!podeAlterarExcluir && !novoRegistro) ||
    !podeAlterarEvento ||
    (eventoId && !emEdicao);

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
            disabled={!emEdicao || !podeAlterarEvento}
          />
        </Col>
        {!novoRegistro ? (
          <Col>
            <BotaoExcluirPadrao
              onClick={onClickExcluir}
              disabled={
                somenteConsulta ||
                !permissoesTela?.podeExcluir ||
                novoRegistro ||
                !podeAlterarEvento ||
                !podeAlterarExcluir
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
            disabled={desabilitarCadastrar}
          />
        </Col>
      </Row>
    </Col>
  );
};

export default EventosCadastroBotoesAcao;
