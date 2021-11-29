import { Col, Row } from 'antd';
import React from 'react';
import { Button, Colors } from '~/componentes';
import { SGP_BUTTON_VOLTAR } from '~/componentes-sgp/filtro/idsCampos';
import { URL_HOME } from '~/constantes';
import { history } from '~/servicos';

const ListaoBotoesAcao = () => {
  const onClickVoltar = () => history.push(URL_HOME);

  return (
    <Col span={24}>
      <Row gutter={[16, 16]} type="flex" justify="end">
        <Col>
          <Button
            id={SGP_BUTTON_VOLTAR}
            label="Voltar"
            icon="arrow-left"
            color={Colors.Azul}
            border
            onClick={onClickVoltar}
          />
        </Col>
      </Row>
    </Col>
  );
};

export default ListaoBotoesAcao;
