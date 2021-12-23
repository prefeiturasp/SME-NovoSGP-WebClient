import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import shortid from 'shortid';
import { Colors, ModalConteudoHtml } from '~/componentes';
import {
  SGP_BUTTON_SALVAR_MODAL,
  SGP_BUTTON_VOLTAR_MODAL,
} from '~/componentes-sgp/filtro/idsCampos';
import Button from '~/componentes/button';

const ModalObjetivosAprendizagem = props => {
  const { exibirModal, onClose } = props;

  const onCloseModal = () => {
    onClose();
  };
  const onClickVoltarModal = () => {};
  const onClickSalvarModal = () => {};

  return exibirModal ? (
    <ModalConteudoHtml
      id={shortid.generate()}
      key="inserir-objetivos"
      visivel={onCloseModal}
      titulo="Objetivos de Aprendizagem"
      onClose={onClose}
      esconderBotaoPrincipal
      esconderBotaoSecundario
      width={750}
      closable
    >
      <Row gutter={[16, 16]} type="flex" justify="end">
        <Col>
          <Button
            id={SGP_BUTTON_VOLTAR_MODAL}
            label="Voltar"
            icon="arrow-left"
            color={Colors.Azul}
            border
            onClick={onClickVoltarModal}
          />
        </Col>
        <Col>
          <Button
            id={SGP_BUTTON_SALVAR_MODAL}
            label="Aplicar"
            color={Colors.Roxo}
            border
            bold
            onClick={onClickSalvarModal}
          />
        </Col>
      </Row>
    </ModalConteudoHtml>
  ) : (
    <></>
  );
};

ModalObjetivosAprendizagem.propTypes = {
  exibirModal: PropTypes.bool,
  onClose: PropTypes.func,
};

ModalObjetivosAprendizagem.defaultProps = {
  exibirModal: false,
  onClose: () => null,
};

export default ModalObjetivosAprendizagem;
