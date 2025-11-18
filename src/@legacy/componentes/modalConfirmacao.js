import { Modal } from 'antd';
import React from 'react';
import styled from 'styled-components';
import {
  SGP_BUTTON_CANCELAR_MODAL,
  SGP_BUTTON_SALVAR_MODAL,
} from '~/constantes/ids/button';

import Button from './button';
import { Colors } from './colors';

const Container = styled(Modal)`
  .ant-modal-footer {
    border-top: none;
    padding-left: 24px !important;
    padding-right: 24px !important;
  }

  .padding-btn-confirmacao {
    padding: 22px;
  }

  .ant-modal-header {
    border-bottom: none;
    padding-top: 27px;
    padding-bottom: 0px;
  }

  .ant-modal-title {
    border-bottom: solid 1.5px rgba(0, 0, 0, 0.12);
    color: #42474a;
    font-size: 25px;
    padding-bottom: 7px;
  }

  .ant-modal-close-x {
    font-style: normal;
    line-height: 40px;
    color: #42474a;
  }

  p {
    margin-bottom: 0;
  }
`;

const ModalConfirmacao = props => {
  const {
    id,
    visivel,
    onConfirmacaoPrincipal,
    onConfirmacaoSecundaria,
    onClose,
    conteudo,
    perguntaDoConteudo,
    labelPrincipal,
    labelSecundaria,
    titulo,
  } = props;
  return (
    <Container
      onCancel={onClose}
      title={titulo}
      open={visivel}
      centered
      footer={[
        <Button
          id={id || SGP_BUTTON_SALVAR_MODAL}
          key="btn-sim-confirmacao"
          label={labelSecundaria}
          color={Colors.Azul}
          border
          className="mr-2 padding-btn-confirmacao"
          onClick={onConfirmacaoSecundaria}
        />,
        <Button
          id={id || SGP_BUTTON_CANCELAR_MODAL}
          key="btn-nao-confirmacao"
          label={labelPrincipal}
          color={Colors.Azul}
          className="padding-btn-confirmacao"
          onClick={onConfirmacaoPrincipal}
        />,
      ]}
    >
      {conteudo ? <p> {conteudo}</p> : ''}

      {perguntaDoConteudo ? (
        <p>
          <b>{perguntaDoConteudo}</b>
        </p>
      ) : (
        ''
      )}
    </Container>
  );
};

export default ModalConfirmacao;
