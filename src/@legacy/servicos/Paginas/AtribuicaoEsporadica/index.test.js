import AtribuicaoEsporadicaServico from './index';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

describe('AtribuicaoEsporadicaServico', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar DREs', async () => {
    const mockResponse = { data: ['dre1', 'dre2'] };
    api.get.mockResolvedValue(mockResponse);

    const resultado = await AtribuicaoEsporadicaServico.buscarDres();

    expect(api.get).toHaveBeenCalledWith('/v1/abrangencias/false/dres');
    expect(resultado).toBe(mockResponse);
  });

  it('deve buscar UEs por DRE ID', async () => {
    const dreId = '123';
    const mockResponse = { data: ['ue1', 'ue2'] };
    api.get.mockResolvedValue(mockResponse);

    const resultado = await AtribuicaoEsporadicaServico.buscarUes(dreId);

    expect(api.get).toHaveBeenCalledWith(`/v1/abrangencias/false/dres/${dreId}/ues`);
    expect(resultado).toBe(mockResponse);
  });

  it('deve salvar atribuição esporádica', async () => {
    const atribuicao = { professor: 'RF123', turma: 'A' };
    const mockResponse = { status: 201 };
    api.post.mockResolvedValue(mockResponse);

    const resultado = await AtribuicaoEsporadicaServico.salvarAtribuicaoEsporadica(atribuicao);

    expect(api.post).toHaveBeenCalledWith(`/v1/atribuicao/esporadica`, atribuicao);
    expect(resultado).toBe(mockResponse);
  });

  it('deve buscar atribuição esporádica por ID', async () => {
    const id = '456';
    const mockResponse = { data: { id, turma: 'B' } };
    api.get.mockResolvedValue(mockResponse);

    const resultado = await AtribuicaoEsporadicaServico.buscarAtribuicaoEsporadica(id);

    expect(api.get).toHaveBeenCalledWith(`/v1/atribuicao/esporadica/${id}`);
    expect(resultado).toBe(mockResponse);
  });

  it('deve deletar atribuição esporádica por ID', async () => {
    const id = '789';
    const mockResponse = { status: 204 };
    api.delete.mockResolvedValue(mockResponse);

    const resultado = await AtribuicaoEsporadicaServico.deletarAtribuicaoEsporadica(id);

    expect(api.delete).toHaveBeenCalledWith(`/v1/atribuicao/esporadica/${id}`);
    expect(resultado).toBe(mockResponse);
  });

  it('deve obter períodos por UE e ano letivo', async () => {
    const ueId = 'ue789';
    const anoLetivo = 2025;
    const mockResponse = { data: ['1º Bimestre', '2º Bimestre'] };
    api.get.mockResolvedValue(mockResponse);

    const resultado = await AtribuicaoEsporadicaServico.obterPeriodos(ueId, anoLetivo);

    expect(api.get).toHaveBeenCalledWith(
      `/v1/atribuicao/esporadica/periodos/ues/${ueId}/anos/${anoLetivo}`
    );
    expect(resultado).toBe(mockResponse);
  });
});
