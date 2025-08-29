import ServicoTipoEvento from './ServicoTipoEvento';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  post: jest.fn(),
  put: jest.fn(),
}));

describe('ServicoTipoEvento', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('salvar', () => {
    it('deve chamar api.post com a url padrão quando id não informado', async () => {
      const evento = { nome: 'Evento Novo' };
      api.post.mockResolvedValue({ data: 'ok' });

      const resposta = await ServicoTipoEvento.salvar(null, evento);

      expect(api.post).toHaveBeenCalledWith('v1/calendarios/eventos/tipos', evento);
      expect(resposta.data).toBe('ok');
    });

    it('deve chamar api.put com a url contendo id quando id informado', async () => {
      const id = 123;
      const evento = { nome: 'Evento Atualizado' };
      api.put.mockResolvedValue({ data: 'ok' });

      const resposta = await ServicoTipoEvento.salvar(id, evento);

      expect(api.put).toHaveBeenCalledWith(`v1/calendarios/eventos/tipos/${id}`, evento);
      expect(resposta.data).toBe('ok');
    });
  });
});
