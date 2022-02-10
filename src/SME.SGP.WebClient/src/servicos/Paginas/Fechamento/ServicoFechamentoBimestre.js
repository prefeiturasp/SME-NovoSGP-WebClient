import api from '~/servicos/api';

const ServicoFechamentoBimestre = {
  buscarDados(turmaCodigo, disciplinaCodigo, bimestre, periodo) {
    return api.get(
      `/v1/fechamentos/turmas?turmaCodigo=${turmaCodigo}&disciplinaCodigo=${disciplinaCodigo}&bimestre=${bimestre}&semestre=${periodo}`
    );
  },

  reprocessarNotasConceitos(fechamentoId) {
    return api.post(`/v1/fechamentos/turmas/reprocessar/${fechamentoId}`);
  },

  processarReprocessarSintese(params) {
    return api.post('/v1/fechamentos/turmas/processar', params);
  },

  formatarNotaConceito(valor) {
    if (valor == null) return valor;

    const novoValor = Number(valor).toFixed(1);
    return isNaN(novoValor) ? valor : novoValor;
  },

  obterFechamentoPorBimestre(
    turmaCodigo,
    semestre,
    bimestre,
    componenteCurricularCodigo
  ) {
    return api.get(
      `/v1/fechamentos/turmas/listar?turmaCodigo=${turmaCodigo}&componenteCurricularCodigo=${componenteCurricularCodigo}&bimestre=${bimestre}&semestre=${semestre}`
    );
  },
  salvarFechamentoPorBimestre(params) {
    return api.post(`/v1/fechamentos/turmas/salvar-fechamento`, params);
  },
  obterChavesFechamentoListao(turmaId, bimestre) {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve({
          data: {
            fechamentoTurmaId: 123,
            periodoEscolarId: 321,
            possuiAvaliacao: true,
          },
        });
      }, 2000)
    );
    // TODO - Alterar endpoint
    // return api.get(
    //   `/v1/fechamentos/turmas/chaves-fechamento?turmaId=${turmaId}&bimestre=${bimestre}`
    // );
  },
};

export default ServicoFechamentoBimestre;
