import ServicoCartaIntencoes from './ServicoCartaIntencoes';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('ServicoCartaIntencoes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obterBimestres', () => {
    it('deve chamar api.get com a URL correta', async () => {
      api.get.mockResolvedValue({ data: ['bimestre1'] });
      const turmaCodigo = 1;
      const componenteCurricularId = 2;
      const resposta = await ServicoCartaIntencoes.obterBimestres(turmaCodigo, componenteCurricularId);
      expect(api.get).toHaveBeenCalledWith(`/v1/carta-intencoes/turmas/1/componente-curricular/2`);
      expect(resposta.data).toEqual(['bimestre1']);
    });
  });

  describe('salvarEditarCartaIntencoes', () => {
    it('deve chamar api.post com os dados', async () => {
      const dados = { texto: 'conteudo' };
      api.post.mockResolvedValue({ data: { sucesso: true } });
      const resposta = await ServicoCartaIntencoes.salvarEditarCartaIntencoes(dados);
      expect(api.post).toHaveBeenCalledWith('/v1/carta-intencoes', dados);
      expect(resposta.data).toEqual({ sucesso: true });
    });
  });

  describe('obterDadosObservacoes', () => {
    it('deve chamar api.get com a URL correta', async () => {
      api.get.mockResolvedValue({ data: ['obs1'] });
      const turmaCodigo = 10;
      const componenteCurricularId = 20;
      const resposta = await ServicoCartaIntencoes.obterDadosObservacoes(turmaCodigo, componenteCurricularId);
      expect(api.get).toHaveBeenCalledWith(
        '/v1/carta-intencoes/turmas/10/componente-curricular/20/observacoes'
      );
      expect(resposta.data).toEqual(['obs1']);
    });
  });

  describe('obterNotificarUsuarios', () => {
    it('deve chamar api.get com os parâmetros corretos', async () => {
      api.get.mockResolvedValue({ data: ['usuario1'] });
      const params = { turmaId: 5, componenteCurricular: 15 };
      const resposta = await ServicoCartaIntencoes.obterNotificarUsuarios(params);
      expect(api.get).toHaveBeenCalledWith(
        '/v1/carta-intencoes/notificacoes/usuarios?turmaId=5&componenteCurricular=15'
      );
      expect(resposta.data).toEqual(['usuario1']);
    });
  });

  describe('salvarEditarObservacao', () => {
    it('deve chamar api.put quando observacaoId existe', async () => {
      api.put.mockResolvedValue({ data: { atualizado: true } });
      const dados = { id: 42, observacao: 'nova observação' };
      const turmaCodigo = 1;
      const componenteCurricularId = 2;
      const resposta = await ServicoCartaIntencoes.salvarEditarObservacao(dados, turmaCodigo, componenteCurricularId);
      expect(api.put).toHaveBeenCalledWith('/v1/carta-intencoes/observacoes/42', { observacao: 'nova observação' });
      expect(resposta.data).toEqual({ atualizado: true });
    });

    it('deve chamar api.post quando observacaoId não existe', async () => {
      api.post.mockResolvedValue({ data: { criado: true } });
      const dados = { observacao: 'nova observação' };
      const turmaCodigo = 1;
      const componenteCurricularId = 2;
      const resposta = await ServicoCartaIntencoes.salvarEditarObservacao(dados, turmaCodigo, componenteCurricularId);
      expect(api.post).toHaveBeenCalledWith(
        '/v1/carta-intencoes/turmas/1/componente-curricular/2/observacoes',
        { observacao: 'nova observação' }
      );
      expect(resposta.data).toEqual({ criado: true });
    });
  });

  describe('excluirObservacao', () => {
    it('deve chamar api.delete com a URL correta', async () => {
      api.delete.mockResolvedValue({ data: { excluido: true } });
      const dados = { id: 77 };
      const resposta = await ServicoCartaIntencoes.excluirObservacao(dados);
      expect(api.delete).toHaveBeenCalledWith('/v1/carta-intencoes/observacoes/77');
      expect(resposta.data).toEqual({ excluido: true });
    });
  });
});
