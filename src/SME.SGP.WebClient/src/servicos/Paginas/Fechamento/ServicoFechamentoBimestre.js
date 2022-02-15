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
    return isNaN(novoValor) ? valor : novoValor;
  },

  obterFechamentoPorBimestre(
    turmaCodigo,
    semestre,
    bimestre,
    componenteCurricularCodigo,
    fechamentoTurmaId
  ) {
    // TODO - Alterar endpoint
    // return api.get(
    //   `${urlBase}/listar?turmaCodigo=${turmaCodigo}&componenteCurricularCodigo=${componenteCurricularCodigo}&bimestre=${bimestre}&semestre=${semestre}&fechamentoTurmaId=${fechamentoTurmaId}`
    // );
    return api.get(
      `${urlBase}/listar?turmaCodigo=${turmaCodigo}&componenteCurricularCodigo=${componenteCurricularCodigo}&bimestre=${bimestre}&semestre=${semestre}`
    );
  },
  salvarFechamentoPorBimestre(params) {
    return api.post(`${urlBase}/salvar-fechamento`, params);
  },
  obterChavesFechamentoListao(turmaId, bimestre) {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve({
          data: {
            fechamentoTurmaId: 111,
            periodoEscolarId: 222,
            possuiAvaliacao: true,
          },
        });
      }, 2000)
    );
    // TODO - Alterar endpoint
    // return api.get(
    //   `${urlBase}/chaves-fechamento?turmaId=${turmaId}&bimestre=${bimestre}`
    // );
  },
  obterAvaliacoesTabelaFechamento(turmaId, periodoEscolarId) {
    const mock = [
      {
        codigoAluno: 123,
        avaliacoes: [
          {
            nome: 'Avaliação 1',
            data: new Date(),
            notaConceito: '1',
          },
          {
            nome: 'Avaliação teste',
            data: new Date(),
            notaConceito: '5',
          },
          {
            nome: 'Avaliação do bimestre',
            data: new Date(),
            notaConceito: '10',
          },
        ],
      },
      {
        codigoAluno: 321,
        avaliacoes: [
          {
            nome: 'Avaliação debate',
            data: new Date(),
            notaConceito: '1',
          },
        ],
      },
    ];
    return new Promise(resolve =>
      setTimeout(() => {
        resolve({
          data: mock,
        });
      }, 2000)
    );
    // TODO - Alterar endpoint
    // return api.get(
    //   `${urlBase}/chaves-fechamento?turmaId=${turmaId}&bimestre=${bimestre}`
    // );
  },
};

export default ServicoFechamentoBimestre;
