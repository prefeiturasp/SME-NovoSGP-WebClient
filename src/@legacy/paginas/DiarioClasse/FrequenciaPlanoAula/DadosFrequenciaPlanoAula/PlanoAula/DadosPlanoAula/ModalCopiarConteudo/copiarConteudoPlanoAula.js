import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ModalCopiarConteudoPlanoAula from '~/componentes-sgp/ModalCopiarConteudo/modalCopiarConteudoPlanoAula';
import { setExibirModalCopiarConteudoPlanoAula } from '~/redux/modulos/frequenciaPlanoAula/actions';

const CopiarConteudoPlanoAula = () => {
  const dispatch = useDispatch();

  const componenteCurricular = useSelector(
    store => store.frequenciaPlanoAula.componenteCurricular
  );

  const exibirModalCopiarConteudoPlanoAula = useSelector(
    state => state.frequenciaPlanoAula.exibirModalCopiarConteudoPlanoAula
  );

  const dadosPlanoAula = useSelector(
    state => state.frequenciaPlanoAula.dadosPlanoAula
  );

  const [exibirLoaderModal, setExibirLoaderModal] = useState(false);

  const setExibirModal = exibir =>
    dispatch(setExibirModalCopiarConteudoPlanoAula(exibir));

  return (
    <ModalCopiarConteudoPlanoAula
      executarCopiarPadrao
      exibirListaCheckboxs
      setExibirModal={setExibirModal}
      setExibirLoaderModal={setExibirLoaderModal}
      exibirLoaderModal={exibirLoaderModal}
      exibirModal={exibirModalCopiarConteudoPlanoAula}
      planoAulaId={dadosPlanoAula?.id}
      codigoComponenteCurricular={
        componenteCurricular?.codigoComponenteCurricular
      }
    />
  );
};

export default CopiarConteudoPlanoAula;
