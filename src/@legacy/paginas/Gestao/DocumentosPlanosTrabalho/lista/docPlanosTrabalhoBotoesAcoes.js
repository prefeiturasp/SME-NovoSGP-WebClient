import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import React from 'react';
import { Button, Colors } from '~/componentes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { URL_HOME } from '~/constantes';
import { SGP_BUTTON_NOVO } from '~/constantes/ids/button';
import { RotasDto } from '~/dtos';
import { useNavigate } from 'react-router-dom';

const DocPlanosTrabalhoBotoesAcoes = props => {
  const { desabilitarNovo } = props;

  const navigate = useNavigate();

  const onClickVoltar = () => navigate(URL_HOME);

  const onClickNovo = () => {
    if (!desabilitarNovo) {
      navigate(`${RotasDto.DOCUMENTOS_PLANOS_TRABALHO}/novo`);
    }
  };

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>
      <Col>
        <Button
          id={SGP_BUTTON_NOVO}
          label="Novo"
          color={Colors.Roxo}
          border
          bold
          onClick={onClickNovo}
          disabled={desabilitarNovo}
        />
      </Col>
    </Row>
  );
};

DocPlanosTrabalhoBotoesAcoes.propTypes = {
  desabilitarNovo: PropTypes.bool,
};

DocPlanosTrabalhoBotoesAcoes.defaultProps = {
  desabilitarNovo: false,
};

export default DocPlanosTrabalhoBotoesAcoes;
