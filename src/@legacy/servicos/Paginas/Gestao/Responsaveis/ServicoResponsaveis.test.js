import ServicoResponsaveis from './ServicoResponsaveis';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('ServicoResponsaveis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve obter o tipo de responsável', async () => {
    api.get.mockResolvedValue({ data: ['tipo1', 'tipo2'] });

    const resultado = await ServicoResponsaveis.obterTipoReponsavel();

    expect(api.get).toHaveBeenCalledWith('v1/supervisores/tipo-responsavel');
    expect(resultado.data).toEqual(['tipo1', 'tipo2']);
  });

  it('deve salvar uma atribuição', async () => {
    const dados = { responsavelId: 1, ueId: 10 };
    api.post.mockResolvedValue({ status: 200 });

    const resultado = await ServicoResponsaveis.salvarAtribuicao(dados);

    expect(api.post).toHaveBeenCalledWith('v1/supervisores/atribuir-ue', dados);
    expect(resultado.status).toBe(200);
  });

  describe('obterResponsaveis', () => {
    it('deve obter responsáveis com tipoResponsavelAtribuicao', async () => {
      api.get.mockResolvedValue({ data: ['responsavel1'] });

      const resultado = await ServicoResponsaveis.obterResponsaveis('DRE1', 'tipoA');

      expect(api.get).toHaveBeenCalledWith('v1/supervisores/dre/DRE1?tipoResponsavelAtribuicao=tipoA');
      expect(resultado.data).toEqual(['responsavel1']);
    });

    it('deve obter responsáveis sem tipoResponsavelAtribuicao', async () => {
      api.get.mockResolvedValue({ data: ['responsavel2'] });

      const resultado = await ServicoResponsaveis.obterResponsaveis('DRE2');

      expect(api.get).toHaveBeenCalledWith('v1/supervisores/dre/DRE2');
      expect(resultado.data).toEqual(['responsavel2']);
    });
  });

  it('deve obter UEs sem atribuição', async () => {
    api.get.mockResolvedValue({ data: ['UE1', 'UE2'] });

    const resultado = await ServicoResponsaveis.obterUesSemAtribuicao('DRE3', 5);

    expect(api.get).toHaveBeenCalledWith('v1/dres/DRE3/ues/sem-atribuicao/5');
    expect(resultado.data).toEqual(['UE1', 'UE2']);
  });

  it('deve obter UEs atribuídas', async () => {
    api.get.mockResolvedValue({ data: ['UE3'] });

    const resultado = await ServicoResponsaveis.obterUesAtribuidas(7, 'DRE4', 'tipoB');

    expect(api.get).toHaveBeenCalledWith('v1/supervisores/7/dre/DRE4/tipoB');
    expect(resultado.data).toEqual(['UE3']);
  });
});
