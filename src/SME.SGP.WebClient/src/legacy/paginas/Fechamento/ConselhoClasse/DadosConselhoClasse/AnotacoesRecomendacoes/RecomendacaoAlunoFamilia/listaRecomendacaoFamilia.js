import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setConselhoClasseEmEdicao,
  setRecomendacaoFamiliaSelecionados,
} from '~/redux/modulos/conselhoClasse/actions';
import ListaRecomendacoes from './listaRecomendacoes';

const ListaRecomendacaoFamilia = () => {
  const dispatch = useDispatch();

  const listaRecomendacoesFamilia = useSelector(
    store =>
      store.conselhoClasse?.listaoRecomendacoesAlunoFamilia
        ?.listaRecomendacoesFamilia
  );

  const recomendacaoFamiliaSelecionados = useSelector(
    store => store.conselhoClasse?.recomendacaoFamiliaSelecionados
  );

  const onChange = useCallback(
    ids => {
      dispatch(setRecomendacaoFamiliaSelecionados(ids));
      dispatch(setConselhoClasseEmEdicao(true));
    },
    [dispatch]
  );

  return (
    <ListaRecomendacoes
      dadosRecomendacao={
        listaRecomendacoesFamilia?.length
          ? listaRecomendacoesFamilia.filter(
              item =>
                !recomendacaoFamiliaSelecionados?.find?.(
                  a => a?.id === item?.id
                )
            )
          : []
      }
      titulo="Selecione recomendações a família"
      dadosDireita={recomendacaoFamiliaSelecionados}
      setDadosDireita={onChange}
    />
  );
};

export default ListaRecomendacaoFamilia;
