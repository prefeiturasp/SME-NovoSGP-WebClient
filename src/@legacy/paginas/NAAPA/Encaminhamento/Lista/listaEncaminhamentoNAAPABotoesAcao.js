import { Col, Row } from 'antd';
import React from 'react';
import { Button, Colors } from '~/componentes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { SGP_BUTTON_NOVO } from '~/constantes/ids/button';
import { URL_HOME } from '~/constantes';
import { RotasDto } from '~/dtos';
import { history } from '~/servicos';
import BtnImpressaoEncaminhamentoNAAPA from '../componentes/btnImpressaoNAAPA';

const ListaEncaminhamentoNAAPABotoesAcao = props => {
  const { somenteConsulta, podeIncluir, idsSelecionados } = props;

  const desabilitarNovo = somenteConsulta || !podeIncluir;
  const onClickVoltar = () => history.push(URL_HOME);

  const onClickNovo = () =>
    history.push(`${RotasDto.ENCAMINHAMENTO_NAAPA}/novo`);

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>
      <Col>
        <BtnImpressaoEncaminhamentoNAAPA idsSelecionados={idsSelecionados} />
      </Col>
      <Col>
        <Button
          bold
          border
          label="Novo"
          color={Colors.Roxo}
          id={SGP_BUTTON_NOVO}
          onClick={onClickNovo}
          disabled={desabilitarNovo}
        />
      </Col>
    </Row>
  );
};

export default ListaEncaminhamentoNAAPABotoesAcao;
