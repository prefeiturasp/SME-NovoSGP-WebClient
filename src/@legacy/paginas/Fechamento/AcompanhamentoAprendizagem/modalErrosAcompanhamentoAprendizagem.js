import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalMultiLinhas } from '~/componentes';
import {
  setErrosAcompanhamentoAprendizagem,
  setExibirModalErrosAcompanhamentoAprendizagem,
} from '~/redux/modulos/acompanhamentoAprendizagem/actions';

function ModalErrosAcompanhamentoAprendizagem() {
  const dispatch = useDispatch();

  const errosAcompanhamentoAprendizagem = useSelector(
    store => store.acompanhamentoAprendizagem.errosAcompanhamentoAprendizagem
  );
  const exibirModalErrosAcompanhamentoAprendizagem = useSelector(
    store =>
      store.acompanhamentoAprendizagem
        .exibirModalErrosAcompanhamentoAprendizagem
  );

  const onCloseErros = () => {
    dispatch(setExibirModalErrosAcompanhamentoAprendizagem(false));
    dispatch(setErrosAcompanhamentoAprendizagem([]));
  };

  return (
    <ModalMultiLinhas
      key="erros-acompanhamento-aprendizagem"
      visivel={exibirModalErrosAcompanhamentoAprendizagem}
      onClose={onCloseErros}
      type="error"
      conteudo={errosAcompanhamentoAprendizagem}
      titulo="Erros"
    />
  );
}

export default ModalErrosAcompanhamentoAprendizagem;
