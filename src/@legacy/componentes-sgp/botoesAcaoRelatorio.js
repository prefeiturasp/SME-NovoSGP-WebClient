import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import React from 'react';
import { SGP_BUTTON_CANCELAR, SGP_BUTTON_GERAR } from '~/constantes/ids/button';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import Loader from '~/componentes/loader';
import BotaoVoltarPadrao from './BotoesAcaoPadrao/botaoVoltarPadrao';
import { confirmar } from '~/servicos';

const BotoesAcaoRelatorio = props => {
  const {
    onClickVoltar,
    onClickCancelar,
    onClickGerar,
    temLoaderBtnGerar,
    desabilitarBtnGerar,
    carregandoGerar,
    modoEdicao,
  } = props;

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar && onClickVoltar()} />
      </Col>
      <Col>
        <Button
          id={SGP_BUTTON_CANCELAR}
          label="Cancelar"
          color={Colors.Roxo}
          border
          bold
          onClick={() => onClickCancelar()}
          disabled={!modoEdicao}
        />
      </Col>
      <Col>
        {temLoaderBtnGerar ? (
          <Loader loading={carregandoGerar} tip="">
            <Button
              id={SGP_BUTTON_GERAR}
              icon="print"
              label="Gerar"
              color={Colors.Azul}
              border
              bold
              onClick={() => onClickGerar && onClickGerar()}
              disabled={desabilitarBtnGerar}
            />
          </Loader>
        ) : (
          <Button
            id={SGP_BUTTON_GERAR}
            icon="print"
            label="Gerar"
            color={Colors.Azul}
            border
            bold
            onClick={onClickGerar}
            disabled={desabilitarBtnGerar}
          />
        )}
      </Col>
    </Row>
  );
};

BotoesAcaoRelatorio.propTypes = {
  onClickVoltar: PropTypes.func,
  onClickCancelar: PropTypes.func,
  onClickGerar: PropTypes.func,
  temLoaderBtnGerar: PropTypes.bool,
  desabilitarBtnGerar: PropTypes.bool,
  carregandoGerar: PropTypes.bool,
  modoEdicao: PropTypes.bool,
};

BotoesAcaoRelatorio.defaultProps = {
  onClickVoltar: null,
  onClickCancelar: null,
  onClickGerar: null,
  temLoaderBtnGerar: false,
  desabilitarBtnGerar: false,
  carregandoGerar: false,
  modoEdicao: false,
};

export default BotoesAcaoRelatorio;
