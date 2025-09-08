import ServicoEvento from './ServicoEvento';
import api from '~/servicos/api';
import AbrangenciaServico from '~/servicos/Abrangencia';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('~/servicos/Abrangencia', () => ({
  buscarUes: jest.fn(),
}));

describe('ServicoEvento', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('salvar', () => {
    it('deve chamar api.post quando id não informado', async () => {
      const evento = { nome: 'Evento Teste' };
      api.post.mockResolvedValue({ data: 'ok' });

      const resposta = await ServicoEvento.salvar(null, evento);

      expect(api.post).toHaveBeenCalledWith('v1/calendarios/eventos', evento);
      expect(resposta.data).toBe('ok');
    });

    it('deve chamar api.put quando id informado', async () => {
      const id = 123;
      const evento = { nome: 'Evento Atualizado' };
      api.put.mockResolvedValue({ data: 'ok' });

      const resposta = await ServicoEvento.salvar(id, evento);

      expect(api.put).toHaveBeenCalledWith('v1/calendarios/eventos/123', evento);
      expect(resposta.data).toBe('ok');
    });
  });

  describe('obterPorId', () => {
    it('deve chamar api.get com o ID correto', async () => {
      api.get.mockResolvedValue({ data: { id: 1, nome: 'Evento' } });
      const resposta = await ServicoEvento.obterPorId(1);

      expect(api.get).toHaveBeenCalledWith('v1/calendarios/eventos/1');
      expect(resposta.data).toEqual({ id: 1, nome: 'Evento' });
    });
  });

  describe('deletar', () => {
    it('deve chamar api.delete com os ids corretos no data', async () => {
      const ids = [1, 2, 3];
      api.delete.mockResolvedValue({ data: 'ok' });

      const resposta = await ServicoEvento.deletar(ids);

      expect(api.delete).toHaveBeenCalledWith('v1/calendarios/eventos', { data: ids });
      expect(resposta.data).toBe('ok');
    });
  });

  describe('listarDres', () => {
    it('deve retornar sucesso true e dados quando api.get resolve', async () => {
      const dados = ['dre1', 'dre2'];
      api.get.mockResolvedValue({ data: dados });

      const resposta = await ServicoEvento.listarDres();

      expect(api.get).toHaveBeenCalledWith('v1/abrangencias/false/dres');
      expect(resposta).toEqual({ sucesso: true, conteudo: dados });
    });

    it('deve retornar sucesso false e erro quando api.get rejeita', async () => {
      api.get.mockRejectedValue(new Error('Falha'));

      const resposta = await ServicoEvento.listarDres();

      expect(resposta).toEqual({
        sucesso: false,
        erro: 'ocorreu uma falha ao consultar as dres',
      });
    });
  });

  describe('listarUes', () => {
    const dre = 'dreTest';
    const modalidade = 'modalidadeTest';

    it('deve retornar sucesso true e dados quando AbrangenciaServico.buscarUes resolve', async () => {
      const dados = ['ue1', 'ue2'];
      AbrangenciaServico.buscarUes.mockResolvedValue({ data: dados });

      const resposta = await ServicoEvento.listarUes(dre, modalidade);

      expect(AbrangenciaServico.buscarUes).toHaveBeenCalledWith(dre, '', false, modalidade);
      expect(resposta).toEqual({ sucesso: true, conteudo: dados });
    });

    it('deve retornar sucesso false e erro quando AbrangenciaServico.buscarUes rejeita', async () => {
      AbrangenciaServico.buscarUes.mockRejectedValue(new Error('Erro'));

      const resposta = await ServicoEvento.listarUes(dre, modalidade);

      expect(resposta).toEqual({
        sucesso: false,
        erro: 'ocorreu uma falha ao consultar as unidades escolares',
      });
    });
  });

  describe('obterTiposEventos', () => {
    it('deve chamar api.get com a URL correta', async () => {
      const tipos = ['tipo1', 'tipo2'];
      api.get.mockResolvedValue({ data: tipos });

      const resposta = await ServicoEvento.obterTiposEventos();

      expect(api.get).toHaveBeenCalledWith('v1/calendarios/eventos/tipos/listar');
      expect(resposta.data).toEqual(tipos);
    });
  });
});
