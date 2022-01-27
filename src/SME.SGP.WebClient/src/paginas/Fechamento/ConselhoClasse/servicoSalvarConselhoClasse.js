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
  setAtualizarEmAprovacao,
  setBimestreAtual,
  setDadosIniciaisListasNotasConceitos,
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
    } = conselhoClasse;

    const perguntaDescartarRegistros = async () => {
      return confirmar(
        'Atenção',
        '',
        'Anotações e recomendações ainda não foram salvas, deseja descartar?'
      );
    };

    const salvar = async () => {
      const params = {
        conselhoClasseId: dadosPrincipaisConselhoClasse.conselhoClasseId,
        fechamentoTurmaId: dadosPrincipaisConselhoClasse.fechamentoTurmaId || 0,
        alunoCodigo: dadosAlunoObjectCard.codigoEOL,
        anotacoesPedagogicas,
        recomendacaoAluno,
        recomendacaoFamilia,
      };

      if (!recomendacaoAluno) {
        erro('É obrigatório informar Recomendações ao estudante');
        return false;
      }

      if (!recomendacaoFamilia) {
        erro('É obrigatório informar Recomendações a família ');
        return false;
      }
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
        this.recarregarDados();
        sucesso('Anotações e recomendações salvas com sucesso.');
        if (bimestreAtual?.valor === 'final') {
          this.gerarParecerConclusivo(
            dadosPrincipaisConselhoClasse.conselhoClasseId,
            dadosPrincipaisConselhoClasse.fechamentoTurmaId,
            dadosAlunoObjectCard.codigoEOL
          );
        }
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
      const temRegistrosInvalidos = !recomendacaoAluno || !recomendacaoFamilia;

      let descartarRegistros = false;
      if (temRegistrosInvalidos) {
        descartarRegistros = await perguntaDescartarRegistros();
      }

      // Voltar para a tela continua e executa a ação!
      if (descartarRegistros) {
        dispatch(setConselhoClasseEmEdicao(false));
        return true;
      }

      // Voltar para a tela e não executa a ação!
      if (!descartarRegistros && temRegistrosInvalidos) {
        return false;
      }

      const perguntarParaSalvar = async () => {
        return confirmar(
          'Atenção',
          '',
          'Suas alterações não foram salvas, deseja salvar agora?'
        );
      };

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
      idCamposNotasPosConselho,
      desabilitarCampos,
      bimestreAtual,
      dadosListasNotasConceitos,
    } = conselhoClasse;

    const {
      conselhoClasseId,
      fechamentoTurmaId,
      alunoCodigo,
      tipoNota,
    } = dadosPrincipaisConselhoClasse;

    const {
      justificativa,
      nota,
      conceito,
      codigoComponenteCurricular,
      idCampo,
    } = notaConceitoPosConselhoAtual;

    const ehNota = Number(tipoNota) === notasConceitos.Notas;

    const limparDadosNotaPosConselhoJustificativa = () => {
      dispatch(setExpandirLinha([]));
      dispatch(setNotaConceitoPosConselhoAtual({}));
    };

    this.gerarParecerConclusivo(
      conselhoClasseId,
      fechamentoTurmaId,
      alunoCodigo
    );

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

    if ((nota === null || typeof nota === 'undefined') && !conceito) {
      erro(
        `É obrigatório informar ${ehNota ? 'nota' : 'conceito'} pós-conselho`
      );
      return false;
    }

    const notaDto = {
      justificativa,
      nota: ehNota ? nota : '',
      conceito: !ehNota ? conceito : '',
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
      dispatch(
        setAtualizarEmAprovacao({
          ...retorno.data,
          ...notaDto,
          ehNota,
        })
      );
      dispatch(setDadosPrincipaisConselhoClasse(dadosPrincipaisConselhoClasse));

      const { auditoria } = retorno.data;

      const temJustificativasDto = idCamposNotasPosConselho;
      temJustificativasDto[idCampo] = auditoria.id;
      dispatch(setIdCamposNotasPosConselho(temJustificativasDto));

      limparDadosNotaPosConselhoJustificativa();

      sucesso(
        `${ehNota ? 'Nota' : 'Conceito'} pós-conselho ${
          ehNota ? 'salva' : 'salvo'
        } com sucesso`
      );

      if (bimestreAtual && bimestreAtual.valor === 'final') {
        this.gerarParecerConclusivo(
          conselhoClasseId,
          fechamentoTurmaId,
          alunoCodigo
        );
      }

      const dadosCarregar = _.cloneDeep(dadosListasNotasConceitos);
      dispatch(setDadosIniciaisListasNotasConceitos([...dadosCarregar]));

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
        return true;
      }

      // Voltar para a tela e não executa a ação!
      return false;
    }

    return true;
  };
}

export default new ServicoSalvarConselhoClasse();
