import ServicoRelatorioDinamicoNAAPA from './ServicoRelatorioDinamicoNAAPA';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('ServicoRelatorioDinamicoNAAPA', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obterDados', () => {
    it('deve chamar api.post com a url e parametros corretos', async () => {
      const params = { filtro: 'teste' };
      const numeroPagina = 2;
      const numeroRegistros = 10;
      api.post.mockResolvedValue({ data: 'resultado' });

      const resultado = await ServicoRelatorioDinamicoNAAPA.obterDados(params, numeroPagina, numeroRegistros);

      expect(api.post).toHaveBeenCalledWith(
        `v1/relatorio-dinamico-naapa?numeroPagina=${numeroPagina}&numeroRegistros=${numeroRegistros}`,
        params
      );
      expect(resultado).toEqual({ data: 'resultado' });
    });
  });

  describe('obterQuestoes', () => {
    it('deve chamar api.get com os parametros e serializador corretos', async () => {
      const modalidadesId = [1, 2];
      api.get.mockResolvedValue({ data: ['questao1', 'questao2'] });

      const resultado = await ServicoRelatorioDinamicoNAAPA.obterQuestoes(modalidadesId);

      expect(api.get).toHaveBeenCalledWith('v1/relatorio-dinamico-naapa/questoes', {
        params: {
          modalidadesId,
        },
        paramsSerializer: {
          serialize: expect.any(Function),
        },
      });
      expect(resultado).toEqual({ data: ['questao1', 'questao2'] });

      const serialize = api.get.mock.calls[0][1].paramsSerializer.serialize;
      const serialized = serialize({ modalidadesId: modalidadesId });
      
      expect(serialized).toContain('modalidadesId=1');
      expect(serialized).toContain('modalidadesId=2');

    });
  });
});
