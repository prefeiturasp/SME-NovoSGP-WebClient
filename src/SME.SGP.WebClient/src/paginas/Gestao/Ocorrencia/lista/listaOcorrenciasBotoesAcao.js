/* eslint-disable react/prop-types */
import { Col, Row } from 'antd';
import React from 'react';
import { Button, Colors } from '~/componentes';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { SGP_BUTTON_NOVO } from '~/componentes-sgp/filtro/idsCampos';
import { URL_HOME } from '~/constantes';
import { RotasDto } from '~/dtos';
import {
  confirmar,
  erros,
  history,
  ServicoOcorrencias,
  sucesso,
} from '~/servicos';

const ListaOcorrenciasBotoesAcao = props => {
  const {
    ocorrenciasSelecionadas,
    setOcorrenciasSelecionadas,
    ehTurmaAnoAnterior,
    somenteConsulta,
    podeExcluir,
    podeIncluir,
    atualizarDados,
    setExibirLoaderExcluir,
  } = props;

  const desabilitarExcluir =
    !ocorrenciasSelecionadas?.length ||
    ehTurmaAnoAnterior ||
    somenteConsulta ||
    !podeExcluir;

  const desabilitarNovo = ehTurmaAnoAnterior || somenteConsulta || !podeIncluir;

  const onClickVoltar = () => history.push(URL_HOME);

  const onClickNovo = () => history.push(`${RotasDto.OCORRENCIAS}/novo`);

  const onClickExcluir = async () => {
    if (ocorrenciasSelecionadas?.length) {
      let msgConfirm = 'Deseja realmente excluir';
      msgConfirm = `${msgConfirm}${
        ocorrenciasSelecionadas?.length > 1
          ? ' estes registros?'
          : ' este registro?'
      }`;
      const confirmado = await confirmar('Atenção', msgConfirm);

      if (confirmado) {
        const parametros = { data: ocorrenciasSelecionadas };
        setExibirLoaderExcluir(true);
        ServicoOcorrencias.excluir(parametros)
          .then(resp => {
            const mensagemSucesso = `${
              ocorrenciasSelecionadas.length > 1
                ? 'Registros excluídos'
                : 'Registro excluído'
            } com sucesso.`;
            sucesso(mensagemSucesso);
            setOcorrenciasSelecionadas([]);
            atualizarDados();
            if (resp.existemErros) {
              erros(resp.mensagens);
            }
          })
          .catch(e => erros(e))
          .finally(() => setExibirLoaderExcluir(false));
      }
    }
  };

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>
      <Col>
        <BotaoExcluirPadrao
          onClick={onClickExcluir}
          disabled={desabilitarExcluir}
        />
      </Col>
      <Col>
        <Button
          id={SGP_BUTTON_NOVO}
          label="Nova"
          color={Colors.Roxo}
          border
          bold
          disabled={desabilitarNovo}
          onClick={onClickNovo}
        />
      </Col>
    </Row>
  );
};

export default ListaOcorrenciasBotoesAcao;
