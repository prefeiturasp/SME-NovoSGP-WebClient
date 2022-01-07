import _ from 'lodash';
import React, { useCallback, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Alert } from '~/componentes';
import notasConceitos from '~/dtos/notasConceitos';
import { erros } from '~/servicos';
import ServicoNotaConceito from '~/servicos/Paginas/DiarioClasse/ServicoNotaConceito';
import ServicoNotas from '~/servicos/ServicoNotas';
import ListaoContext from '../../../listaoContext';
import ListaoListaAvaliacoes from './listaoListaAvaliacoes';
import { mockAvaliacao } from './mockAvaliacao';
// import { mockAvaliacaoRegente } from './mockAvaliacaoRegente';

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
  }, [componenteCurricular, turmaSelecionada, bimestreOperacoes]);

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

  const obterListaAlunosAvaliacao = useCallback(async () => {
    const dadosBimestreSelecionado = dadosPeriodosAvaliacao.find(
      item => String(item.bimestre) === String(bimestreOperacoes)
    );
    const params = {
      anoLetivo: turmaSelecionada.anoLetivo,
      bimestre: bimestreOperacoes,
      disciplinaCodigo: componenteCurricular.codigoComponenteCurricular,
      modalidade: turmaSelecionada.modalidade,
      turmaCodigo: turmaSelecionada.turma,
      turmaId: turmaSelecionada.id,
      turmaHistorico: turmaSelecionada.consideraHistorico,
      semestre: turmaSelecionada.periodo,
      periodoInicioTicks: dadosBimestreSelecionado?.periodoInicioTicks,
      periodoFimTicks: dadosBimestreSelecionado?.periodoFimTicks,
      periodoEscolarId: dadosBimestreSelecionado?.periodoEscolarId,
    };
    setExibirLoaderGeral(true);
    const resposta = await ServicoNotas.obterDadosAvaliacoesListao({
      params,
    })
      .catch(e => erros(e))
      .finally(() => setExibirLoaderGeral(false));

    if (resposta.data) {
      // TODO - Remover mock!
      resposta.data = mockAvaliacao;
      // resposta.data = mockAvaliacaoRegente;

      let listaTiposConceitos = [];
      const { notaTipo } = resposta.data;
      const ehTipoConceito = notasConceitos.Conceitos === notaTipo;
      const naoEhTipoNota = notasConceitos.Notas !== notaTipo;
      if (ehTipoConceito || naoEhTipoNota) {
        const { periodoFim } = resposta.data.bimestres[0];
        listaTiposConceitos = await obterListaConceitos(periodoFim);
      }
      resposta.data.listaTiposConceitos = listaTiposConceitos;

      const dadosCarregar = _.cloneDeep(resposta.data);
      const dadosIniciais = _.cloneDeep(resposta.data);
      setDadosAvaliacao(dadosCarregar);
      setDadosIniciaisAvaliacao(dadosIniciais);
    } else {
      limparDadosAvaliacao();
    }
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
  }, [dadosPeriodosAvaliacao]);

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
        <></>
      )}
      <ListaoListaAvaliacoes />
    </>
  );
};

export default TabListaoAvaliacoes;
