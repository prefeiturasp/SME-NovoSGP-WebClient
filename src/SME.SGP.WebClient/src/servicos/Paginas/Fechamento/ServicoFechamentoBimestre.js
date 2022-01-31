import api from '~/servicos/api';
import { mockFechamentoConceito } from './mockFechamentoConceito';
import { mockFechamentoNota } from './mockFechamentoNota';

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
    disciplinaCodigo
  ) {
    console.log(`turmaCodigo: ${turmaCodigo}`);
    console.log(`disciplinaCodigo: ${disciplinaCodigo}`);
    console.log(`bimestre: ${bimestre}`);
    console.log(`semestre: ${semestre}`);

    return new Promise(resolve => {
      setTimeout(() => {
        // resolve({ data: mockFechamentoNota });
        resolve({ data: mockFechamentoConceito });
      }, 2000);
    });
  },
};

export default ServicoFechamentoBimestre;
