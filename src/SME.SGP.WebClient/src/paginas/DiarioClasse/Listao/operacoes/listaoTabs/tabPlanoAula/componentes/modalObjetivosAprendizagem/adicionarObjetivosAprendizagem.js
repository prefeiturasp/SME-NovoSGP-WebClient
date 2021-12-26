import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { Colors } from '~/componentes';
import { SGP_BUTTON_ADD_OBJETIVOS_APRENDIZAGEM_DESENVOLVIMENTO } from '~/componentes-sgp/filtro/idsCampos';
import Button from '~/componentes/button';
import ModalObjetivosAprendizagem from './modalObjetivosAprendizagem';

const AdicionarObjetivosAprendizagem = props => {
  const {
    listaObjetivosAprendizagem,
    idsObjetivosAprendizagemSelecionados,
    onChange,
    exibirModal,
    setExibirModal,
    onClickAdicionar,
  } = props;

  const onClose = (idsSelecionados, aplicarDados) => {
    if (aplicarDados) {
      onChange(idsSelecionados);
    }
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
            onClick={onClickAdicionar}
          />
        </Col>
      </Row>
      {exibirModal ? (
        <ModalObjetivosAprendizagem
          exibirModal={exibirModal}
          onClose={onClose}
          listaObjetivosAprendizagem={listaObjetivosAprendizagem}
          idsObjetivosAprendizagemSelecionados={
            idsObjetivosAprendizagemSelecionados
          }
        />
      ) : (
        <></>
      )}
    </Col>
  );
};

AdicionarObjetivosAprendizagem.propTypes = {
  listaObjetivosAprendizagem: PropTypes.oneOfType([PropTypes.array]),
  idsObjetivosAprendizagemSelecionados: PropTypes.oneOfType([PropTypes.array]),
  onChange: PropTypes.func,
  exibirModal: PropTypes.bool,
  setExibirModal: PropTypes.func,
  onClickAdicionar: PropTypes.func,
};

AdicionarObjetivosAprendizagem.defaultProps = {
  listaObjetivosAprendizagem: [],
  idsObjetivosAprendizagemSelecionados: [],
  onChange: () => null,
  exibirModal: false,
  setExibirModal: () => null,
  onClickAdicionar: () => null,
};

export default AdicionarObjetivosAprendizagem;
