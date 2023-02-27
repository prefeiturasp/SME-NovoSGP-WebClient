import React, { useContext } from 'react';
import { ModalMultiLinhas } from '~/componentes';
import ListaoContext from '../../../listaoContext';

const ModalErrosDiarioBordoListao = () => {
  const { errosDiarioBordoListao, setErrosDiarioBordoListao } = useContext(
    ListaoContext
  );

  const onCloseErros = () => setErrosDiarioBordoListao([]);

  return (
    <ModalMultiLinhas
      key="erros-diario-bordo"
      visivel={!!errosDiarioBordoListao?.length}
      onClose={onCloseErros}
      type="error"
      conteudo={errosDiarioBordoListao}
      titulo="Erros diário de bordo"
    />
  );
};

export default ModalErrosDiarioBordoListao;
