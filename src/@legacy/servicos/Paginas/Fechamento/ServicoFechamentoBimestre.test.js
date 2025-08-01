import ServicoFechamentoBimestre from './ServicoFechamentoBimestre';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('ServicoFechamentoBimestre', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar buscarDados corretamente', async () => {
    await ServicoFechamentoBimestre.buscarDados('T1', 'D1', 2, 1);

    expect(api.get).toHaveBeenCalledWith(
      '/v1/fechamentos/turmas?turmaCodigo=T1&disciplinaCodigo=D1&bimestre=2&semestre=1'
    );
  });

  it('deve chamar reprocessarNotasConceitos corretamente', async () => {
    await ServicoFechamentoBimestre.reprocessarNotasConceitos(123);

    expect(api.post).toHaveBeenCalledWith('/v1/fechamentos/turmas/reprocessar/123');
  });

  it('deve chamar processarReprocessarSintese corretamente', async () => {
    const params = { turmaId: 1, bimestre: 2 };
    await ServicoFechamentoBimestre.processarReprocessarSintese(params);

    expect(api.post).toHaveBeenCalledWith('/v1/fechamentos/turmas/processar', params);
  });

  describe('formatarNotaConceito', () => {
    it('deve retornar valor formatado com uma casa decimal', () => {
      const resultado = ServicoFechamentoBimestre.formatarNotaConceito(8);
      expect(resultado).toBe('8.0');
    });

    it('deve retornar null se valor for null ou undefined', () => {
      expect(ServicoFechamentoBimestre.formatarNotaConceito(null)).toBe(null);
      expect(ServicoFechamentoBimestre.formatarNotaConceito(undefined)).toBe(undefined);
    });

    it('deve retornar o valor original se não for número válido', () => {
      expect(ServicoFechamentoBimestre.formatarNotaConceito('abc')).toBe('abc');
    });
  });

  it('deve chamar obterFechamentoPorBimestre corretamente', async () => {
    await ServicoFechamentoBimestre.obterFechamentoPorBimestre('T2', 1, 3, 'CC1');

    expect(api.get).toHaveBeenCalledWith(
      '/v1/fechamentos/turmas/listar?turmaCodigo=T2&componenteCurricularCodigo=CC1&bimestre=3&semestre=1'
    );
  });

  it('deve chamar salvarFechamentoPorBimestre corretamente', async () => {
    const params = { turmaCodigo: 'T3', bimestre: 4 };
    await ServicoFechamentoBimestre.salvarFechamentoPorBimestre(params);

    expect(api.post).toHaveBeenCalledWith(
      '/v1/fechamentos/turmas/salvar-fechamento',
      params
    );
  });
});
