import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setConselhoClasseEmEdicao,
  setRecomendacaoAlunoSelecionados,
} from '~/redux/modulos/conselhoClasse/actions';
import ListaRecomendacoes from './listaRecomendacoes';

// eslint-disable-next-line react/prop-types
const ListaRecomendacaoAluno = ({ desabilitar }) => {
  const dispatch = useDispatch();

  const listaRecomendacoesAluno = useSelector(
    store =>
      store.conselhoClasse?.listaoRecomendacoesAlunoFamilia
        ?.listaRecomendacoesAluno
  );

  const recomendacaoAlunoSelecionados = useSelector(
    store => store.conselhoClasse?.recomendacaoAlunoSelecionados
  );

  const onChange = useCallback(
    ids => {
      dispatch(setRecomendacaoAlunoSelecionados(ids));
      dispatch(setConselhoClasseEmEdicao(true));
    },
    [dispatch]
  );

  return (
    <ListaRecomendacoes
      desabilitar={desabilitar}
      dadosRecomendacao={
        listaRecomendacoesAluno?.length
          ? listaRecomendacoesAluno.filter(
              item =>
                !recomendacaoAlunoSelecionados?.find?.(a => a?.id === item?.id)
            )
          : []
      }
      titulo="Selecione recomendações ao estudante"
      dadosDireita={recomendacaoAlunoSelecionados}
      setDadosDireita={onChange}
    />
  );
};

export default ListaRecomendacaoAluno;
