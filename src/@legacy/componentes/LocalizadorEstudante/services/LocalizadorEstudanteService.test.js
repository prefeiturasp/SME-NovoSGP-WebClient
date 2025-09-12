jest.mock('~/servicos/api');

import api from '~/servicos/api';
import LocalizadorEstudanteService from './LocalizadorEstudanteService';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
    },
  },
}));

describe('LocalizadorEstudanteService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buscarPorNome', () => {
    it('deve chamar api.post com a URL e os parâmetros corretos', async () => {
      const mockParams = {
        nomeEstudante: 'João da Silva',
        turmaCodigo: '123',
      };
      const mockResponse = { data: [{ id: 1, nome: 'João da Silva' }] };
      api.post.mockResolvedValue(mockResponse);

      const resultado = await LocalizadorEstudanteService.buscarPorNome(
        mockParams
      );

      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith(
        '/v1/estudante/pesquisa',
        mockParams
      );
      expect(resultado).toEqual(mockResponse);
    });
  });

  describe('buscarPorCodigo', () => {
    it('deve chamar api.post com a URL e os parâmetros corretos', async () => {
      const mockParams = {
        codigoEstudante: '98765',
        turmaCodigo: '456',
      };
      const mockResponse = {
        data: [{ id: 2, nome: 'Maria Oliveira', codigo: '98765' }],
      };
      api.post.mockResolvedValue(mockResponse);

      const resultado = await LocalizadorEstudanteService.buscarPorCodigo(
        mockParams
      );

      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith(
        '/v1/estudante/pesquisa',
        mockParams
      );
      expect(resultado).toEqual(mockResponse);
    });
  });
});
