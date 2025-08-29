import ServicoFechamentoReabertura from './ServicoFechamentoReabertura';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('ServicoFechamentoReabertura', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('salvar', () => {
    it('deve chamar api.put quando parametros.id existir', async () => {
      const parametros = { id: 123, nome: 'Teste' };
      api.put.mockResolvedValue({ data: 'ok' });

      const resposta = await ServicoFechamentoReabertura.salvar(parametros);

      expect(api.put).toHaveBeenCalledWith(
        `v1/fechamentos/reaberturas/123`,
        parametros
      );
      expect(resposta.data).toBe('ok');
    });

    it('deve chamar api.post quando parametros.id não existir', async () => {
      const parametros = { nome: 'Novo teste' };
      api.post.mockResolvedValue({ data: 'ok' });

      const resposta = await ServicoFechamentoReabertura.salvar(parametros);

      expect(api.post).toHaveBeenCalledWith('v1/fechamentos/reaberturas', parametros);
      expect(resposta.data).toBe('ok');
    });
  });

  describe('obterPorId', () => {
    it('deve chamar api.get com o ID correto', async () => {
      api.get.mockResolvedValue({ data: { id: 1, nome: 'Teste' } });
      const resposta = await ServicoFechamentoReabertura.obterPorId(1);

      expect(api.get).toHaveBeenCalledWith('v1/fechamentos/reaberturas/1');
      expect(resposta.data).toEqual({ id: 1, nome: 'Teste' });
    });
  });

  describe('deletar', () => {
    it('deve chamar api.delete com os ids corretos no data', async () => {
      const ids = [1, 2, 3];
      api.delete.mockResolvedValue({ data: 'ok' });

      const resposta = await ServicoFechamentoReabertura.deletar(ids);

      expect(api.delete).toHaveBeenCalledWith('v1/fechamentos/reaberturas', { data: ids });
      expect(resposta.data).toBe('ok');
    });
  });
});
