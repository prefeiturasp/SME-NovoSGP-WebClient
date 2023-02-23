import React, { useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from '~/componentes';
import { ModalidadeDTO } from '~/dtos';
import { setLimparModoEdicaoGeral } from '~/redux/modulos/geral/actions';
import ListaoContext from '../../../listaoContext';
import { obterDaodsFechamentoPorBimestreListao } from '../../../listaoFuncoes';
import ListaoListaFechamento from './listaoListaFechamento';

const TabListaoFechamento = () => {
  const dispatch = useDispatch();

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const {
    componenteCurricular,
    bimestreOperacoes,
    setExibirLoaderGeral,
    dadosFechamento,
    setDadosFechamento,
    setDadosIniciaisFechamento,
  } = useContext(ListaoContext);

  const limparFechamento = () => {
    setDadosIniciaisFechamento();
    setDadosFechamento();
  };

  const obterFechamentoPorBimestre = useCallback(async () => {
    obterDaodsFechamentoPorBimestreListao(
      setExibirLoaderGeral,
      turmaSelecionada,
      bimestreOperacoes,
      componenteCurricular,
      setDadosFechamento,
      setDadosIniciaisFechamento,
      limparFechamento
    );

  }, [componenteCurricular, turmaSelecionada, bimestreOperacoes]);

  useEffect(() => {
    limparFechamento();
    if (
      componenteCurricular?.codigoComponenteCurricular &&
      turmaSelecionada?.turma &&
      bimestreOperacoes
    ) {
      obterFechamentoPorBimestre();
    }

  }, [bimestreOperacoes]);

  useEffect(() => {
    return () => {
      limparFechamento();
      dispatch(setLimparModoEdicaoGeral(false));
    };

  }, []);

  const ehEJA = Number(turmaSelecionada?.modalidade) === ModalidadeDTO.EJA;
  const naoLancaNota =
    componenteCurricular?.codigoComponenteCurricular &&
    !componenteCurricular?.lancaNota;
  return (
    <>
      {naoLancaNota && (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'alertas-listao',
            mensagem: 'Componente selecionado não lança nota',
            estiloTitulo: { fontSize: '18px' },
          }}
          className="mb-2"
        />
      )}

      {!naoLancaNota && dadosFechamento?.alunos?.length && bimestreOperacoes ? (
        <ListaoListaFechamento ehEJA={ehEJA} />
      ) : (
        <></>
      )}
    </>
  );
};

export default TabListaoFechamento;
