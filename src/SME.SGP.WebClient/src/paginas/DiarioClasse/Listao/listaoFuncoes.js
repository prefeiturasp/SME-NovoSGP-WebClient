import _ from 'lodash';
import ServicoObservacoesUsuario from '~/componentes-sgp/ObservacoesUsuario/ServicoObservacoesUsuario';
import notasConceitos from '~/dtos/notasConceitos';
import { store } from '~/redux';
import { confirmar, erros, ServicoDiarioBordo, sucesso } from '~/servicos';
import ServicoNotaConceito from '~/servicos/Paginas/DiarioClasse/ServicoNotaConceito';
import ServicoNotas from '~/servicos/ServicoNotas';

const onChangeTabListao = async (
  tabAtiva,
  setTabAtual,
  acaoLimparTelaAntesTrocarAba
) => {
  const state = store.getState();

  const { geral } = state;
  if (geral?.telaEmEdicao && geral?.acaoTelaEmEdicao) {
    const salvou = await geral.acaoTelaEmEdicao();
    if (salvou) {
      acaoLimparTelaAntesTrocarAba();
      setTabAtual(tabAtiva);
    }
  } else {
    acaoLimparTelaAntesTrocarAba();
    setTabAtual(tabAtiva);
  }
};

const montarIdsObjetivosSelecionadosListao = planos => {
  planos.forEach(plano => {
    if (plano?.objetivosAprendizagemComponente?.length) {
      let ids = [];
      plano.objetivosAprendizagemComponente.forEach(objetivo => {
        const idsObjetivo = objetivo.objetivosAprendizagem.map(ob => ob.id);
        ids = ids.concat(idsObjetivo);
      });
      plano.idsObjetivosAprendizagemSelecionados = ids;
    }
  });
};

const obterDiarioBordoListao = async (
  turmaSelec,
  periodoSelecionado,
  componenteCurricularDiarioBordoSelecionado,
  setExibirLoaderGeral,
  setDadosDiarioBordo,
  setDadosIniciaisDiarioBordo
) => {
  setExibirLoaderGeral(true);
  setDadosDiarioBordo([]);
  setDadosIniciaisDiarioBordo([]);
  const retorno = await ServicoDiarioBordo.obterDiarioBordoListao(
    turmaSelec,
    periodoSelecionado?.dataInicio,
    periodoSelecionado?.dataFim,
    componenteCurricularDiarioBordoSelecionado
  )
    .catch(e => erros(e))
    .finally(() => setExibirLoaderGeral(false));

  if (retorno?.data?.length) {
    const lista = retorno.data;

    const dadosCarregar = _.cloneDeep(lista);
    const dadosIniciais = _.cloneDeep(lista);
    setDadosDiarioBordo([...dadosCarregar]);
    setDadosIniciaisDiarioBordo([...dadosIniciais]);
  } else {
    setDadosDiarioBordo([]);
    setDadosIniciaisDiarioBordo([]);
  }

  return true;
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

const obterListaAlunosAvaliacaoListao = async (
  dadosPeriodosAvaliacao,
  bimestreOperacoes,
  turmaSelecionada,
  componenteCurricular,
  setExibirLoaderGeral,
  setDadosAvaliacao,
  setDadosIniciaisAvaliacao
) => {
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

  if (resposta?.data) {
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
    setDadosIniciaisAvaliacao();
    setDadosAvaliacao();
  }
};

const salvarEditarObservacao = async (
  valor,
  IdDiarioBordo,
  setExibirLoaderGeral
) => {
  const { observacoesUsuario } = store.getState();
  const { novaObservacao } = observacoesUsuario;

  const observacao = valor?.observacao || novaObservacao;
  const idObs = valor?.id;
  const usuariosIdNotificacao = [];

  let observacaoId = idObs;

  const params = {
    observacao,
    usuariosIdNotificacao,
    id: idObs,
  };

  setExibirLoaderGeral(true);
  const resultado = await ServicoDiarioBordo.salvarEditarObservacao(
    IdDiarioBordo,
    params
  )
    .catch(e => erros(e))
    .finally(() => setExibirLoaderGeral(false));

  if (resultado?.status === 200) {
    sucesso(`Observação ${idObs ? 'alterada' : 'inserida'} com sucesso`);
    if (!observacaoId) {
      observacaoId = resultado.data.id;
    }

    ServicoObservacoesUsuario.atualizarSalvarEditarDadosObservacao(
      valor,
      resultado.data
    );
  }
  return resultado;
};

const excluirObservacao = async (obs, setExibirLoaderGeral) => {
  const confirmado = await confirmar(
    'Excluir',
    '',
    'Você tem certeza que deseja excluir este registro?'
  );

  if (confirmado) {
    setExibirLoaderGeral(true);
    const resultado = await ServicoDiarioBordo.excluirObservacao(obs)
      .catch(e => erros(e))
      .finally(() => setExibirLoaderGeral(false));

    if (resultado?.status === 200) {
      sucesso('Registro excluído com sucesso');
      ServicoDiarioBordo.atualizarExcluirDadosObservacao(obs, resultado.data);
    }
  }
};

const salvarFechamentoListao = (
  clicouNoBotaoSalvar,
  setExibirModalJustificativaFechamento,
  dadosFechamento
) => {
  const dadosValidar = _.cloneDeep(dadosFechamento);

  dadosValidar.alunos.map(aluno => {
    aluno.notasBimestre = aluno.notasConceitoBimestre;
    return aluno;
  });
  const temPorcentagemAceitavel = ServicoNotas.temQuantidadeMinimaAprovada(
    dadosValidar,
    dadosFechamento?.percentualAlunosInsuficientes,
    Number(dadosFechamento?.notaTipo)
  );

  if (!temPorcentagemAceitavel) {
    setExibirModalJustificativaFechamento(true);
  } else {
    // TODO - Salvar fechamento do listão!
  }
};

export {
  onChangeTabListao,
  montarIdsObjetivosSelecionadosListao,
  obterDiarioBordoListao,
  obterListaAlunosAvaliacaoListao,
  salvarEditarObservacao,
  excluirObservacao,
  salvarFechamentoListao,
};
