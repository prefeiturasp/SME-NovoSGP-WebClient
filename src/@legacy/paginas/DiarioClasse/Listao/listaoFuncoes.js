import _ from 'lodash';
import ServicoObservacoesUsuario from '~/componentes-sgp/ObservacoesUsuario/ServicoObservacoesUsuario';
import { BIMESTRE_FINAL } from '~/constantes';
import notasConceitos from '~/dtos/notasConceitos';
import { store } from '@/core/redux';
import { setTelaEmEdicao } from '~/redux/modulos/geral/actions';
import { confirmar, erros, ServicoDiarioBordo, sucesso } from '~/servicos';
import ServicoNotaConceito from '~/servicos/Paginas/DiarioClasse/ServicoNotaConceito';
import ServicoFechamentoBimestre from '~/servicos/Paginas/Fechamento/ServicoFechamentoBimestre';
import ServicoNotas from '~/servicos/ServicoNotas';

const onChangeTabListao = async (
  tabAtiva,
  setTabAtual,
  acaoLimparTelaAntesTrocarAba
) => {
  const state = store.getState();

  const { geral } = state;
  if (geral?.telaEmEdicao && geral?.acaoTelaEmEdicao) {
    const salvou = await geral.acaoTelaEmEdicao(() => {
      acaoLimparTelaAntesTrocarAba();
      setTabAtual(tabAtiva);
    });
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
  const { dispatch, getState } = store;
  const { observacoesUsuario } = getState();
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

    dispatch(setTelaEmEdicao(false));
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

const obterDaodsFechamentoPorBimestreListao = async (
  setExibirLoaderGeral,
  turmaSelecionada,
  bimestreOperacoes,
  componenteCurricular,
  setDadosFechamento,
  setDadosIniciaisFechamento,
  limparFechamento
) => {
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

    limparFechamento();
    const dadosCarregar = _.cloneDeep({ ...resposta.data });
    const dadosIniciais = _.cloneDeep({ ...resposta.data });
    setDadosFechamento(dadosCarregar);
    setDadosIniciaisFechamento(dadosIniciais);
  } else {
    limparFechamento();
    setExibirLoaderGeral(false);
  }
};

const mudarStatusEdicaoAlunos = dados => {
  const alunosEmEdicao = dados?.alunos.filter(
    a =>
      a.notasConceitoFinal.find(m => m.modoEdicao) ||
      a.notasConceitoBimestre.find(m => m.modoEdicao)
  );

  if (alunosEmEdicao?.length) {
    alunosEmEdicao.forEach(aluno => {
      if (aluno?.notasConceitoBimestre?.length) {
        aluno.notasConceitoBimestre.forEach(nota => {
          nota.modoEdicao = false;
        });
      }

      if (aluno?.notasConceitoFinal?.length) {
        aluno.notasConceitoFinal.forEach(nota => {
          nota.modoEdicao = false;
        });
      }
    });
  }
};

const mudarStatusEmAprovacaoAlunosPorBimestre = (
  dadosAtualizar,
  dadosAlunosAlterados
) => {
  if (dadosAtualizar?.alunos?.length) {
    const nomeRef = dadosAlunosAlterados?.ehFinal
      ? 'notasConceitoFinal'
      : 'notasConceitoBimestre';

    dadosAtualizar.alunos.forEach(aluno => {
      aluno[nomeRef].forEach(nota => {
        if (dadosAlunosAlterados?.ehRegencia) {
          const ehNotaDisciplinaAlterada =
            dadosAlunosAlterados?.notaConceitoAlunos?.find(
              a =>
                a?.codigoAluno === aluno?.codigoAluno &&
                a?.disciplinaId &&
                nota?.disciplinaCodigo &&
                a?.disciplinaId === nota?.disciplinaCodigo
            );

          if (ehNotaDisciplinaAlterada) {
            nota.emAprovacao = true;
          }
        } else {
          const ehNotaAlterada = dadosAlunosAlterados?.notaConceitoAlunos?.find(
            a => a?.codigoAluno === aluno?.codigoAluno
          );
          if (ehNotaAlterada) {
            nota.emAprovacao = true;
          }
        }
      });
    });
  }
};

const salvarFechamentoListao = async (
  turma,
  ehBimestreFinal,
  dadosFechamento,
  bimestreOperacoes,
  setExibirLoaderGeral,
  componenteCurricular,
  setDadosFechamento,
  setDadosIniciaisFechamento
) => {
  const notaConceitoAlunos = [];
  const ehNota = Number(dadosFechamento?.notaTipo) === notasConceitos.Notas;

  const nomeRef = ehBimestreFinal
    ? 'notasConceitoFinal'
    : 'notasConceitoBimestre';

  dadosFechamento.alunos.forEach(aluno => {
    aluno[nomeRef].forEach(dadosNotaConceito => {
      if (dadosNotaConceito.modoEdicao) {
        notaConceitoAlunos.push({
          codigoAluno: aluno.codigoAluno,
          nota: ehNota ? dadosNotaConceito.notaConceito ?? null : null,
          conceitoId: !ehNota ? dadosNotaConceito.notaConceito || null : null,
          disciplinaId:
            dadosNotaConceito.disciplinaCodigo ||
            componenteCurricular?.codigoComponenteCurricular,
        });
      }
    });
  });

  const dadosParaSalvar = {
    id: dadosFechamento.fechamentoId,
    turmaId: turma,
    bimestre: bimestreOperacoes,
    disciplinaId: componenteCurricular?.codigoComponenteCurricular,
    notaConceitoAlunos,
    justificativa: dadosFechamento?.justificativa || null,
    ehRegencia: componenteCurricular?.regencia,
    ehFinal: ehBimestreFinal,
  };

  setExibirLoaderGeral(true);
  const resposta = await ServicoFechamentoBimestre.salvarFechamentoPorBimestre(
    dadosParaSalvar
  )
    .catch(e => erros(e))
    .finally(() => setExibirLoaderGeral(false));

  if (resposta?.status === 200) {
    sucesso(resposta.data.mensagemConsistencia);
    const { dispatch } = store;

    mudarStatusEdicaoAlunos(dadosFechamento);

    if (resposta?.data?.emAprovacao) {
      mudarStatusEmAprovacaoAlunosPorBimestre(dadosFechamento, dadosParaSalvar);
    }

    dispatch(setTelaEmEdicao(false));
    const dadosComAuditoriaAtualizada = { ...dadosFechamento };
    dadosComAuditoriaAtualizada.auditoriaAlteracao =
      resposta.data.auditoriaAlteracao;
    dadosComAuditoriaAtualizada.auditoriaInclusao =
      resposta.data.auditoriaInclusao;
    dadosComAuditoriaAtualizada.situacao = resposta.data.situacao;
    dadosComAuditoriaAtualizada.dataFechamento = resposta.data.dataFechamento;
    dadosComAuditoriaAtualizada.situacaoNome = resposta.data.situacaoNome;
    const dadosCarregar = _.cloneDeep({ ...dadosComAuditoriaAtualizada });
    const dadosIniciais = _.cloneDeep({ ...dadosComAuditoriaAtualizada });
    setDadosFechamento(dadosCarregar);
    setDadosIniciaisFechamento(dadosIniciais);
    return true;
  }

  return false;
};

const validarSalvarFechamentoListao = async (
  turma,
  dadosFechamento,
  bimestreOperacoes,
  setExibirLoaderGeral,
  setExibirModalJustificativaFechamento,
  componenteCurricular,
  acaoPosSalvar,
  setDadosFechamento,
  setDadosIniciaisFechamento
) => {
  const temAvaliacoesBimestraisPendentes = dadosFechamento?.observacoes?.length;
  let continuarSalvar = true;

  if (temAvaliacoesBimestraisPendentes) {
    continuarSalvar = await confirmar(
      'Atenção',
      dadosFechamento.observacoes,
      'Deseja continuar mesmo assim com o fechamento do(s) bimestre(s)?'
    );
  }

  if (!continuarSalvar) return false;

  const ehBimestreFinal = String(bimestreOperacoes) === BIMESTRE_FINAL;

  if (ehBimestreFinal)
    return salvarFechamentoListao(
      turma,
      ehBimestreFinal,
      dadosFechamento,
      bimestreOperacoes,
      setExibirLoaderGeral,
      componenteCurricular,
      setDadosFechamento,
      setDadosIniciaisFechamento
    );

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
    setExibirModalJustificativaFechamento({
      acaoPosSalvar,
      exibirModal: true,
    });
    return false;
  }

  return salvarFechamentoListao(
    turma,
    ehBimestreFinal,
    dadosFechamento,
    bimestreOperacoes,
    setExibirLoaderGeral,
    componenteCurricular,
    setDadosFechamento,
    setDadosIniciaisFechamento
  );
};

const obterDescricaoConceito = (listaTiposConceitos, valorConceito) => {
  if (listaTiposConceitos?.length) {
    const conceito = listaTiposConceitos.find(
      item => item.id === String(valorConceito)
    );
    return conceito?.valor || '';
  }
  return '';
};

export {
  onChangeTabListao,
  montarIdsObjetivosSelecionadosListao,
  obterDiarioBordoListao,
  obterListaAlunosAvaliacaoListao,
  salvarEditarObservacao,
  excluirObservacao,
  obterDaodsFechamentoPorBimestreListao,
  validarSalvarFechamentoListao,
  salvarFechamentoListao,
  obterDescricaoConceito,
};
