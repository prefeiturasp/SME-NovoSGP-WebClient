import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row, Tag, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Base, Colors } from '~/componentes';
import { SGP_BUTTON_ADD_OBJETIVOS_APRENDIZAGEM_DESENVOLVIMENTO } from '~/constantes/ids/button';
import Button from '~/componentes/button';
import ModalObjetivosAprendizagem from './modalObjetivosAprendizagem';

export const ContainerTag = styled(Tag)`
  font-size: 16px;
  color: ${Base.CinzaMako};
  background: ${Base.CinzaDesabilitado};
  height: 32px;
  display: inline-flex;
  align-items: center;
  margin: 6px 6px 6px 0px;

  svg {
    margin-left: 4px;
    cursor: pointer;
  }
`;

const AdicionarObjetivosAprendizagem = props => {
  const {
    listaObjetivosAprendizagem,
    idsObjetivosAprendizagemSelecionados,
    onChange,
    exibirModal,
    setExibirModal,
    onClickAdicionar,
    desabilitar,
    ehAulaCj,
    checkedExibirEscolhaObjetivos,
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

  const removerTag = item => {
    if (!desabilitar) {
      const itemParaRemover = idsObjetivosAprendizagemSelecionados.find(
        id => id === item.id
      );
      if (itemParaRemover) {
        const indexItemRemover = idsObjetivosAprendizagemSelecionados.indexOf(
          itemParaRemover
        );
        idsObjetivosAprendizagemSelecionados.splice(indexItemRemover, 1);
        onChange([...idsObjetivosAprendizagemSelecionados]);
      }
    }
  };

  const montarTags = () => {
    const itensSelecionados = listaObjetivosAprendizagem.filter(item =>
      idsObjetivosAprendizagemSelecionados.find(id => id === item.id)
    );

    const listaComDescricao = itensSelecionados.map(item => {
      const descricaoTag = `(${item.codigo}) ${item.descricao.substr(
        0,
        20
      )}...`;
      return { ...item, descricaoTag };
    });

    if (listaComDescricao?.length) {
      return listaComDescricao.map(obj => (
        <Tooltip title={`(${obj.codigo}) ${obj.descricao}`} key={obj.codigo}>
          <ContainerTag>
            <>
              {obj.descricaoTag}
              {!desabilitar ? (
                <FontAwesomeIcon
                  onClick={() => removerTag(obj)}
                  icon={faTimes}
                />
              ) : (
                <></>
              )}
            </>
          </ContainerTag>
        </Tooltip>
      ));
    }

    return <></>;
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
            disabled={ehAulaCj && !checkedExibirEscolhaObjetivos}
          />
          {idsObjetivosAprendizagemSelecionados?.length ? montarTags() : <></>}
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
          desabilitar={desabilitar}
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
  desabilitar: PropTypes.bool,
  ehAulaCj: PropTypes.bool,
  checkedExibirEscolhaObjetivos: PropTypes.bool,
};

AdicionarObjetivosAprendizagem.defaultProps = {
  listaObjetivosAprendizagem: [],
  idsObjetivosAprendizagemSelecionados: [],
  onChange: () => null,
  exibirModal: false,
  setExibirModal: () => null,
  onClickAdicionar: () => null,
  desabilitar: false,
  ehAulaCj: false,
  checkedExibirEscolhaObjetivos: false,
};

export default AdicionarObjetivosAprendizagem;
