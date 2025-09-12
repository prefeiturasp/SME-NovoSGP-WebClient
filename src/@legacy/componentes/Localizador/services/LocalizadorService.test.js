jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
    },
  },
}));

describe('LocalizadorService', () => {
  let api;
  let LocalizadorService;

  beforeEach(() => {
    jest.resetModules();

    api = require('~/servicos/api');
    LocalizadorService = require('./LocalizadorService').default;
  });

  test('deve configurar o interceptor do api ao ser instanciado', () => {
    expect(api.interceptors.request.use).toHaveBeenCalledTimes(1);
  });

  describe('buscarAutocomplete', () => {
    it('deve chamar api.get com a URL e os parâmetros corretos', async () => {
      const mockParams = {
        anoLetivo: 2025,
        dreId: 'dre-123',
        nome: 'JOAO',
        ueId: 'ue-456',
      };
      const mockResponse = { data: [{ nome: 'JOAO SILVA' }] };
      api.get.mockResolvedValue(mockResponse);

      const resultado = await LocalizadorService.buscarAutocomplete(mockParams);

      const expectedUrl = '/v1/professores/2025/autocomplete/dre-123';
      const expectedParams = {
        params: { nomeProfessor: 'JOAO', ueId: 'ue-456' },
      };

      expect(api.get).toHaveBeenCalledWith(expectedUrl, expectedParams);
      expect(resultado).toEqual(mockResponse);
    });
  });

  describe('buscarPorRf', () => {
    it('deve chamar a URL padrão quando buscarPorAbrangencia for falso', async () => {
      const mockParams = {
        anoLetivo: 2025,
        rf: 'rf-123',
        buscarOutrosCargos: true,
        buscarPorAbrangencia: false,
      };
      api.get.mockResolvedValue({ data: 'dados do professor' });

      await LocalizadorService.buscarPorRf(mockParams);

      const expectedUrl = '/v1/professores/rf-123/resumo/2025';
      const expectedParams = {
        params: expect.objectContaining({ buscarOutrosCargos: true }),
      };

      expect(api.get).toHaveBeenCalledWith(expectedUrl, expectedParams);
    });

    it('deve chamar a URL de abrangência quando buscarPorAbrangencia for verdadeiro', async () => {
      const mockParams = {
        anoLetivo: 2025,
        rf: 'rf-123',
        buscarOutrosCargos: true,
        buscarPorAbrangencia: true,
      };
      api.get.mockResolvedValue({ data: 'dados do professor por abrangencia' });

      await LocalizadorService.buscarPorRf(mockParams);

      const expectedUrl = '/v1/professores/rfs/rf-123/anos-letivos/2025/buscar';
      const expectedParams = {
        params: expect.objectContaining({ buscarOutrosCargos: null }),
      };

      expect(api.get).toHaveBeenCalledWith(expectedUrl, expectedParams);
    });
  });

  describe('buscarPessoa', () => {
    const mockParams = { rf: 'rf-123', nome: 'JOAO' };

    const urlEsperada = undefined;

    it('deve retornar um objeto de sucesso quando a api.post resolve', async () => {
      const mockApiResponse = { data: { id: 1, nome: 'JOAO' } };
      api.post.mockResolvedValue(mockApiResponse);

      const resultado = await LocalizadorService.buscarPessoa(mockParams);

      expect(api.post).toHaveBeenCalledWith(urlEsperada, mockParams);
      expect(resultado).toEqual({
        sucesso: true,
        mensagem: 'Foi encontrado',
        dados: mockApiResponse.data,
      });
    });

    it('deve retornar um objeto de erro quando a api.post rejeita', async () => {
      const mockError = new Error('Erro de rede');
      api.post.mockRejectedValue(mockError);

      const resultado = await LocalizadorService.buscarPessoa(mockParams);

      expect(api.post).toHaveBeenCalledWith(urlEsperada, mockParams);
      expect(resultado).toEqual({
        sucesso: false,
        erroGeral: `Não foi encontrado! ${mockError}`,
      });
    });
  });
});
