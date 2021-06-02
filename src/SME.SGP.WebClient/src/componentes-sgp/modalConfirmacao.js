import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shortid from 'shortid';
import styled from 'styled-components';
import { Loader } from '~/componentes';

import Button from '../componentes/button';
import { Base, Colors } from '../componentes/colors';
import { alertaFechar } from '../redux/modulos/alertas/actions';

const ContainerModal = styled.div`
  .ant-modal-footer {
    border-top: 0px !important;
  }
`;

const ContainerBotoes = styled.div`
  display: flex;
  justify-content: flex-end;

  .botao-confirmacao {
    color: ${({ loadingCliqueOk }) =>
      loadingCliqueOk && `${Base.Branco} !important`};
  }
`;

const ModalConfirmacao = () => {
  const [loadingCliqueOk, setLoadingCliqueOk] = useState(false);
  const dispatch = useDispatch();
  const confirmacao = useSelector(state => state.alertas.confirmacao);
  const { primeiroExibirTextoNegrito } = confirmacao;

  const fecharConfirmacao = resultado => {
    if (confirmacao) confirmacao.resolve(resultado);
    dispatch(alertaFechar());
  };

  useEffect(() => {
    if (!confirmacao.visivel && loadingCliqueOk) {
      setLoadingCliqueOk(false);
    }
  }, [confirmacao.visivel]);

  return (
    <ContainerModal>
      <Modal
        title={confirmacao.titulo}
        visible={confirmacao.visivel}
        onOk={() => fecharConfirmacao(true)}
        onCancel={() => fecharConfirmacao(false)}
        footer={[
          <ContainerBotoes
            key={shortid.generate()}
            loadingCliqueOk={loadingCliqueOk}
          >
            <Loader loading={loadingCliqueOk} ignorarTip className="mr-1">
              <Button
                id={shortid.generate()}
                className="botao-confirmacao"
                key={shortid.generate()}
                onClick={() => {
                  setLoadingCliqueOk(true);
                  fecharConfirmacao(true);
                }}
                label={confirmacao.textoOk}
                color={Colors.Azul}
                border
              />
            </Loader>
            <Button
              id={shortid.generate()}
              key={shortid.generate()}
              onClick={() => fecharConfirmacao(false)}
              label={confirmacao.textoCancelar}
              type="primary"
              color={Colors.Azul}
            />
          </ContainerBotoes>,
        ]}
      >
        {primeiroExibirTextoNegrito ? <b>{confirmacao.textoNegrito}</b> : ''}
        <div className="mb-2 mt-2">
          {confirmacao.texto && Array.isArray(confirmacao.texto)
            ? confirmacao.texto.map(item => (
                <div key={shortid.generate()}>{item}</div>
              ))
            : confirmacao.texto}
        </div>
        {!primeiroExibirTextoNegrito ? <b>{confirmacao.textoNegrito}</b> : ''}
      </Modal>
    </ContainerModal>
  );
};

export default ModalConfirmacao;
