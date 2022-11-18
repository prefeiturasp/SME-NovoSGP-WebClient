/* eslint-disable react/prop-types */
import { Col, Row } from 'antd';
import React from 'react';
import { Button, Colors } from '~/componentes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { SGP_BUTTON_PROXIMO_PASSO } from '~/constantes/ids/button';
import { URL_HOME } from '~/constantes';
import { RotasDto } from '~/dtos';
import { history } from '~/servicos';

const CadastroEncaminhamentoNAAPABotoesAcao = props => {
  const { somenteConsulta, podeIncluir } = props;

  const desabilitarNovo = somenteConsulta || !podeIncluir;

  const onClickVoltar = () => history.push(URL_HOME);

  const onClickProximoPasso = () =>
    history.push(`${RotasDto.ENCAMINHAMENTO_NAAPA}/novo`);

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>

      <Col>
        <Button
          id={SGP_BUTTON_PROXIMO_PASSO}
          label="Próximo passo"
          color={Colors.Roxo}
          border
          bold
          onClick={onClickProximoPasso}
          disabled={desabilitarNovo}
        />
      </Col>
    </Row>
  );
};

export default CadastroEncaminhamentoNAAPABotoesAcao;
