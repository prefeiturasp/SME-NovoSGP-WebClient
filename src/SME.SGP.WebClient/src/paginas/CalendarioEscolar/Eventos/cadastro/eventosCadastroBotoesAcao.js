import { Col, Row } from 'antd';
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Colors } from '~/componentes';
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

  const onClickVoltar = async () => {
    if (emEdicao) {
      const confirmado = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja voltar para tela de listagem agora?'
      );
      if (confirmado) {
        history.push(urlTelaListagemEventos());
      }
    } else {
      setBreadcrumbLista();
      history.push(urlTelaListagemEventos());
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

  return (
    <Col span={24}>
      <Row gutter={[16, 16]} style={{ justifyContent: 'end', display: 'flex' }}>
        <Col>
          <Button
            id="btn-voltar"
            label="Voltar"
            icon="arrow-left"
            color={Colors.Azul}
            border
            onClick={onClickVoltar}
          />
        </Col>
        <Col>
          <Button
            id="btn-cancelar"
            label="Cancelar"
            color={Colors.Roxo}
            border
            onClick={() => onClickCancelar()}
            disabled={!emEdicao || !podeAlterarEvento}
          />
        </Col>
        {!novoRegistro ? (
          <Col>
            <Button
              id="btn-excluir"
              label="Excluir"
              color={Colors.Vermelho}
              border
              hidden={novoRegistro}
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
            id={novoRegistro ? 'btn-cadastrar' : 'btn-alterar'}
            label={novoRegistro ? 'Cadastrar' : 'Alterar'}
            color={Colors.Roxo}
            border
            bold
            onClick={() => validaAntesDoSubmit()}
            disabled={
              desabilitarCampos ||
              (!novoRegistro && !eventoId) ||
              somenteConsulta ||
              !permissoesTela?.podeAlterar ||
              (!podeAlterarExcluir && !novoRegistro) ||
              !podeAlterarEvento
            }
          />
        </Col>
      </Row>
    </Col>
  );
};

export default EventosCadastroBotoesAcao;