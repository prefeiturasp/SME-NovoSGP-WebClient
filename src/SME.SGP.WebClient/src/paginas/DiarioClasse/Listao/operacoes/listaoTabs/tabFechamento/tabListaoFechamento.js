import _ from 'lodash';
import React, { useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from '~/componentes';
import notasConceitos from '~/dtos/notasConceitos';
import { setLimparModoEdicaoGeral } from '~/redux/modulos/geral/actions';
import { erros } from '~/servicos';
import ServicoFechamentoBimestre from '~/servicos/Paginas/Fechamento/ServicoFechamentoBimestre';
import ServicoNotaConceito from '~/servicos/Paginas/DiarioClasse/ServicoNotaConceito';
import ListaoContext from '../../../listaoContext';
import ListaoListaFechamento from './listaoListaFechamento';
import { ModalidadeDTO } from '~/dtos';

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

  const obterListaConceitos = async periodoFim => {
    const resposta = await ServicoNotaConceito.obterTodosConceitos(
      periodoFim
    ).catch(e => erros(e));

    if (resposta?.data?.length) {
      const novaLista = resposta.data.map(item => {
        item.id = String(item.id);
        return item;
      });
      return novaLista;
    }
    return [];
  };

  const obterFechamentoPorBimestre = useCallback(async () => {
    setExibirLoaderGeral(true);
    const resposta = await ServicoFechamentoBimestre.obterFechamentoPorBimestre(
      turmaSelecionada?.turma,
      turmaSelecionada?.periodo,
      bimestreOperacoes,
      componenteCurricular?.codigoComponenteCurricular
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoaderGeral(false));

    if (resposta?.data) {
      let listaTiposConceitos = [];
      if (notasConceitos.Conceitos === Number(resposta?.data?.notaTipo)) {
        listaTiposConceitos = await obterListaConceitos(
          resposta?.data?.periodoFim
        );
      }
      resposta.data.listaTiposConceitos = listaTiposConceitos;

      const dadosCarregar = _.cloneDeep({ ...resposta.data });
      const dadosIniciais = _.cloneDeep({ ...resposta.data });
      setDadosFechamento(dadosCarregar);
      setDadosIniciaisFechamento(dadosIniciais);
    } else {
      limparFechamento();
      setExibirLoaderGeral(false);
    }
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
        <ListaoListaFechamento
          ehEJA={Number(turmaSelecionada?.modalidade) === ModalidadeDTO.EJA}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default TabListaoFechamento;
