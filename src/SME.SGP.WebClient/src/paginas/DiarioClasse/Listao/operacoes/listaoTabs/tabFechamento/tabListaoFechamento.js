import React, { useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from '~/componentes';
import { ModalidadeDTO } from '~/dtos';
import { setLimparModoEdicaoGeral } from '~/redux/modulos/geral/actions';
import { erros } from '~/servicos';
import ServicoFechamentoBimestre from '~/servicos/Paginas/Fechamento/ServicoFechamentoBimestre';
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
    setAvaliacoesTabelaFechamento,
  } = useContext(ListaoContext);

  const limparFechamento = () => {
    setDadosIniciaisFechamento();
    setDadosFechamento();
    setAvaliacoesTabelaFechamento();
  };

  const obterFechamentoPorBimestre = useCallback(async () => {
    let dadosChavesFechamento = {};
    const respostaChaves = await ServicoFechamentoBimestre.obterChavesFechamentoListao(
      turmaSelecionada?.id,
      bimestreOperacoes
    ).catch(e => erros(e));

    if (respostaChaves.data) {
      dadosChavesFechamento = respostaChaves.data;
    }

    obterDaodsFechamentoPorBimestreListao(
      setExibirLoaderGeral,
      turmaSelecionada,
      bimestreOperacoes,
      componenteCurricular,
      setDadosFechamento,
      setDadosIniciaisFechamento,
      limparFechamento,
      dadosChavesFechamento
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
