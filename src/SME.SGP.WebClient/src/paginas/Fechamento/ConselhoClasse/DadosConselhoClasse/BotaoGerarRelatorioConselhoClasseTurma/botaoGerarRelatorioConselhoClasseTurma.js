import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '~/componentes';
import Button from '~/componentes/button';
import {
  setDadosBimestresConselhoClasse,
  setExibirLoaderGeralConselhoClasse,
  setExibirModalImpressaoConselhoClasse,
} from '~/redux/modulos/conselhoClasse/actions';
import { erro, erros } from '~/servicos/alertas';
import ServicoConselhoClasse from '~/servicos/Paginas/ConselhoClasse/ServicoConselhoClasse';

const BotaoGerarRelatorioConselhoClasseTurma = () => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const dispatch = useDispatch();

  const obterDadosBimestresConselhoClasse = useCallback(async () => {
    let dados = [];
    if (turmaSelecionada?.id) {
      dispatch(setExibirLoaderGeralConselhoClasse(true));
      const retorno = await ServicoConselhoClasse.obterDadosBimestres(
        turmaSelecionada?.id
      )
        .catch(e => erros(e))
        .finally(() => dispatch(setExibirLoaderGeralConselhoClasse(false)));

      if (retorno?.data?.length) {
        dispatch(setDadosBimestresConselhoClasse([...retorno.data]));
        dados = retorno.data;
      } else {
        dispatch(setDadosBimestresConselhoClasse([]));
      }
    } else {
      dispatch(setDadosBimestresConselhoClasse([]));
    }
    return dados;
  }, [dispatch, turmaSelecionada]);

  const onClickImprimir = async () => {
    const retorno = await obterDadosBimestresConselhoClasse();
    if (retorno?.length) {
      dispatch(setExibirModalImpressaoConselhoClasse(true));
    } else {
      erro(
        'Não foi encontrado nenhum registro de conselho de classe para a turma selecionada.'
      );
    }
  };

  return (
    <Button
      className="btn-imprimir"
      icon="print"
      color={Colors.Azul}
      border
      onClick={onClickImprimir}
      id="btn-imprimir-relatorio-pendencias"
    />
  );
};

export default BotaoGerarRelatorioConselhoClasseTurma;
