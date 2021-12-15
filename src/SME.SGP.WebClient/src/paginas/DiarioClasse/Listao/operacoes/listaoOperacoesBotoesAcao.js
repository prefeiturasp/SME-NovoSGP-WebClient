import { Col, Row } from 'antd';
import React, { useContext } from 'react';
import { Button, Colors } from '~/componentes';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR,
  SGP_BUTTON_VOLTAR,
} from '~/componentes-sgp/filtro/idsCampos';
import { RotasDto } from '~/dtos';
import { history } from '~/servicos';
import ListaoContext from '../listaoContext';

const ListaoOperacoesBotoesAcao = () => {
  const { dadosFrequencia } = useContext(ListaoContext);

  const onClickSalvar = () => {
    // SALVAR!
    console.log(dadosFrequencia);
  };
  const onClickVoltar = () => history.push(RotasDto.LISTAO);

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
        <Col>
          <Button
            id={SGP_BUTTON_CANCELAR}
            label="Cancelar"
            color={Colors.Azul}
            border
            onClick={onClickSalvar}
          />
        </Col>
        <Col>
          <Button
            id={SGP_BUTTON_SALVAR}
            label="Salvar"
            color={Colors.Roxo}
            border
            bold
          />
        </Col>
      </Row>
    </Col>
  );
};

export default ListaoOperacoesBotoesAcao;
