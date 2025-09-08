import AtribuicaoCJServico from './index';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('AtribuicaoCJServico', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar lista com parâmetros', async () => {
    const params = { anoLetivo: 2024 };
    const mockResponse = { data: ['lista'] };
    api.get.mockResolvedValue(mockResponse);

    const resultado = await AtribuicaoCJServico.buscarLista(params);

    expect(api.get).toHaveBeenCalledWith('/v1/atribuicoes/cjs', { params });
    expect(resultado).toBe(mockResponse);
  });

  it('deve buscar atribuições com todos os parâmetros', async () => {
    const mockResponse = { data: ['atribuicoes'] };
    api.get.mockResolvedValue(mockResponse);

    const resultado = await AtribuicaoCJServico.buscarAtribuicoes(
      'ue123', 'mod1', 'turmaA', 'rf456', 2025
    );

    expect(api.get).toHaveBeenCalledWith(
      '/v1/atribuicoes/cjs/ues/ue123/modalidades/mod1/turmas/turmaA/professores/rf456?anoLetivo=2025'
    );
    expect(resultado).toBe(mockResponse);
  });

  it('deve salvar atribuições com dados', async () => {
    const dados = { turma: '1A', rf: '123' };
    const mockResponse = { status: 200 };
    api.post.mockResolvedValue(mockResponse);

    const resultado = await AtribuicaoCJServico.salvarAtribuicoes(dados);

    expect(api.post).toHaveBeenCalledWith('/v1/atribuicoes/cjs', dados);
    expect(resultado).toBe(mockResponse);
  });

  it('deve buscar modalidades por UE e ano', async () => {
    const mockResponse = { data: ['modalidade1'] };
    api.get.mockResolvedValue(mockResponse);

    const resultado = await AtribuicaoCJServico.buscarModalidades('ue456', 2023);

    expect(api.get).toHaveBeenCalledWith('/v1/ues/ue456/modalidades?ano=2023');
    expect(resultado).toBe(mockResponse);
  });

  it('deve buscar turmas com histórico considerado', async () => {
    const mockResponse = { data: ['turma1'] };
    api.get.mockResolvedValue(mockResponse);

    const resultado = await AtribuicaoCJServico.buscarTurmas('ue789', 'mod2', 2022, true);

    expect(api.get).toHaveBeenCalledWith('/v1/ues/ue789/modalidades/mod2?ano=2022&historico=true');
    expect(resultado).toBe(mockResponse);
  });
});
