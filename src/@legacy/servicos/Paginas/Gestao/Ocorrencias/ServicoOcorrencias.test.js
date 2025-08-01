import ServicoOcorrencias from './ServicoOcorrencias';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('ServicoOcorrencias', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve excluir uma ocorrência', async () => {
    const parametros = { data: { id: 1 } };
    api.delete.mockResolvedValue({ status: 200 });

    const resultado = await ServicoOcorrencias.excluir(parametros);

    expect(api.delete).toHaveBeenCalledWith('v1/ocorrencias', parametros);
    expect(resultado.status).toBe(200);
  });

  it('deve buscar os tipos de ocorrências', async () => {
    api.get.mockResolvedValue({ data: ['tipo1', 'tipo2'] });

    const resultado = await ServicoOcorrencias.buscarTiposOcorrencias();

    expect(api.get).toHaveBeenCalledWith('v1/ocorrencias/tipos');
    expect(resultado.data).toContain('tipo1');
  });

  it('deve buscar crianças por turma', async () => {
    api.get.mockResolvedValue({ data: ['aluno1', 'aluno2'] });

    const resultado = await ServicoOcorrencias.buscarCriancas(123);

    expect(api.get).toHaveBeenCalledWith(
      'v1/registros-individuais/turmas/123/componentes-curriculares/0/alunos'
    );
    expect(resultado.data).toContain('aluno1');
  });

  it('deve incluir uma ocorrência', async () => {
    const parametros = { tipo: 'agressao' };
    api.post.mockResolvedValue({ status: 201 });

    const resultado = await ServicoOcorrencias.incluir(parametros);

    expect(api.post).toHaveBeenCalledWith('v1/ocorrencias', parametros);
    expect(resultado.status).toBe(201);
  });

  it('deve alterar uma ocorrência', async () => {
    const parametros = { id: 1, tipo: 'atualizado' };
    api.put.mockResolvedValue({ status: 200 });

    const resultado = await ServicoOcorrencias.alterar(parametros);

    expect(api.put).toHaveBeenCalledWith('v1/ocorrencias', parametros);
    expect(resultado.status).toBe(200);
  });

  it('deve buscar uma ocorrência por ID', async () => {
    api.get.mockResolvedValue({ data: { id: 1, tipo: 'fuga' } });

    const resultado = await ServicoOcorrencias.buscarOcorrencia(1);

    expect(api.get).toHaveBeenCalledWith('v1/ocorrencias/1');
    expect(resultado.data.id).toBe(1);
  });

  it('deve gerar relatório de ocorrências', async () => {
    const parametros = { turmaId: 123 };
    api.post.mockResolvedValue({ data: 'relatorio.pdf' });

    const resultado = await ServicoOcorrencias.gerar(parametros);

    expect(api.post).toHaveBeenCalledWith('v1/relatorios/ocorrencias', parametros);
    expect(resultado.data).toBe('relatorio.pdf');
  });
});
