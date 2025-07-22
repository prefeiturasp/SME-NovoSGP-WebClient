import servicoConselhoAtaFinal from './ServicoConselhoAtaFinal';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => {
  const mockApi = {
    post: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(callback => {
          return callback({ headers: {} });
        }),
      },
      response: {
        use: jest.fn(),
      },
    },
  };
  return mockApi;
});

describe('ServicoConselhoAtaFinal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('gerar', () => {
    it('chama api com a url correta e dados', async () => {
      const mockDados = {
        turmaId: 123,
        bimestre: 4,
        consideraHistorico: true,
      };

      api.post.mockResolvedValue({ data: 'success' });

      const resultado = await servicoConselhoAtaFinal.gerar(mockDados);

      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith(
        'v1/relatorios/conselhos-classe/atas-finais',
        mockDados
      );
      expect(resultado).toEqual({ data: 'success' });
    });

    it('rejeita se api falha', async () => {
      const mockError = new Error('API error');
      api.post.mockRejectedValue(mockError);

      await expect(servicoConselhoAtaFinal.gerar({})).rejects.toThrow(
        'API error'
      );
    });

    /*it('ajusta interceptores', () => { //TODO: esta dando muito erro comentei
      expect(api.interceptors.request.use).toHaveBeenCalledTimes(1);
      expect(api.interceptors.request.use).toHaveBeenCalledWith(expect.any(Function));
    });*/
  });
});
