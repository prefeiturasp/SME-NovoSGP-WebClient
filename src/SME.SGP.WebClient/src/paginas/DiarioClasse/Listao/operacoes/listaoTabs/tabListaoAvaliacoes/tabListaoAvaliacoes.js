import React, { useCallback, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Alert } from '~/componentes';
import { erros } from '~/servicos';
import ServicoNotas from '~/servicos/ServicoNotas';
import ListaoContext from '../../../listaoContext';
import { obterListaAlunosAvaliacaoListao } from '../../../listaoFuncoes';
import ListaoListaAvaliacoes from './listaoListaAvaliacoes';

const TabListaoAvaliacoes = () => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const {
    componenteCurricular,
    bimestreOperacoes,
    setDadosAvaliacao,
    setDadosIniciaisAvaliacao,
    dadosPeriodosAvaliacao,
    setDadosPeriodosAvaliacao,
    setExibirLoaderGeral,
  } = useContext(ListaoContext);

  const limparDadosAvaliacao = () => {
    setDadosIniciaisAvaliacao();
    setDadosAvaliacao();
  };

  const obterDadosPeriodos = useCallback(async () => {
    const params = {
      anoLetivo: turmaSelecionada.anoLetivo,
      modalidade: turmaSelecionada.modalidade,
      semestre: turmaSelecionada.periodo,
    };
    const resultado = await ServicoNotas.obterPeriodos({ params }).catch(e =>
      erros(e)
    );

    if (resultado?.data?.length) {
      setDadosPeriodosAvaliacao(resultado.data);
    } else {
      limparDadosAvaliacao();
      setDadosPeriodosAvaliacao();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turmaSelecionada]);

  useEffect(() => {
    limparDadosAvaliacao();
    setDadosPeriodosAvaliacao();
    if (
      bimestreOperacoes &&
      turmaSelecionada?.turma &&
      componenteCurricular?.codigoComponenteCurricular
    ) {
      obterDadosPeriodos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componenteCurricular, turmaSelecionada, bimestreOperacoes]);

  const obterListaAlunosAvaliacao = useCallback(async () => {
    obterListaAlunosAvaliacaoListao(
      dadosPeriodosAvaliacao,
      bimestreOperacoes,
      turmaSelecionada,
      componenteCurricular,
      setExibirLoaderGeral,
      setDadosAvaliacao,
      setDadosIniciaisAvaliacao
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componenteCurricular, turmaSelecionada, dadosPeriodosAvaliacao]);

  useEffect(() => {
    limparDadosAvaliacao();
    if (
      componenteCurricular?.codigoComponenteCurricular &&
      bimestreOperacoes &&
      dadosPeriodosAvaliacao?.length
    ) {
      obterListaAlunosAvaliacao();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dadosPeriodosAvaliacao]);

  useEffect(() => {
    return () => {
      limparDadosAvaliacao();
      setDadosPeriodosAvaliacao();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {componenteCurricular?.codigoComponenteCurricular &&
      !componenteCurricular?.lancaNota ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'alerta-listao-avaliacao',
            mensagem: 'Componente selecionado não lança nota',
            estiloTitulo: { fontSize: '18px' },
          }}
          className="mb-2"
        />
      ) : (
        <ListaoListaAvaliacoes />
      )}
    </>
  );
};

export default TabListaoAvaliacoes;
