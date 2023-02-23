import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Editor } from '~/componentes';
import { SGP_CKEDITOR_PARECER_CEFAI_PLANO_AEE } from '~/constantes/ids/ckeditor';
import {
  setParecerEmEdicao,
  setParecerPAAI,
} from '~/redux/modulos/planoAEE/actions';

const SecaoParecerPAAI = () => {
  const parecerPAAI = useSelector(store => store.planoAEE.parecerPAAI);
  const dadosParecer = useSelector(store => store.planoAEE.dadosParecer);

  const dispatch = useDispatch();

  const mudarDescricaoPAAI = texto => {
    let edicao = false;
    if (texto) {
      edicao = true;
    }
    dispatch(setParecerEmEdicao(edicao));
    dispatch(setParecerPAAI(texto));
  };

  return (
    <div className="mb-3">
      <Editor
        id={SGP_CKEDITOR_PARECER_CEFAI_PLANO_AEE}
        label="Parecer do CEFAI"
        onChange={mudarDescricaoPAAI}
        inicial={dadosParecer?.parecerPAAI || parecerPAAI || ''}
        desabilitar={!dadosParecer?.podeEditarParecerPAAI}
        removerToolbar={!dadosParecer?.podeEditarParecerPAAI}
      />
    </div>
  );
};

export default SecaoParecerPAAI;
