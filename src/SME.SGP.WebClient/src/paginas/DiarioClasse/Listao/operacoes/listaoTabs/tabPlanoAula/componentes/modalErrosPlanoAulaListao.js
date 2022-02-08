import React, { useContext } from 'react';
import { ModalMultiLinhas } from '~/componentes';
import ListaoContext from '../../../../listaoContext';

const ModalErrosPlanoAulaListao = () => {
  const { errosPlanoAulaListao, setErrosPlanoAulaListao } = useContext(
    ListaoContext
  );

  const onCloseErros = () => setErrosPlanoAulaListao([]);

  return (
    <ModalMultiLinhas
      key="erros-plano-aula"
      visivel={!!errosPlanoAulaListao?.length}
      onClose={onCloseErros}
      type="error"
      conteudo={errosPlanoAulaListao}
      titulo="Erros plano de aula"
    />
  );
};

export default ModalErrosPlanoAulaListao;
