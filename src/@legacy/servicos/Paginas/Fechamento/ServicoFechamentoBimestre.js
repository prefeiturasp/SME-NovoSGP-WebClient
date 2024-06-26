import api from '~/servicos/api';

const urlBase = '/v1/fechamentos/turmas';

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
    // eslint-disable-next-line no-restricted-globals
    return isNaN(novoValor) ? valor : novoValor;
  },

  obterFechamentoPorBimestre(
    turmaCodigo,
    semestre,
    bimestre,
    componenteCurricularCodigo
  ) {
    return api.get(
      `${urlBase}/listar?turmaCodigo=${turmaCodigo}&componenteCurricularCodigo=${componenteCurricularCodigo}&bimestre=${bimestre}&semestre=${semestre}`
    );
  },
  salvarFechamentoPorBimestre(params) {
    return api.post(`${urlBase}/salvar-fechamento`, params);
  },
};

export default ServicoFechamentoBimestre;
