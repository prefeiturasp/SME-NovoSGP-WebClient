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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bimestreOperacoes]);

  useEffect(() => {
    return () => {
      limparFechamento();
      dispatch(setLimparModoEdicaoGeral(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ehEJA = Number(turmaSelecionada?.modalidade) === ModalidadeDTO.EJA;

  return (
    <>
      {componenteCurricular?.codigoComponenteCurricular &&
        !componenteCurricular?.lancaNota && (
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

      {/* TODO: Verificar se vai ser exibido a lista vazia com a informação 'Sem dados' */}
      {dadosFechamento?.alunos?.length && bimestreOperacoes ? (
        <ListaoListaFechamento ehEJA={ehEJA} />
      ) : (
        <></>
      )}
    </>
  );
};

export default TabListaoFechamento;
