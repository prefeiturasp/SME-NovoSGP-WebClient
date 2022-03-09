import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Editor } from '~/componentes';
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
