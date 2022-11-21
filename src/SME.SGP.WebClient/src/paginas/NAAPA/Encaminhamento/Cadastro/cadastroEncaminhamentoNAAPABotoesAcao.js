/* eslint-disable react/prop-types */
import { Col, Row } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { Button, Colors } from '~/componentes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_ENVIAR,
  SGP_BUTTON_EXCLUIR,
  SGP_BUTTON_PROXIMO_PASSO,
  SGP_BUTTON_SALVAR_RASCUNHO,
} from '~/constantes/ids/button';
import { history } from '~/servicos';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import { RotasDto } from '~/dtos';

const CadastroEncaminhamentoNAAPABotoesAcao = props => {
  const { somenteConsulta, podeIncluir, mostrarBusca, setMostrarBusca } = props;

  const routeMatch = useRouteMatch();

  const aluno = useSelector(state => state.localizarEstudante.codigoAluno);

  const encaminhamentoId = routeMatch.params?.id;
  const desabilitarNovo = somenteConsulta || !podeIncluir || !aluno;

  const onClickVoltar = () => history.push(RotasDto.ENCAMINHAMENTO_NAAPA);

  const onClickProximoPasso = () => {
    setMostrarBusca(false);
  };

  const onClickExcluir = () => {};

  const onClickCancelar = () => {};

  const onClickSalvarRascunho = () => {};

  const onClickEnviar = () => {};

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>

      {mostrarBusca ? (
        <Col>
          <Button
            bold
            border
            color={Colors.Roxo}
            label="Próximo passo"
            disabled={desabilitarNovo}
            onClick={onClickProximoPasso}
            id={SGP_BUTTON_PROXIMO_PASSO}
          />
        </Col>
      ) : (
        <>
          <Col>
            <BotaoExcluirPadrao
              id={SGP_BUTTON_EXCLUIR}
              disabled={somenteConsulta || !encaminhamentoId}
              onClick={() => onClickExcluir()}
            />
          </Col>

          <Col>
            <Button
              border
              label="Cancelar"
              color={Colors.Roxo}
              id={SGP_BUTTON_CANCELAR}
              disabled={somenteConsulta}
              onClick={() => onClickCancelar()}
            />
          </Col>

          <Col>
            <Button
              bold
              border
              color={Colors.Azul}
              label="Salvar rascunho"
              id={SGP_BUTTON_SALVAR_RASCUNHO}
              onClick={onClickSalvarRascunho}
            />
          </Col>

          <Col>
            <Button
              bold
              border
              label="Enviar"
              color={Colors.Azul}
              id={SGP_BUTTON_ENVIAR}
              onClick={onClickEnviar}
            />
          </Col>
        </>
      )}
    </Row>
  );
};

export default CadastroEncaminhamentoNAAPABotoesAcao;
