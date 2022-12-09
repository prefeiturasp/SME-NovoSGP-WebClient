import _ from 'lodash';
import { store } from '~/redux';
import { erros, sucesso, confirmar, erro } from '~/servicos/alertas';
import ServicoConselhoClasse from '~/servicos/Paginas/ConselhoClasse/ServicoConselhoClasse';
import {
  setDadosPrincipaisConselhoClasse,
  setConselhoClasseEmEdicao,
  setExpandirLinha,
  setIdCamposNotasPosConselho,
  setNotaConceitoPosConselhoAtual,
  setGerandoParecerConclusivo,
  setExibirLoaderGeralConselhoClasse,
  setBimestreAtual,
  setDadosIniciaisListasNotasConceitos,
  setAuditoriaAnotacaoRecomendacao,
  setDadosListasNotasConceitos,
  setRecomendacaoAlunoSelecionados,
  setRecomendacaoFamiliaSelecionados,
} from '~/redux/modulos/conselhoClasse/actions';
import notasConceitos from '~/dtos/notasConceitos';

class ServicoSalvarConselhoClasse {
  recarregarDados = () => {
    const { dispatch } = store;
    const state = store.getState();

    const { conselhoClasse } = state;

    const { bimestreAtual } = conselhoClasse;

    dispatch(setConselhoClasseEmEdicao(false));
    dispatch(
      setBimestreAtual({
        valor: bimestreAtual.valor,
        dataInicio: bimestreAtual.dataInicio,
        dataFim: bimestreAtual.dataFim,
      })
    );
    dispatch(setExpandirLinha([]));
    dispatch(setNotaConceitoPosConselhoAtual({}));
    dispatch(setIdCamposNotasPosConselho({}));
    dispatch(setRecomendacaoAlunoSelecionados([]));
    dispatch(setRecomendacaoFamiliaSelecionados([]));
  };

  validarSalvarRecomendacoesAlunoFamilia = async (salvarSemValidar = false) => {
    const { dispatch } = store;
    const state = store.getState();

    const { conselhoClasse } = state;

    const {
      dadosPrincipaisConselhoClasse,
      dadosAlunoObjectCard,
      anotacoesPedagogicas,
      recomendacaoAluno,
      recomendacaoFamilia,
      conselhoClasseEmEdicao,
      desabilitarCampos,
      bimestreAtual,
      recomendacaoFamiliaSelecionados,
      recomendacaoAlunoSelecionados,
    } = conselhoClasse;

    const perguntaDescartarRegistros = async () => {
      return confirmar(
        'Atenção',
        '',
        'Anotações e recomendações ainda não foram salvas, deseja descartar?'
      );
    };

    const salvar = async () => {
      if (!recomendacaoAluno && !recomendacaoAlunoSelecionados?.length) {
        erro('É obrigatório informar ou selecionar Recomendações ao estudante');
        return false;
      }

      if (!recomendacaoFamilia && !recomendacaoFamiliaSelecionados?.length) {
        erro('É obrigatório informar ou selecionar Recomendações a família ');
        return false;
      }

      const params = {
        conselhoClasseId: dadosPrincipaisConselhoClasse.conselhoClasseId,
        fechamentoTurmaId: dadosPrincipaisConselhoClasse.fechamentoTurmaId || 0,
        alunoCodigo: dadosAlunoObjectCard.codigoEOL,
        anotacoesPedagogicas,
        recomendacaoAluno,
        recomendacaoFamilia,
        recomendacaoFamiliaIds: recomendacaoFamiliaSelecionados?.length
          ? recomendacaoFamiliaSelecionados.map(item => item.id)
          : [],
        recomendacaoAlunoIds: recomendacaoAlunoSelecionados?.length
          ? recomendacaoAlunoSelecionados.map(item => item.id)
          : [],
      };
      dispatch(setExibirLoaderGeralConselhoClasse(true));
      const retorno = await ServicoConselhoClasse.salvarRecomendacoesAlunoFamilia(
        params
      )
        .finally(() => {
          dispatch(setExibirLoaderGeralConselhoClasse(false));
        })
        .catch(e => {
          dispatch(setExibirLoaderGeralConselhoClasse(false));
          erros(e);
        });

      if (retorno && retorno.status === 200) {
        sucesso('Anotações e recomendações salvas com sucesso.');
        if (bimestreAtual?.valor === 'final') {
          this.gerarParecerConclusivo(
            dadosPrincipaisConselhoClasse.conselhoClasseId,
            dadosPrincipaisConselhoClasse.fechamentoTurmaId,
            dadosAlunoObjectCard.codigoEOL
          );
        }
        if (
          !params?.conselhoClasseId ||
          !dadosPrincipaisConselhoClasse.conselhoClasseAlunoId
        ) {
          dadosPrincipaisConselhoClasse.conselhoClasseId =
            retorno.data.conselhoClasseId;
          dadosPrincipaisConselhoClasse.conselhoClasseAlunoId = retorno.data.id;
          dispatch(
            setDadosPrincipaisConselhoClasse(dadosPrincipaisConselhoClasse)
          );
        }
        this.recarregarDados();
        return true;
      }
      return false;
    };

    if (desabilitarCampos) {
      return true;
    }

    if (salvarSemValidar && conselhoClasseEmEdicao) {
      return salvar();
    }

    if (conselhoClasseEmEdicao) {
      const temRegistrosInvalidosDigitados =
        !recomendacaoAluno || !recomendacaoFamilia;
      const contemRecomendacoesFamiliaAlunoSelecionados =
        recomendacaoFamiliaSelecionados?.length > 0 ||
        recomendacaoAlunoSelecionados?.length > 0;
      let descartarRegistros = false;

      if (temRegistrosInvalidosDigitados) {
        if (!contemRecomendacoesFamiliaAlunoSelecionados)
          descartarRegistros = await perguntaDescartarRegistros();
      }

      // Voltar para a tela continua e executa a ação!
      if (descartarRegistros) {
        dispatch(setConselhoClasseEmEdicao(false));
        return true;
      }

      // Voltar para a tela e não executa a ação!
      if (
        !descartarRegistros &&
        temRegistrosInvalidosDigitados &&
        !contemRecomendacoesFamiliaAlunoSelecionados
      ) {
        return false;
      }

      // Tenta salvar os registros se estão válidos e continuar para executação a ação!
      const perguntaAantesSalvar = true;
      if (perguntaAantesSalvar) return salvar();
    }
    return true;
  };

  validaParecerConclusivo = async (
    conselhoClasseId,
    fechamentoTurmaId,
    alunoCodigo,
    codigoTurma,
    consideraHistorico
  ) => {
    const resposta = await ServicoConselhoClasse.acessarParecerConclusivo(
      conselhoClasseId,
      fechamentoTurmaId,
      alunoCodigo,
      codigoTurma,
      consideraHistorico
    ).catch(e => erros(e));
    if (resposta?.data) {
      ServicoConselhoClasse.setarParecerConclusivo(resposta.data);
      return true;
    }
    return false;
  };

  gerarParecerConclusivo = async (
    conselhoClasseId,
    fechamentoTurmaId,
    alunoCodigo
  ) => {
    const { dispatch } = store;

    dispatch(setGerandoParecerConclusivo(true));
    const retorno = await ServicoConselhoClasse.gerarParecerConclusivo(
      conselhoClasseId,
      fechamentoTurmaId,
      alunoCodigo
    ).catch(e => erros(e));
    if (retorno && retorno.data) {
      if (retorno?.data?.emAprovacao) {
        sucesso(
          'Parecer conclusivo alterado com sucesso. Em até 24 horas será enviado para aprovação e será considerado válido após a aprovação do último nível'
        );
      }
      ServicoConselhoClasse.setarParecerConclusivo(retorno.data);
    }
    dispatch(setGerandoParecerConclusivo(false));
  };

  salvarNotaPosConselho = async codigoTurma => {
    const { dispatch } = store;

    const state = store.getState();

    const { conselhoClasse } = state;

    const {
      dadosPrincipaisConselhoClasse,
      notaConceitoPosConselhoAtual,
      desabilitarCampos,
      bimestreAtual,
    } = conselhoClasse;

    const {
      conselhoClasseId,
      fechamentoTurmaId,
      alunoCodigo,
      tipoNota,
      turmaCodigo,
    } = dadosPrincipaisConselhoClasse;

    const {
      justificativa,
      nota,
      conceito,
      codigoComponenteCurricular,
    } = notaConceitoPosConselhoAtual;

    const ehNota = Number(tipoNota) === notasConceitos.Notas;

    const limparDadosNotaPosConselhoJustificativa = () => {
      dispatch(setExpandirLinha([]));
      dispatch(setNotaConceitoPosConselhoAtual({}));
    };

    if (bimestreAtual?.valor === 'final') {
      this.gerarParecerConclusivo(
        conselhoClasseId,
        fechamentoTurmaId,
        alunoCodigo
      );
    }

    if (desabilitarCampos) {
      return false;
    }

    if (!justificativa) {
      erro(
        `É obrigatório informar justificativa de ${
          ehNota ? 'nota' : 'conceito'
        } pós-conselho`
      );
      return false;
    }

    if (
      (nota === null || typeof nota === 'undefined') &&
      !conceito &&
      !justificativa
    ) {
      erro(
        `É obrigatório informar ${ehNota ? 'nota' : 'conceito'} pós-conselho`
      );
      return false;
    }

    const notaDto = {
      justificativa,
      nota: ehNota ? nota : null,
      conceito: !ehNota ? conceito : null,
      codigoComponenteCurricular,
    };

    const retorno = await ServicoConselhoClasse.salvarNotaPosConselho(
      conselhoClasseId,
      fechamentoTurmaId,
      alunoCodigo,
      notaDto,
      codigoTurma,
      bimestreAtual.valor
    ).catch(e => erros(e));

    if (retorno && retorno.status === 200) {
      dadosPrincipaisConselhoClasse.conselhoClasseId =
        retorno.data.conselhoClasseId;
      dadosPrincipaisConselhoClasse.fechamentoTurmaId =
        retorno.data.fechamentoTurmaId;

      const { consideraHistorico } = state.usuario.turmaSelecionada;
      const bimestre =
        bimestreAtual?.valor === 'final' ? 0 : bimestreAtual?.valor;

      const resultado = await ServicoConselhoClasse.obterNotasConceitosConselhoClasse(
        conselhoClasseId,
        fechamentoTurmaId,
        alunoCodigo,
        turmaCodigo,
        bimestre,
        consideraHistorico
      );

      dispatch(setDadosPrincipaisConselhoClasse(dadosPrincipaisConselhoClasse));

      const { auditoria, emAprovacao } = retorno.data;

      let auditoriaDto = null;
      if (auditoria) {
        auditoriaDto = {
          criadoEm: auditoria.criadoEm,
          criadoPor: auditoria.criadoPor,
          criadoRF: auditoria.criadoRF,
          alteradoEm: auditoria.alteradoEm,
          alteradoPor: auditoria.alteradoPor,
          alteradoRF: auditoria.alteradoRF,
        };
      }
      dispatch(setAuditoriaAnotacaoRecomendacao(auditoriaDto));

      limparDadosNotaPosConselhoJustificativa();

      const mensagemSucesso = `${ehNota ? 'Nota' : 'Conceito'} pós-conselho ${
        ehNota ? 'salva' : 'salvo'
      } com sucesso`;

      if (emAprovacao) {
        sucesso(
          `${mensagemSucesso}. Em até 24 horas será enviado para aprovação e será considerado válido após a aprovação do último nível.`
        );
      } else {
        sucesso(mensagemSucesso);
      }

      if (bimestreAtual && bimestreAtual.valor === 'final') {
        this.gerarParecerConclusivo(
          conselhoClasseId,
          fechamentoTurmaId,
          alunoCodigo
        );
      }

      const dadosCarregar = _.cloneDeep(resultado.data.notasConceitos);
      dispatch(setDadosIniciaisListasNotasConceitos([...dadosCarregar]));
      dispatch(setDadosListasNotasConceitos(resultado.data.notasConceitos));
      return true;
    }
    return false;
  };

  validarNotaPosConselho = async () => {
    const { dispatch } = store;

    const limparDadosNotaPosConselhoJustificativa = () => {
      dispatch(setExpandirLinha([]));
      dispatch(setNotaConceitoPosConselhoAtual({}));
    };

    const state = store.getState();

    const { conselhoClasse } = state;

    const {
      notaConceitoPosConselhoAtual,
      dadosPrincipaisConselhoClasse,
      desabilitarCampos,
      dadosIniciaisListasNotasConceitos,
    } = conselhoClasse;

    if (desabilitarCampos) {
      return true;
    }

    const { tipoNota } = dadosPrincipaisConselhoClasse;

    const { ehEdicao } = notaConceitoPosConselhoAtual;

    const ehNota = Number(tipoNota) === notasConceitos.Notas;

    const perguntaDescartarRegistros = async () => {
      return confirmar(
        'Atenção',
        '',
        `${ehNota ? 'Nota' : 'Conceito'} pós-conselho não foi ${
          ehNota ? 'salva' : 'salvo'
        }, deseja descartar?`
      );
    };

    if (ehEdicao) {
      const descartarRegistros = await perguntaDescartarRegistros();

      // Voltar para a tela continua e executa a ação!
      if (descartarRegistros) {
        limparDadosNotaPosConselhoJustificativa();
        const dadosCarregar = _.cloneDeep(dadosIniciaisListasNotasConceitos);
        dispatch(setDadosListasNotasConceitos([...dadosCarregar]));
        return true;
      }

      // Voltar para a tela e não executa a ação!
      return false;
    }

    return true;
  };
}

export default new ServicoSalvarConselhoClasse();
