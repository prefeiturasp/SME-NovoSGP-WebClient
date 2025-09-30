import api from '~/servicos/api';
import LocalizadorEstudantesAtivosService from './LocalizadorEstudantesAtivosService';

jest.mock('~/servicos/api', () => ({
  post: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
}));

describe('LocalizadorEstudantesAtivosService', () => {
  const params = { nome: 'Maria', codigoUe: '123', anoLetivo: 2025 };
  const mockResponse = { data: [{ id: 1, nome: 'Maria' }] };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('buscarPorNome chama api.post com os parâmetros corretos e retorna resposta', async () => {
    api.post.mockResolvedValue(mockResponse);

    const result = await LocalizadorEstudantesAtivosService.buscarPorNome(
      params
    );

    expect(api.post).toHaveBeenCalledWith(
      '/v1/estudantes/autocomplete/ativos',
      params
    );
    expect(result).toBe(mockResponse);
  });

  it('buscarPorNome propaga erro da api.post', async () => {
    const error = new Error('Erro API');
    api.post.mockRejectedValue(error);

    await expect(
      LocalizadorEstudantesAtivosService.buscarPorNome(params)
    ).rejects.toThrow(error);
  });

  it('buscarPorCodigo chama api.post com os parâmetros corretos e retorna resposta', async () => {
    api.post.mockResolvedValue(mockResponse);

    const result = await LocalizadorEstudantesAtivosService.buscarPorCodigo(
      params
    );

    expect(api.post).toHaveBeenCalledWith(
      '/v1/estudantes/autocomplete/ativos',
      params
    );
    expect(result).toBe(mockResponse);
  });

  it('buscarPorCodigo propaga erro da api.post', async () => {
    const error = new Error('Erro API');
    api.post.mockRejectedValue(error);

    await expect(
      LocalizadorEstudantesAtivosService.buscarPorCodigo(params)
    ).rejects.toThrow(error);
  });
});
