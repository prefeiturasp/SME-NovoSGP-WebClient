import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import shortid from 'shortid';
import { Colors, ModalConteudoHtml } from '~/componentes';
import Button from '~/componentes/button';
import {
  SGP_BUTTON_CONTINUAR_MODAL,
  SGP_BUTTON_VOLTAR_MODAL,
} from '~/constantes/ids/button';
import { RotasDto } from '~/dtos';
import { setExibirModalAviso } from '~/redux/modulos/encaminhamentoAEE/actions';

const ModalAvisoNovoEncaminhamentoAEE = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dadosModalAviso = useSelector(
    store => store.encaminhamentoAEE.dadosModalAviso
  );

  const exibirModalAviso = useSelector(
    store => store.encaminhamentoAEE.exibirModalAviso
  );

  const onClose = () => {
    dispatch(setExibirModalAviso(false));
  };

  const onClickNovo = () => {
    dispatch(setExibirModalAviso(false));
    navigate(`${RotasDto.RELATORIO_AEE_ENCAMINHAMENTO}/novo`);
  };

  return (
    <ModalConteudoHtml
      id={shortid.generate()}
      key="aviso"
      visivel={exibirModalAviso}
      titulo="Aviso"
      onClose={onClose}
      esconderBotaoPrincipal
      esconderBotaoSecundario
      width={750}
      closable
    >
      <span
        dangerouslySetInnerHTML={{
          __html: dadosModalAviso,
        }}
      />
      <div className="col-md-12 mt-2 p-0 d-flex justify-content-end">
        <Button
          key="btn-voltar"
          id={SGP_BUTTON_VOLTAR_MODAL}
          label="Voltar"
          color={Colors.Azul}
          border
          onClick={onClose}
          className="mt-2 mr-2"
        />
        <Button
          key="btn-continuar"
          id={SGP_BUTTON_CONTINUAR_MODAL}
          label="Continuar"
          color={Colors.Roxo}
          border
          onClick={onClickNovo}
          className="mt-2"
        />
      </div>
    </ModalConteudoHtml>
  );
};

export default ModalAvisoNovoEncaminhamentoAEE;
