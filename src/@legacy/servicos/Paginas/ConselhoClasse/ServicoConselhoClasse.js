import { conselhoClasseRecomendacaoTipo } from '~/dtos';
import { store } from '@/core/redux';
import {
  setListaoRecomendacoesAlunoFamilia,
  setListaTiposConceitos,
  setMarcadorParecerConclusivo,
} from '~/redux/modulos/conselhoClasse/actions';
import { erros } from '~/servicos/alertas';
import api from '~/servicos/api';

class ServicoConselhoClasse {
  obterListaAlunos = (turmaCodigo, anoLetivo, periodo) => {
    const url = `v1/fechamentos/turmas/${turmaCodigo}/alunos/anos/${anoLetivo}/semestres/${periodo}`;
    return api.get(url);
  };

  obterFrequenciaAluno = (alunoCodigo, turmaCodigo) => {
    const url = `v1/calendarios/frequencias/alunos/${alunoCodigo}/turmas/${turmaCodigo}/geral`;
    return api.get(url);
  };

  obterAnotacoesRecomendacoes = (
    conselhoClasseId,
    fechamentoTurmaId,
    alunoCodigo,
    codigoTurma,
    bimestre,
    consideraHistorico = false
  ) => {
    const url = `v1/conselhos-classe/${conselhoClasseId || 0}/fechamentos/${
      fechamentoTurmaId || 0
    }/alunos/${alunoCodigo}/turmas/${codigoTurma}/bimestres/${
      bimestre !== 'final' ? bimestre : 0
    }/recomendacoes?consideraHistorico=${consideraHistorico}`;
    return api.get(url);
  };

  obterBimestreAtual = modalidade => {
    return api.get(
      `v1/periodo-escolar/modalidades/${modalidade}/bimestres/atual`
    );
  };

  salvarRecomendacoesAlunoFamilia = params => {
    return api.post('v1/conselhos-classe/recomendacoes', params);
  };

  obterSintese = (
    conselhoClasseId,
    fechamentoTurmaId,
    alunoCodigo,
    turmaId,
    bimestre
  ) => {
    return api.get(
      `v1/conselhos-classe/${conselhoClasseId || 0}/fechamentos/${
        fechamentoTurmaId || 0
      }/alunos/${alunoCodigo}/turmas/${turmaId}/bimestres/${
        bimestre === 'final' ? 0 : bimestre
      }/sintese`
    );
  };

  obterInformacoesPrincipais = (
    turmaCodigo,
    bimestre,
    alunoCodigo,
    ehFinal,
    consideraHistorico
  ) => {
    const url = `v1/conselhos-classe/turmas/${turmaCodigo}/bimestres/${
      bimestre === 'final' ? 0 : bimestre
    }/alunos/${alunoCodigo}/final/${ehFinal}/consideraHistorico/${consideraHistorico}`;
    return api.get(url);
  };

  carregarListaTiposConceito = async periodoFim => {
    const { dispatch } = store;

    if (periodoFim) {
      const lista = await api
        .get(`v1/avaliacoes/notas/conceitos?data=${periodoFim}`)
        .catch(e => erros(e));

      if (lista && lista.data && lista.data.length) {
        const novaLista = lista.data.map(item => {
          item.id = String(item.id);
          return item;
        });
        dispatch(setListaTiposConceitos(novaLista));
      } else {
        dispatch(setListaTiposConceitos([]));
      }
    } else {
      dispatch(setListaTiposConceitos([]));
    }
  };

  acessarParecerConclusivo = (
    conselhoClasseId,
    fechamentoTurmaId,
    alunoCodigo,
    codigoTurma,
    consideraHistorico
  ) => {
    const url = `v1/conselhos-classe/${conselhoClasseId || 0}/fechamentos/${
      fechamentoTurmaId || 0
    }/alunos/${alunoCodigo}/turmas/${codigoTurma}/parecer/consideraHistorico/${consideraHistorico}`;
    return api.get(url);
  };

  obterNotasConceitosConselhoClasse = (
    conselhoClasseId,
    fechamentoTurmaId,
    alunoCodigo,
    turmaId,
    bimestre,
    consideraHistorico = false
  ) => {
    const url = `v1/conselhos-classe/${conselhoClasseId || 0}/fechamentos/${
      fechamentoTurmaId || 0
    }/alunos/${alunoCodigo}/turmas/${turmaId}/bimestres/${
      bimestre === 'final' ? 0 : bimestre
    }/notas?consideraHistorico=${consideraHistorico}`;
    return api.get(url);
  };

  salvarNotaPosConselho = (
    conselhoClasseId,
    fechamentoTurmaId,
    alunoCodigo,
    notaDto,
    codigoTurma,
    bimestre
  ) => {
    const url = `v1/conselhos-classe/${
      conselhoClasseId || 0
    }/notas/alunos/${alunoCodigo}/turmas/${codigoTurma}/bimestres/${
      bimestre !== 'final' ? bimestre : 0
    }/fechamento-turma/${fechamentoTurmaId || 0}`;
    return api.post(url, notaDto);
  };

  obterNotaPosConselho = id => {
    return api.get(`v1/conselhos-classe/detalhamento/${id}`);
  };

  gerarParecerConclusivo = (
    conselhoClasseId,
    fechamentoTurmaId,
    alunoCodigo
  ) => {
    const url = `v1/conselhos-classe/${conselhoClasseId || 0}/fechamentos/${
      fechamentoTurmaId || 0
    }/alunos/${alunoCodigo}/parecer`;
    return api.post(url);
  };

  setarParecerConclusivo = parecer => {
    const { dispatch } = store;
    dispatch(setMarcadorParecerConclusivo(parecer));
  };

  gerarConselhoClasseTurma = (conselhoClasseId, fechamentoTurmaId) => {
    return api.get(
      `v1/conselhos-classe/${conselhoClasseId}/fechamentos/${fechamentoTurmaId}/imprimir`
    );
  };

  gerarConselhoClasseAluno = (
    conselhoClasseId,
    fechamentoTurmaId,
    alunoCodigo,
    frequenciaGlobal
  ) => {
    let url = `/v1/conselhos-classe/${conselhoClasseId}/fechamentos/${fechamentoTurmaId}/alunos/${alunoCodigo}/imprimir`;
    if (frequenciaGlobal) {
      url = `${url}?frequenciaGlobal=${frequenciaGlobal}`;
    }
    return api.get(url);
  };

  obterDadosBimestres = turmaId => {
    return api.get(`/v1/conselhos-classe/turmas/${turmaId}/bimestres`);
  };

  obterVisibilidadeMarcadorParecer = (codigoTurma, alunoCodigo) => {
    return api.get(
      `/v1/conselhos-classe/turmas/${codigoTurma}/alunos/${alunoCodigo}/parecer`
    );
  };

  obterConselhoClasseTurmaFinal = (
    turmaCodigo,
    alunoCodigo,
    consideraHistorico
  ) => {
    const state = store.getState();
    const { conselhoClasse } = state;
    const bimestreAtual = conselhoClasse?.bimestreAtual;

    if (bimestreAtual?.valor !== 'final') {
      return api.get(
        `/v1/conselhos-classe/turmas/${turmaCodigo}/alunos/${alunoCodigo}/consideraHistorico` +
          `/${consideraHistorico}`
      );
    }
    return null;
  };

  obterListaAnotacoesRecomendacoes = async () => {
    const state = store.getState();

    const { dispatch } = store;
    const { conselhoClasse } = state;
    const listaoRecomendacoesAlunoFamilia =
      conselhoClasse?.listaoRecomendacoesAlunoFamilia;

    const aluno = listaoRecomendacoesAlunoFamilia?.listaRecomendacoesAluno;
    const familia = listaoRecomendacoesAlunoFamilia?.listaRecomendacoesFamilia;
    if (!aluno?.length || !familia?.length) {
      const retorno = await api.get('/v1/conselhos-classe/obter-recomendacoes');

      const recomendacoes = retorno?.data;
      if (recomendacoes.length) {
        const params = {
          listaRecomendacoesAluno: recomendacoes.filter(
            item => item.tipo === conselhoClasseRecomendacaoTipo.Aluno
          ),
          listaRecomendacoesFamilia: recomendacoes.filter(
            item => item.tipo === conselhoClasseRecomendacaoTipo.Familia
          ),
        };

        dispatch(setListaoRecomendacoesAlunoFamilia(params));
      }
    }
  };

  validarInconsistencias = (turmaId, bimestre) =>
    api.get(
      `/v1/conselhos-classe/validar-inconsistencias/turma/${turmaId}/bimestre/${bimestre}`
    );
}

export default new ServicoConselhoClasse();
