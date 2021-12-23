import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'antd';
import React, { useState } from 'react';
import { Colors } from '~/componentes';
import { SGP_BUTTON_ADD_OBJETIVOS_APRENDIZAGEM_DESENVOLVIMENTO } from '~/componentes-sgp/filtro/idsCampos';
import Button from '~/componentes/button';
import ModalObjetivosAprendizagem from './modalObjetivosAprendizagem';

const AdicionarObjetivosAprendizagem = () => {
  const [exibirModal, setExibirModal] = useState(false);

  const onClickAdd = () => {
    setExibirModal(true);
  };

  const onClose = () => {
    setExibirModal(false);
  };

  const LabelBtnAdd = () => {
    return (
      <div>
        Objetivos de Aprendizagem e Desenvolvimento
        <FontAwesomeIcon
          icon={faPlus}
          style={{ marginLeft: 5, fontSize: 16 }}
        />
      </div>
    );
  };
  return (
    <Col span={24}>
      <Row>
        <Col>
          <Button
            id={SGP_BUTTON_ADD_OBJETIVOS_APRENDIZAGEM_DESENVOLVIMENTO}
            label={<LabelBtnAdd />}
            color={Colors.Azul}
            border
            onClick={onClickAdd}
          />
        </Col>
      </Row>
      <ModalObjetivosAprendizagem exibirModal={exibirModal} onClose={onClose} />
    </Col>
  );
};

export default AdicionarObjetivosAprendizagem;
